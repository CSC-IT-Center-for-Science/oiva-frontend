import {
  assocPath,
  compose,
  concat,
  drop,
  endsWith,
  filter,
  find,
  flatten,
  groupBy,
  head,
  includes,
  isEmpty,
  isNil,
  length,
  map,
  mapObjIndexed,
  nth,
  omit,
  path,
  pathEq,
  prop,
  propEq,
  reject,
  sort,
  split,
  startsWith,
  take,
  toUpper,
  values
} from "ramda";
import localforage from "localforage";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";
import { getAnchorPart } from "../../utils/common";
import { getMaarayksetByTunniste } from "helpers/lupa/index";
import { createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects } from "utils/rajoitteetUtils";

export const initializeLukioErityinenKoulutustehtava = erityinenKoulutustehtava => {
  return omit(["koodiArvo"], {
    ...erityinenKoulutustehtava,
    koodiarvo: erityinenKoulutustehtava.koodiArvo,
    metadata: mapObjIndexed(
      head,
      groupBy(prop("kieli"), erityinenKoulutustehtava.metadata)
    )
  });
};

export const initializeLukioErityisetKoulutustehtavat = erityisetKoulutustehtavat => {
  return sort(
    (a, b) => {
      const aInt = parseInt(a.koodiarvo, 10);
      const bInt = parseInt(b.koodiarvo, 10);
      if (aInt < bInt) {
        return -1;
      } else if (aInt > bInt) {
        return 1;
      }
      return 0;
    },
    map(erityinenKoulutustehtava => {
      return initializeLukioErityinenKoulutustehtava(erityinenKoulutustehtava);
    }, erityisetKoulutustehtavat)
  );
};

const getAlimaaraykset = (
  kuvausnro,
  rajoitteetByRajoiteIdAndKoodiarvo,
  ankkuri,
  kohteet,
  maaraystyypit,
  kuvausBEChangeObject,
  valtakunnallinenKehitystehtava
) => {
  const rajoitteetForKuvaus = filter(rajoiteCobjs => {
    return (
      nth(
        1,
        split(
          "-",
          path([1, "properties", "value", "value"], rajoiteCobjs) || ""
        )
      ) === kuvausnro
    );
  }, values(rajoitteetByRajoiteIdAndKoodiarvo));

  // TODO: Tässä pitäisi käydä kaikki rajoitteet läpi, jos halutaan useampia
  // TODO: rajoitteita samalle asialle. (nyt haetaan vain ensimmäisen rajoitteen arvo)
  const kohteenTarkentimenArvo = path(
    [1, "properties", "value", "value"],
    head(rajoitteetForKuvaus)
  );

  const rajoitevalinnanAnkkuriosa = kohteenTarkentimenArvo
    ? nth(1, split("-", kohteenTarkentimenArvo))
    : null;

  if (valtakunnallinenKehitystehtava) {
    kuvausBEChangeObject = assocPath(
      ["isValtakunnallinenKehittamistehtava"],
      true,
      kuvausBEChangeObject
    );
  }

  if (
    kohteenTarkentimenArvo &&
    (rajoitevalinnanAnkkuriosa === ankkuri || !rajoitevalinnanAnkkuriosa)
  ) {
    // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
    // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
    // loput toisiinsa "alenevassa polvessa".
    return values(
      mapObjIndexed(asetukset => {
        return createAlimaarayksetBEObjects(
          kohteet,
          maaraystyypit,
          kuvausBEChangeObject,
          drop(2, asetukset)
        );
      }, rajoitteetForKuvaus)
    );
  } else {
    return [];
  }
};

export const defineBackendChangeObjects = async (
  changeObjects = {},
  maaraystyypit,
  lupaMaaraykset,
  locale,
  kohteet
) => {
  const {
    rajoitteetByRajoiteId,
    valtakunnallisetKehittamistehtavaRajoitteetByRajoiteId
  } = changeObjects;

  const kohde = find(propEq("tunniste", "erityinenkoulutustehtava"), kohteet);
  const maaraykset = await getMaarayksetByTunniste(
    kohde.tunniste,
    lupaMaaraykset
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const erityisetKoulutustehtavat = await getLukioErityisetKoulutustehtavatFromStorage();

  const maarayksiaVastenLuodutRajoitteet = createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects(
    maaraykset,
    rajoitteetByRajoiteId,
    kohteet,
    maaraystyypit,
    kohde
  );

  const muutokset = map(koulutustehtava => {
    // Checkbox-kenttien muutokset
    const checkboxChangeObj = find(
      compose(
        endsWith(`.${koulutustehtava.koodiarvo}.valintaelementti`),
        prop("anchor")
      ),
      changeObjects.erityisetKoulutustehtavat
    );

    const tehtavaanLiittyvatMaaraykset = filter(
      m =>
        propEq("koodiarvo", koulutustehtava.koodiarvo, m) &&
        propEq("koodisto", "lukioerityinenkoulutustehtavauusi", m),
      maaraykset
    );

    const isCheckboxChecked =
      (!!tehtavaanLiittyvatMaaraykset.length && !checkboxChangeObj) ||
      (checkboxChangeObj &&
        pathEq(["properties", "isChecked"], true, checkboxChangeObj));

    // Kuvauskenttien muutokset kohdassa (muu koulutustehtava)
    const kuvausChangeObjects = filter(changeObj => {
      return (
        koulutustehtava.koodiarvo ===
          path(["metadata", "koodiarvo"], changeObj.properties) &&
        endsWith(".kuvaus", changeObj.anchor)
      );
    }, changeObjects.erityisetKoulutustehtavat);

    const kuvausKoodistosta = path(
      ["metadata", locale ? toUpper(locale) : "FI", "kuvaus"],
      find(
        koodi => koodi.koodiarvo === koulutustehtava.koodiarvo,
        erityisetKoulutustehtavat || []
      )
    );

    let checkboxBEchangeObject = null;
    let kuvausBEchangeObjects = [];

    const rajoitteetByRajoiteIdAndKoodiarvo = reject(
      isNil,
      mapObjIndexed(rajoite => {
        return startsWith(
          `${koulutustehtava.koodiarvo}-`,
          path([1, "properties", "value", "value"], rajoite)
        )
          ? rajoite
          : null;
      }, rajoitteetByRajoiteId)
    );

    const valtakunnallisetKehittamistehtavaRajoitteetByRajoiteIdAndKoodiarvo = reject(
      isNil,
      mapObjIndexed(rajoite => {
        return startsWith(
          `${koulutustehtava.koodiarvo}-`,
          path([1, "properties", "value", "value"], rajoite)
        )
          ? rajoite
          : null;
      }, valtakunnallisetKehittamistehtavaRajoitteetByRajoiteId)
    );

    /** Muutos ainoastaan osiossa 5 */
    const onlyValtakunnallinenChanges = filter(
      valtakunnallinenChange =>
        !!!find(kuvausCobj => {
          return (
            pathEq(
              ["properties", "metadata", "ankkuri"],
              getAnchorPart(valtakunnallinenChange.anchor, 2),
              kuvausCobj
            ) &&
            pathEq(
              ["properties", "metadata", "koodiarvo"],
              getAnchorPart(valtakunnallinenChange.anchor, 1),
              kuvausCobj
            )
          );
        }, kuvausChangeObjects),
      filter(
        cObj => getAnchorPart(cObj.anchor, 1) === koulutustehtava.koodiarvo,
        changeObjects.valtakunnallisetKehittamistehtavat
      )
    );

    /** Jos ainoastaan 5 osiossa muutos, täytyy tästä luoda uusi muutos-objekti.
     *  Määräykselle pitää tällöin luoda poisto-objekti
     */
    const onlyValtakunnallinenMuutosBeCobjs = isCheckboxChecked
      ? map(valtakunnallinenCobj => {
          const liittyvaMaarays = find(
            maarays =>
              maarays.koodiarvo ===
                getAnchorPart(valtakunnallinenCobj.anchor, 1) &&
              pathEq(
                ["meta", "ankkuri"],
                getAnchorPart(valtakunnallinenCobj.anchor, 2),
                maarays
              ),
            maaraykset
          );
          /** Poisto-objekti määräykselle */
          const poistoObj = {
            kohde,
            koodiarvo: koulutustehtava.koodiarvo,
            koodisto: koulutustehtava.koodisto.koodistoUri,
            tila: "POISTO",
            maaraysUuid: liittyvaMaarays.uuid,
            maaraystyyppi
          };

          /** Uusi lisäys-objekti **/
          const isValtakunnallinenChecked = path(
            ["properties", "isChecked"],
            valtakunnallinenCobj
          );

          const kuvaus = path(["meta", "kuvaus"], liittyvaMaarays);
          const lisaysObj = Object.assign(
            {},
            {
              generatedId: `erityinenKoulutustehtava-${Math.random()}`,
              kohde,
              koodiarvo: koulutustehtava.koodiarvo,
              koodisto: koulutustehtava.koodisto.koodistoUri,
              ...(kuvaus && { kuvaus }),
              maaraystyyppi,
              meta: {
                ankkuri: path(["meta", "ankkuri"], liittyvaMaarays),
                ...(kuvaus && { kuvaus }),
                changeObjects: concat(
                  concat(
                    take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)),
                    take(
                      2,
                      values(
                        valtakunnallisetKehittamistehtavaRajoitteetByRajoiteIdAndKoodiarvo
                      )
                    )
                  ),
                  [checkboxChangeObj, valtakunnallinenCobj]
                ).filter(Boolean),
                isValtakunnallinenKehitystehtava: isValtakunnallinenChecked
              },
              tila: "LISAYS"
            }
          );
          return [lisaysObj, poistoObj];
        }, onlyValtakunnallinenChanges)
      : null;

    if (length(kuvausChangeObjects) && isCheckboxChecked) {
      kuvausBEchangeObjects = map(changeObj => {
        const ankkuri = path(["properties", "metadata", "ankkuri"], changeObj);
        const koodiarvo = nth(1, split(".", changeObj.anchor));
        const index = nth(2, split(".", changeObj.anchor));

        const valtakunnallinenKehitystehtavaUICobj = find(
          compose(
            endsWith(`.${koodiarvo}.${index}.valintaelementti`),
            prop("anchor")
          ),
          changeObjects.valtakunnallisetKehittamistehtavat
        );

        const liittyvaMaarays = find(
          maarays =>
            maarays.koodiarvo === getAnchorPart(changeObj.anchor, 1) &&
            pathEq(["meta", "ankkuri"], ankkuri, maarays),
          tehtavaanLiittyvatMaaraykset
        );

        const hasValtakunnallinenMaarays = pathEq(
          ["meta", "isValtakunnallinenKehitystehtava"],
          true,
          liittyvaMaarays
        );

        const isValtakunnallinenKehitystehtavaCheckedFromUI = path(
          ["properties", "isChecked"],
          valtakunnallinenKehitystehtavaUICobj
        );

        /** Jos kuvaus on identtinen koodistosta tulevan kanssa ei tallenneta sitä lainkaan muutokselle.
         *  Tällöin muutokset koodistoon näkyvät html-luvalla */
        const kuvaus =
          path(["properties", "value"], changeObj) === kuvausKoodistosta
            ? null
            : path(["properties", "value"], changeObj);
        const isDeleted = path(["properties", "isDeleted"], changeObj);
        const isMuokattu = liittyvaMaarays && !isDeleted;
        const changeObjectDeleted = isDeleted && !liittyvaMaarays;
        const tila = isCheckboxChecked && !isDeleted ? "LISAYS" : "POISTO";
        const isValtakunnallinenKehitystehtava =
          (hasValtakunnallinenMaarays &&
            isValtakunnallinenKehitystehtavaCheckedFromUI !== false) ||
          isValtakunnallinenKehitystehtavaCheckedFromUI === true;

        changeObj = assocPath(
          ["properties", "metadata", "isValtakunnallinenKehitystehtava"],
          isValtakunnallinenKehitystehtava,
          changeObj
        );
        const kuvausBEChangeObject = changeObjectDeleted
          ? null
          : Object.assign(
              {},
              {
                generatedId: changeObj.anchor,
                kohde,
                koodiarvo: koulutustehtava.koodiarvo,
                koodisto: koulutustehtava.koodisto.koodistoUri,
                ...(kuvaus && { kuvaus }),
                maaraystyyppi,
                meta: {
                  ankkuri,
                  ...(kuvaus && { kuvaus }),
                  changeObjects: concat(
                    concat(
                      take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)),
                      take(
                        2,
                        values(
                          valtakunnallisetKehittamistehtavaRajoitteetByRajoiteIdAndKoodiarvo
                        )
                      )
                    ),
                    [
                      checkboxChangeObj,
                      changeObj,
                      valtakunnallinenKehitystehtavaUICobj
                    ]
                  ).filter(Boolean),
                  isValtakunnallinenKehitystehtava
                },
                tila,
                maaraysUuid: tila === "POISTO" ? liittyvaMaarays.uuid : null
              }
            );

        /** Jos tekstikenttämääräystä on muokattu, pitää luoda poisto-objekti määräykselle */
        const muokkausPoistoObjekti = isMuokattu
          ? {
              kohde,
              koodiarvo: koulutustehtava.koodiarvo,
              koodisto: koulutustehtava.koodisto.koodistoUri,
              tila: "POISTO",
              maaraysUuid: liittyvaMaarays.uuid,
              maaraystyyppi
            }
          : null;

        const kuvausnro = getAnchorPart(changeObj.anchor, 2);
        const alimaaraykset = getAlimaaraykset(
          kuvausnro,
          rajoitteetByRajoiteIdAndKoodiarvo,
          ankkuri,
          kohteet,
          maaraystyypit,
          kuvausBEChangeObject,
          false
        );

        let valtaAlimaaraykset = getAlimaaraykset(
          kuvausnro,
          valtakunnallisetKehittamistehtavaRajoitteetByRajoiteIdAndKoodiarvo,
          ankkuri,
          kohteet,
          maaraystyypit,
          kuvausBEChangeObject,
          true
        );

        return [
          kuvausBEChangeObject,
          muokkausPoistoObjekti,
          alimaaraykset,
          valtaAlimaaraykset
        ];
      }, kuvausChangeObjects);
    } else {
      // Jos muokattuja kuvauksia ei kyseiselle koodiarvolle löydy, tarkistetaan
      // löytyykö checkbox-muutos. Jos löytyy, niin luodaan sille backend-muotoinen
      // muutosobjekti.
      checkboxBEchangeObject = checkboxChangeObj
        ? {
            generatedId: `erityinenKoulutustehtava-${Math.random()}`,
            kohde,
            koodiarvo: koulutustehtava.koodiarvo,
            koodisto: koulutustehtava.koodisto.koodistoUri,
            kuvaus: koulutustehtava.metadata[locale].kuvaus,
            maaraystyyppi,
            meta: {
              changeObjects: concat(
                take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)),
                [checkboxChangeObj]
              ).filter(Boolean)
            },
            tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
          }
        : null;

      // Muodostetaan tehdyistä rajoituksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      const alimaaraykset =
        checkboxBEchangeObject && !isEmpty(rajoitteetByRajoiteIdAndKoodiarvo)
          ? values(
              mapObjIndexed(asetukset => {
                return createAlimaarayksetBEObjects(
                  kohteet,
                  maaraystyypit,
                  checkboxBEchangeObject,
                  drop(2, asetukset)
                );
              }, rajoitteetByRajoiteIdAndKoodiarvo)
            )
          : null;

      /** Jos checkboxi ei ole checkattu. Luodaan poisto-objektit koulutustehtävään
       * liittyville määräyksille (eli tekstikentille) */
      const uncheckedCheckBoxPoistot = !isCheckboxChecked
        ? map(maarays => {
            return {
              kohde,
              koodiarvo: koulutustehtava.koodiarvo,
              koodisto: koulutustehtava.koodisto.koodistoUri,
              tila: "POISTO",
              maaraysUuid: maarays.uuid,
              maaraystyyppi
            };
          }, tehtavaanLiittyvatMaaraykset)
        : null;

      const maarayksiaVastenLuodutRajoitteet = createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects(
        maaraykset,
        valtakunnallisetKehittamistehtavaRajoitteetByRajoiteId,
        kohteet,
        maaraystyypit,
        kohde
      );

      return [
        checkboxBEchangeObject,
        uncheckedCheckBoxPoistot,
        onlyValtakunnallinenMuutosBeCobjs,
        alimaaraykset
      ];
    }
    return [
      checkboxBEchangeObject,
      onlyValtakunnallinenMuutosBeCobjs,
      kuvausBEchangeObjects,
      maarayksiaVastenLuodutRajoitteet
    ];
  }, erityisetKoulutustehtavat);

  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects.erityisetKoulutustehtavat
  );

  const lisatiedotBEchangeObject = lisatiedotChangeObj
    ? {
        kohde,
        koodiarvo: path(
          ["properties", "metadata", "koodiarvo"],
          lisatiedotChangeObj
        ),
        koodisto: path(
          ["properties", "metadata", "koodisto", "koodistoUri"],
          lisatiedotChangeObj
        ),
        maaraystyyppi,
        meta: {
          arvo: path(["properties", "value"], lisatiedotChangeObj),
          changeObjects: [lisatiedotChangeObj]
        },
        tila: "LISAYS"
      }
    : null;

  return flatten([
    maarayksiaVastenLuodutRajoitteet,
    muutokset,
    lisatiedotBEchangeObject
  ]).filter(Boolean);
};

export function getLukioErityisetKoulutustehtavatFromStorage() {
  return localforage.getItem("lukioErityinenKoulutustehtavaUusi");
}
