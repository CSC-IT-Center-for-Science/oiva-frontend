import {
  addIndex,
  compose,
  concat,
  drop,
  endsWith,
  find,
  flatten,
  groupBy,
  head,
  isNil,
  map,
  mapObjIndexed,
  omit,
  path,
  pathEq,
  prop,
  propEq,
  reject,
  sort,
  take,
  values
} from "ramda";
import localforage from "localforage";
import { getChangeObjByAnchor } from "../../components/02-organisms/CategorizedListRoot/utils";
import { getLisatiedotFromStorage } from "../lisatiedot";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";
import { getLocalizedProperty } from "../../services/lomakkeet/utils";
import { getMaarayksetByTunniste } from "helpers/lupa/index";

export const initializeOpetustehtava = opetustehtava => {
  return omit(["koodiArvo"], {
    ...opetustehtava,
    koodiarvo: opetustehtava.koodiArvo,
    metadata: mapObjIndexed(
      head,
      groupBy(prop("kieli"), opetustehtava.metadata)
    )
  });
};

export const initializeOpetustehtavat = opetustehtavat => {
  return sort(
    (a, b) => {
      const aInt = parseInt(a.metadata.FI.huomioitavaKoodi, 10);
      const bInt = parseInt(b.metadata.FI.huomioitavaKoodi, 10);
      if (aInt < bInt) {
        return -1;
      } else if (aInt > bInt) {
        return 1;
      }
      return 0;
    },
    map(opetustehtava => {
      return initializeOpetustehtava(opetustehtava);
    }, opetustehtavat)
  );
};

export const defineBackendChangeObjects = async (
  changeObjects,
  kohde,
  maaraystyypit,
  lupaMaaraykset,
  locale,
  kohteet
) => {
  const maaraykset = await getMaarayksetByTunniste(
    "opetusjotalupakoskee",
    lupaMaaraykset
  );
  const { rajoitteetByRajoiteId } = changeObjects;
  const opetustehtavat = await getOpetustehtavatFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();

  // Luodaan LISÄYS
  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );
  const lisatiedotChangeObj = find(
    compose(endsWith(".lisatiedot.1"), prop("anchor")),
    changeObjects.opetustehtavat
  );
  const lisatiedotBeChangeObj =
    !!lisatiedotChangeObj && !!lisatiedotObj
      ? {
          kohde: find(propEq("tunniste", "opetusjotalupakoskee"), kohteet),
          koodiarvo: lisatiedotObj.koodiarvo,
          koodisto: lisatiedotObj.koodisto.koodistoUri,
          kuvaus: path(["metadata", locale, "kuvaus"], lisatiedotChangeObj),
          maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
          meta: {
            arvo: path(["properties", "value"], lisatiedotChangeObj),
            changeObjects: [lisatiedotChangeObj]
          },
          tila: "LISAYS"
        }
      : [];

  const opetusMuutokset = addIndex(map)((opetustehtava, index) => {
    const rajoitteetByRajoiteIdAndKoodiarvo = reject(
      isNil,
      mapObjIndexed(rajoite => {
        return pathEq(
          [1, "properties", "value", "value"],
          opetustehtava.koodiarvo,
          rajoite
        )
          ? rajoite
          : null;
      }, rajoitteetByRajoiteId)
    );

    const opetustehtavaAnchor = `opetustehtavat.opetustehtava.${opetustehtava.koodiarvo}`;
    const changeObj = getChangeObjByAnchor(
      opetustehtavaAnchor,
      changeObjects.opetustehtavat
    );

    // Muodostetaan muutosobjekti, mikäli käyttöliittymässä on tehty
    // kohtaan muutoksia.
    if (changeObj) {
      const muutosId = `opetustehtava-${Math.random()}`;
      let muutosobjekti = {
        generatedId: muutosId,
        kohde: find(propEq("tunniste", "opetusjotalupakoskee"), kohteet),
        koodiarvo: opetustehtava.koodiarvo,
        koodisto: opetustehtava.koodisto.koodistoUri,
        kuvaus: getLocalizedProperty(opetustehtava.metadata, locale, "kuvaus"),
        maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
        meta: {
          changeObjects: concat(
            [changeObj],
            take(2, values(rajoitteetByRajoiteIdAndKoodiarvo))
          )
        },
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
      };

      // Muodostetaan tehdyistä rajoituksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      const alimaaraykset = values(
        mapObjIndexed(asetukset => {
          return createAlimaarayksetBEObjects(
            kohteet,
            maaraystyypit,
            muutosobjekti,
            drop(2, asetukset)
          );
        }, rajoitteetByRajoiteIdAndKoodiarvo)
      );

      return [muutosobjekti, alimaaraykset];
    } else {
      return false;
    }
  }, opetustehtavat).filter(Boolean);

  // Luodaan vielä alimääräykset rajoitteille, jotka on kytketty olemassa
  // oleviin määräyksiin.
  const maarayksiaVastenLuodutRajoitteet = flatten(
    map(maarays => {
      const maaraystaKoskevatRajoitteet = mapObjIndexed(rajoite => {
        const koodiarvo = path(["1", "properties", "value", "value"], rajoite);
        if (koodiarvo === maarays.koodiarvo) {
          return createAlimaarayksetBEObjects(
            kohteet,
            maaraystyypit,
            {
              isMaarays: true,
              generatedId: maarays.uuid,
              kohde
            },
            rajoite
          );
        }
      }, rajoitteetByRajoiteId);
      return values(maaraystaKoskevatRajoitteet);
    }, maaraykset)
  ).filter(Boolean);

  return flatten([
    maarayksiaVastenLuodutRajoitteet,
    opetusMuutokset,
    lisatiedotBeChangeObj
  ]).filter(Boolean);
};

export function getOpetustehtavatFromStorage() {
  return localforage.getItem("opetustehtavat");
}

export function getOpetustehtavaKoodistoFromStorage() {
  return localforage.getItem("opetustehtavakoodisto");
}
