import {
  addIndex,
  compose,
  concat,
  endsWith,
  find,
  flatten,
  groupBy,
  head,
  map,
  mapObjIndexed,
  omit,
  path,
  pathEq,
  prop,
  propEq,
  sort
} from "ramda";
import localforage from "localforage";
import { getChangeObjByAnchor } from "../../components/02-organisms/CategorizedListRoot/utils";
import { getLisatiedotFromStorage } from "../lisatiedot";

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
  maaraystyypit,
  locale,
  kohteet
) => {
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
    const opetustehtavaAnchor = `opetustehtavat.opetustehtava.${opetustehtava.koodiarvo}`;
    const changeObj = getChangeObjByAnchor(
      opetustehtavaAnchor,
      changeObjects.opetustehtavat
    );
    console.info(kohteet, opetustehtava);
    // Muodostetaan muutosobjekti, mikäli käyttöliittymässä on tehty
    // kohtaan muutoksia.
    if (changeObj) {
      const muutosId = `opetustehtava-${Math.random()}`;
      const muutosobjekti = {
        aliMaaraykset: [],
        generatedId: muutosId,
        kohde: find(propEq("tunniste", "opetusjotalupakoskee"), kohteet),
        koodiarvo: opetustehtava.koodiarvo,
        koodisto: opetustehtava.koodisto.koodistoUri,
        kuvaus: opetustehtava.metadata[locale].kuvaus,
        maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
        meta: {
          changeObjects: [changeObj]
        },
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
      };

      // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      const alimaaraysId = `alimaarays-${index}`;

      const alimaarays = {
        generatedId: alimaaraysId,
        parent: muutosobjekti.generatedId,
        kohde: find(propEq("tunniste", "opetuskieli"), kohteet),
        koodiarvo: "3",
        koodisto: "kielikoodistoopetushallinto",
        maaraystyyppi: find(propEq("tunniste", "RAJOITE"), maaraystyypit),
        meta: {
          changeObjects: changeObjects.rajoitteet || []
        }
      };

      // muutosobjekti.aliMaaraykset = [alimaarays];
      return [muutosobjekti, alimaarays];

      // return [muutosobjekti, alimaarays];
    } else {
      return false;
    }
  }, opetustehtavat).filter(Boolean);

  return flatten([opetusMuutokset, lisatiedotBeChangeObj]).filter(Boolean);
};

export function getOpetustehtavatFromStorage() {
  return localforage.getItem("opetustehtavat");
}

export function getOpetustehtavaKoodistoFromStorage() {
  return localforage.getItem("opetustehtavakoodisto");
}
