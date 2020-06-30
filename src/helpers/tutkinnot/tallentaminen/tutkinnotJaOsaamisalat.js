import {
  flatten,
  map,
  prop,
  compose,
  filter,
  includes,
  find,
  propEq,
  equals,
  append,
  assocPath
} from "ramda";
import { getAnchorInit, getAnchorPart } from "../../../utils/common";

/**
 * Luo backendin tarvitsemat muutosobjektit tutkintojen ja osaamisalojen
 * osalta.
 *
 * @param {object} tutkinto
 * @param {array} changeObjects
 * @param {object} kohde
 * @param {array} maaraystyypit
 * @param {object} locale
 */
export function createBEOofTutkinnotJaOsaamisalat(
  tutkinto,
  changeObjects,
  kohde,
  maaraystyypit,
  locale
) {
  /**
   * TUTKINNOT JA OSAAMISALAT
   *
   * Jos tutkintoon on kohdistunut muutos, on fronttipuolen muutosobjekti
   * olemassa. Yritetään etsiä se.
   */
  const anchor = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}.tutkinto`;
  const changeObj = find(
    propEq("anchor", anchor),
    changeObjects.tutkinnotJaOsaamisalat.muutokset
  );

  if (changeObj) {
    /**
     * Tutkinto kuuluu lupaan, jos sillä on määräys.
     */
    const isTutkintoInLupa = !!tutkinto.maarays;

    /**
     * Ainoa asia, jonka vuoksi on tarpeen luoda tai päivittää muutosobjekti,
     * on se, että tutkinto on joko aktivoitu tai deaktivoitu eli se ollaan
     * joko lisäämässä lupaan tai poistamassa luvasta.
     */
    const isMuutosobjektiNeeded =
      changeObj.properties.isChecked !== isTutkintoInLupa;

    const anchorInit = getAnchorInit(changeObj.anchor);

    /**
     * Käyttäjälle tarjotaan mahdollisuutta perustella muutokset.
     * Perustelut ovat omia frontin puolen muutosobjektejaan, jotka
     * liitetään osaksi muodostettavaa - backendin kaipaamaa -
     * muutosobjektia.
     */
    const perustelut = filter(
      compose(includes(anchorInit), prop("anchor")),
      changeObjects.tutkinnotJaOsaamisalat.perustelut
    );

    /**
     * Mahdollinen tutkintomuutos on paikallaan määritellä muokattavana
     * objektina, koska siihen on myöhemmässä vaiheessa tarkoitus liittää
     * osaamisaloja koskevat käyttöliittymäpuolen muutosobjektit.
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
    const osaamisalamuutokset = map(osaamisala => {
      const isOsaamisalaRajoiteInLupa = !!osaamisala.maarays;
      let osaamisalamuutos = null;

      const osaamisalaChangeObj = find(changeObj => {
        return equals(getAnchorPart(changeObj.anchor, 3), osaamisala.koodiarvo);
      }, changeObjects.tutkinnotJaOsaamisalat.muutokset);

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
            maaraystyyppi: find(propEq("tunniste", "RAJOITE"), maaraystyypit),
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
            (osaamisalaChangeObj && osaamisalaChangeObj.properties.isChecked))
        ) {
          // Luodaan POISTO
          osaamisalamuutos = {
            kohde,
            koodiarvo: osaamisala.koodiarvo,
            koodisto: osaamisala.koodisto.koodistoUri,
            kuvaus: osaamisala.metadata[locale].kuvaus,
            maaraystyyppi: find(propEq("tunniste", "RAJOITE"), maaraystyypit),
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
            parentMaaraysUuid: tutkinto.maarays.uuid,
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
    return append(tutkintomuutos, osaamisalamuutokset);
  }
  return null;
}
