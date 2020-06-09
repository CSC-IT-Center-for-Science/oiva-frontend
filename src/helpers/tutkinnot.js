/**
 * Tiedostossa sijaitsevien funktioiden tarkoitus on muodostaa tutkinto
 * backendiltä tulevan datan pohjalta, liittää sille määräys - jos
 * sellainen tutkinnolla on - ja lisätä tutkinnolle mm. tieto
 * sille asetetuista tutkintokielistä. Muodostettua objektia käytetään
 * apuna backendille lähetettävien muutosobjektien rakentamisessa.
 */

import {
  head,
  dissoc,
  flatten,
  map,
  mapObjIndexed,
  groupBy,
  prop,
  compose,
  endsWith,
  filter,
  includes,
  find,
  propEq,
  equals,
  path,
  append,
  assocPath,
  addIndex,
  reject,
  assoc,
  isEmpty,
  slice,
  lastIndexOf,
  replace,
  startsWith
} from "ramda";
import localforage from "localforage";
import {
  getAnchorPart,
  getAnchorInit,
  findObjectWithKey
} from "../utils/common";
import { fillForBackend } from "../services/lomakkeet/backendMappings";

export function getTutkinnotFromStorage() {
  return localforage.getItem("tutkinnot");
}

export async function getTutkinnotGroupedByKey(key) {
  const tutkinnot = await getTutkinnotFromStorage();
  return groupBy(prop(key), tutkinnot);
}

/**
 * Palauttaa kaikki tutkinnot, jotka ovat muutokset huomioiden aktiivisia.
 * @param {array} tutkinnot
 * @param {array} changeObjects
 */
export function isAnyOfTutkinnotActive(tutkinnot = [], changeObjects = []) {
  const activeOnes = filter(tutkinto => {
    const anchor = `tutkinnot_${tutkinto.koulutusalaKoodiarvo}.${tutkinto.koulutustyyppiKoodiarvo}.${tutkinto.koodiarvo}.tutkinto`;
    const changeObj = find(propEq("anchor", anchor), changeObjects);
    return (
      (!!tutkinto.maarays && !changeObj) ||
      (changeObj && changeObj.properties.isChecked)
    );
  }, tutkinnot);
  return activeOnes.length > 0;
}

export const initializeTutkinto = ({
  koodiArvo: koodiarvo,
  koodisto,
  metadata,
  versio,
  voimassaAlkuPvm,
  koulutustyyppiKoodiArvo: koulutustyyppiKoodiarvo,
  koulutusalaKoodiArvo: koulutusalaKoodiarvo
}) => {
  return {
    koodiarvo,
    koodisto,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), metadata)),
    versio,
    voimassaAlkuPvm,
    koulutustyyppiKoodiarvo,
    koulutusalaKoodiarvo
  };
};

export const initializeMaarays = (tutkinto, maarays) => {
  return { ...tutkinto, maarays: head(dissoc("aliMaaraykset", maarays)) };
};

export const initializeTutkintokielet = (tutkinto, maaraykset = []) => {
  const tutkintokielet = flatten(
    map(maarays => {
      return map(alimaarays => {
        if (alimaarays.koodisto === "kieli") {
          return {
            ...alimaarays,
            koodi: {
              ...alimaarays.koodi,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), alimaarays.koodi.metadata)
              )
            }
          };
        }
        return null;
      }, maarays.aliMaaraykset || []).filter(Boolean);
    }, maaraykset).filter(Boolean)
  );
  return { ...tutkinto, tutkintokielet };
};

export const initializeOsaamisalat = (tutkinto, osaamisalat) => {
  const alimaaraykset = path(["maarays", "aliMaaraykset"], tutkinto) || [];
  return {
    ...dissoc("aliMaaraykset", tutkinto),
    osaamisalat: map(osaamisala => {
      return {
        ...dissoc("koodiArvo", osaamisala),
        maarays: find(propEq(osaamisala.koodiArvo), alimaaraykset),
        koodiarvo: osaamisala.koodiArvo,
        metadata: mapObjIndexed(
          head,
          groupBy(prop("kieli"), osaamisala.metadata)
        )
      };
    }, osaamisalat)
  };
};

function findBackendmuutos(anchor, backendmuutokset) {
  const backendmuutos = find(muutos => {
    return !!find(propEq("anchor", anchor), muutos.meta.changeObjects);
  }, backendmuutokset);
  if (!backendmuutos && includes(".", anchor)) {
    return findBackendmuutos(getAnchorInit(anchor), backendmuutokset);
  }
  return { anchor, backendmuutos };
}

/**
 * Function returns change objects related to reasoning (perustelut)
 * and to current anchor. There are different methods to find the
 * correct change objects.
 * @param {string} anchor - Dot separated string, id of a change object.
 * @param {array} changeObjects - Array of change objects.
 */
function findPerustelut(anchor, changeObjects) {
  function getPerustelut(anchor, perustelut, method = includes) {
    return filter(compose(method(anchor), prop("anchor")), perustelut);
  }
  // Method 1: Add perustelut_ string in front of the anchor.
  let perustelutAnchor = `perustelut_${anchor}`;
  let perustelut = getPerustelut(perustelutAnchor, changeObjects);
  if (isEmpty(perustelut)) {
    // Method 2: Remove the last part of the anchor and try method 1 again.
    let anchorInit = slice(0, lastIndexOf(".", anchor), anchor);
    perustelutAnchor = `perustelut_${anchorInit}`;
    perustelut = getPerustelut(perustelutAnchor, changeObjects);
    if (isEmpty(perustelut)) {
      // Method 3: Take the anchor of method to and replace the dots with
      // underscores.
      perustelutAnchor = `perustelut_${replace(".", "_", anchorInit)}`;
      perustelut = getPerustelut(perustelutAnchor, changeObjects, startsWith);
    }
  }
  return perustelut;
}

export const defineBackendChangeObjects = async (
  changeObjects = {},
  kohde,
  maaraystyypit,
  locale = "FI",
  backendmuutokset = []
) => {
  if (!kohde) {
    console.warn("Kohde is missing!");
    return null;
  } else if (!maaraystyypit) {
    console.warn("Array of määräystyypit is missing!");
    return null;
  }

  /**
   * Haetaan ensin lokaalista säilöstä eli IndexedDB:stä, WebSQL:stä tai
   * localStorage:sta objekti, joka sisältää tiedot kaikista tutkinnoista.
   */
  const tutkinnot = await getTutkinnotFromStorage();

  /**
   * Koska osaamisalat linkittyvät tutkintoihin, tulee frontin muutosten
   * joukosta seuloa nimenomaan tutkintoja koskevat muutokset ja käsitellä
   * kuhunkin tutkintoon liittyvien osaamisalojen muutokset kyseisen
   * tutkintomuutoksen alaisuudessa.
   */
  const tutkintoChangeObjects = filter(
    compose(endsWith(".tutkinto"), prop("anchor")),
    changeObjects.muutokset
  );

  /**
   * On tarkoitus, että backendChangeObjects tulee sisältämään kaikki
   * backendin tarvitsemat muutosobjektit.
   */
  const backendChangeObjects = map(changeObj => {
    /**
     * Etsitään tutkinto, jota muutos koskee. Sen pitäisi löytyä juuri
     * noudettujen tutkintojen joukosta tutkinnon koodiarvoa käyttämällä.
     */
    const koodiarvo = getAnchorPart(changeObj.anchor, 2);
    const tutkinto = tutkinnot[koodiarvo];

    /**
     * Jos tutkinto löytyi, hyödynnämme sen tietoja muutosobjektia
     * kasatessamme.
     **/
    if (tutkinto) {
      /**
       * Tutkinto kuuluu lupaan, jos sillä on määräys.
       */
      const isTutkintoInLupa = !!tutkinto.maarays;

      /**
       * Selvitetään, onko fronttimuutosta vastaava backend-muutos jo olemassa.
       * Jos on, päivitetään muutosobjekti. Jos backend-muutosta ei ole,
       * luodaan uudet muutosobjektit.
       */
      let { anchor, backendmuutos } = findBackendmuutos(
        changeObj.anchor,
        backendmuutokset
      );

      /**
       * OLEMASSA OLEVIEN MUUTOSOBJEKTIEN PÄIVITTÄMINEN
       *
       * Jos käyttöliittymässä tehty muutos linkittyy backendiltä tulleeseen
       * muutokseen, ei luoda uutta muutosobjektia, vaan päivitetään olemassa
       * olevaa. Linkittyminen on mahdollista vain, jos lomake on tallennettu
       * yhden tai useamman kerran.
       */
      if (backendmuutos) {
        console.info(
          "PÄIVITETÄÄN OLEMASSA OLEVA MUUTOSOBJEKTI.",
          changeObj.anchor,
          backendmuutos,
          backendmuutokset
        );
        let backendMuutosWithPerustelut = [];
        let backendMuutosWithChangeObjectsWithPerustelut = [];

        const perustelut = findPerustelut(anchor, changeObjects.perustelut);
        const perustelutForBackend = fillForBackend(perustelut, anchor);
        if (!perustelutForBackend) {
          const perusteluTexts = reject(equals(null))(
            map(perustelu => {
              if (path(["properties", "value"], perustelu)) {
                return { value: path(["properties", "value"], perustelu) };
              }
              return {
                value: path(["properties", "metadata", "fieldName"], perustelu)
              };
            }, perustelut)
          );
          backendMuutosWithPerustelut = assocPath(
            ["meta", "perusteluteksti"],
            perusteluTexts,
            backendmuutos
          );
        } else {
          backendMuutosWithPerustelut = assoc(
            "meta",
            perustelutForBackend,
            backendmuutos
          );
        }
        backendMuutosWithChangeObjectsWithPerustelut = assocPath(
          ["meta", "changeObjects"],
          flatten([[changeObj], perustelut]),
          backendMuutosWithPerustelut
        );
        // Let's add the attachments
        return assocPath(
          ["liitteet"],
          map(file => {
            return dissoc("tiedosto", file);
          }, findObjectWithKey(changeObjects, "attachments")),
          backendMuutosWithChangeObjectsWithPerustelut
        );
      } else {
        /**
         * UUSIEN MUUTOSOBJEKTIN LUOMINEN
         *
         * Jos käyttöliittymässä tehty muutos ei linkity mihinkään backendiltä
         * tulleeseen muutokseen, on luotava uusi muutosobjekti. Koska
         * osaamisalat linkittyvät tutkintoihin, tulee frontin muutosten joukosta
         * seuloa nimenomaan tutkintoja koskevat muutokset ja käsitellä kuhunkin
         * tutkintoon liittyvien osaamisalojen muutokset kyseisen
         * tutkintomuutoksen alaisuudessa.
         */

        const anchorInit = getAnchorInit(changeObj.anchor);

        /**
         * Käyttäjälle tarjotaan mahdollisuutta perustella muutokset.
         * Perustelut ovat omia frontin puolen muutosobjektejaan, jotka
         * liitetään osaksi muodostettavaa - backendin kaipaamaa -
         * muutosobjektia.
         */
        const perustelut = filter(
          compose(includes(anchorInit), prop("anchor")),
          changeObjects.perustelut
        );

        /**
         * Tässä vaiheessa meillä on kasassa kaikki tarvittava tutkintoa
         * koskevan muutosobjektin luomiseksi. Ainoa tilanne, jolloin
         * muutosobjekti tarvitaan, on se, kun käyttäjä on joko aktivoinut
         * tai deaktivoinut tutkinnon. Tarkistetaan, miten asia on.
         */
        const isMuutosobjektiNeeded =
          changeObj.properties.isChecked !== isTutkintoInLupa;

        /**
         * On paikallaan määritellä tutkintomuutos muokattavana objektina,
         * koska siihen on myöhemmässä vaiheessa tarkoitus liittää osaamisaloja
         * koskevat käyttöliittymäpuolen muutosobjektit.
         */
        let tutkintomuutos = isMuutosobjektiNeeded
          ? {
              kohde,
              koodiarvo: tutkinto.koodiarvo,
              koodisto: tutkinto.koodisto.koodistoUri,
              kuvaus: tutkinto.metadata[locale].kuvaus,
              maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
              meta: {
                changeObjects: flatten([[changeObj], perustelut]),
                nimi: tutkinto.metadata[locale].nimi,
                koulutusala: tutkinto.koulutusalaKoodiarvo,
                koulutustyyppi: tutkinto.koulutustyyppiKoodiarvo,
                perusteluteksti: "", // TODO: Täydennä oikea perusteluteksti
                muutosperustelukoodiarvo: [] // Tarvitaanko tätä oikeasti?
              },
              nimi: tutkinto.metadata[locale].nimi,
              tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
            }
          : null;

        if (!!tutkintomuutos) {
          // GenratedId on tarpeellinen vain lisättäessä tutkintoa lupaan.
          if (tutkintomuutos.tila === "LISAYS") {
            tutkintomuutos.generatedId = changeObj.properties.isChecked
              ? changeObj.anchor
              : undefined;
          }
          // Jos tutkinto kuuluu lupaan, asetetaan määräyksen uuid
          if (isTutkintoInLupa) {
            tutkintomuutos.maaraysUuid = tutkinto.maarays.uuid;
          }
        }

        /**
         * Seuraavaksi on käytävä läpi tarkasteltavan tutkinnon osaamisalat
         * ja tarkistettava, onko niihin kohdistettu muutoksia.
         */
        const osaamisalamuutokset = addIndex(map)((osaamisala, index) => {
          const isOsaamisalaRajoiteInLupa = !!osaamisala.maarays;

          let osaamisalamuutos = null;

          const osaamisalaChangeObj = find(changeObj => {
            return equals(
              getAnchorPart(changeObj.anchor, 3),
              osaamisala.koodiarvo
            );
          }, changeObjects.muutokset);

          /**
           * OSAAMISALARAJOITTEEN LISÄÄMINEN
           *
           * Rajoite täytyy lisätä, mikäli jompi kumpi seuraavista kohdista
           * pitää paikkansa:
           *
           * 1. Rajoitetta ei ole ja tutkintoa ollaan poistamassa luvasta.
           * 2. Rajoitetta ei ole ja tutkintoa ollaan lisäämässä lupaan ja
           *    ja osaamisala ei ole aktiivinen.
           **/
          if (!isOsaamisalaRajoiteInLupa) {
            if (
              !osaamisalaChangeObj ||
              (osaamisalaChangeObj && !osaamisalaChangeObj.properties.isChecked)
            ) {
              // Luodaan LISÄYS
              osaamisalamuutos = {
                generatedId: osaamisalaChangeObj
                  ? getAnchorInit(osaamisalaChangeObj.anchor)
                  : `osaamisala-${Math.random()}`,
                kohde,
                koodiarvo: osaamisala.koodiarvo,
                koodisto: osaamisala.koodisto.koodistoUri,
                kuvaus: osaamisala.metadata[locale].kuvaus,
                maaraystyyppi: find(
                  propEq("tunniste", "RAJOITE"),
                  maaraystyypit
                ),
                // maaraysUuid,
                meta: {
                  changeObjects: flatten([
                    [osaamisalaChangeObj],
                    perustelut
                  ]).filter(Boolean),
                  nimi: osaamisala.metadata[locale].nimi,
                  koulutusala: tutkinto.koulutusalaKoodiarvo,
                  koulutustyyppi: tutkinto.koulutustyyppiKoodiarvo,
                  perusteluteksti: "", // TODO: Täydennä oikea perusteluteksti
                  muutosperustelukoodiarvo: []
                },
                nimi: osaamisala.metadata[locale].nimi,
                tila: "LISAYS"
              };

              /**
               * Jos ollaan lisäämässä uutta tutkintoa, tulee osaamisalan sen
               * osaamisalan parent-propertyn viitata tutkinnon generatedId-
               * propertyyn.
               **/
              if (!isTutkintoInLupa && tutkintomuutos) {
                osaamisalamuutos.parent = tutkintomuutos.generatedId;
              }
            }
          } else {
            /**
             * OSAAMISALARAJOITTEEN POISTAMINEN
             *
             * Rajoite täytyy poistaa, mikäli jompi kumpi seuraavista kohdista
             * pitää paikkansa:
             *
             * 1. Rajoite on olemassa ja osaamisala asetetaan aktiiviseksi.
             **/
            if (
              isOsaamisalaRajoiteInLupa &&
              (!osaamisalaChangeObj ||
                (osaamisalaChangeObj &&
                  osaamisalaChangeObj.properties.isChecked))
            ) {
              // Luodaan POISTO
              osaamisalamuutos = {
                kohde,
                koodiarvo: osaamisala.koodiarvo,
                koodisto: osaamisala.koodisto.koodistoUri,
                kuvaus: osaamisala.metadata[locale].kuvaus,
                maaraystyyppi: find(
                  propEq("tunniste", "RAJOITE"),
                  maaraystyypit
                ),
                maaraysUuid: osaamisala.maarays.uuid,
                meta: {
                  changeObjects: flatten([
                    [osaamisalaChangeObj],
                    perustelut
                  ]).filter(Boolean),
                  nimi: osaamisala.metadata[locale].nimi,
                  koulutusala: tutkinto.koulutusalaKoodiarvo,
                  koulutustyyppi: tutkinto.koulutustyyppiKoodiarvo,
                  perusteluteksti: "", // TODO: Täydennä oikea perusteluteksti
                  muutosperustelukoodiarvo: []
                },
                nimi: osaamisala.metadata[locale].nimi,
                tila: "POISTO"
              };
            }
          }

          /**
           * Jos osaamisalamuutosta ei muodostettu, tarkoittaa se sitä, ettei
           * frontin muutosobjektia ole vielä tallennettu metadataan.
           **/
          if (!osaamisalamuutos && !!tutkintomuutos && !!osaamisalaChangeObj) {
            // Lisätään frontin muutosbjekti tutkintomuutoksen metadataan
            tutkintomuutos = assocPath(
              ["meta", "changeObjects"],
              append(osaamisalaChangeObj, tutkintomuutos.meta.changeObjects),
              tutkintomuutos
            );
          }

          /**
           * Jos ei ole tutkintoon kohdistuu fronttimuutos, jonka pohjalta ei
           * generoitu backend-muutosta, on fronttimuutos tallennettava johonkin,
           * jotta käyttöliittymän tila osataan tutkinnonkin osalta näyttää
           * ladattaessa oikein. Tallennetaan tutkinnon fronttimuutos osaksi
           * osaamisalamuutoksen metatietoja.
           **/
          if (!tutkintomuutos && !!osaamisalamuutos) {
            osaamisalamuutos = assocPath(
              ["meta", "changeObjects"],
              append(changeObj, osaamisalamuutos.meta.changeObjects),
              osaamisalamuutos
            );
          }

          return osaamisalamuutos;
        }, tutkinto.osaamisalat).filter(Boolean);

        /**
         * Yhdistetään tutkintoa koskeva muutosobjekti sen osaamisaloja
         * koskevien muutosobjektien kanssa ja palautetaan tulos.
         */
        return append(tutkintomuutos, osaamisalamuutokset).filter(Boolean);
      }
    } else {
      console.warn(`Unable to find degree by koodiarvo ${koodiarvo}`);
    }
  }, tutkintoChangeObjects);

  return flatten(backendChangeObjects).filter(Boolean);
};
