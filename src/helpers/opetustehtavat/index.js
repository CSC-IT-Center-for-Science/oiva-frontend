import { compose, endsWith, find, groupBy, head, map, mapObjIndexed, omit, prop, propEq, sort } from "ramda";
import localforage from "localforage";
import { getChangeObjByAnchor } from "../../components/02-organisms/CategorizedListRoot/utils";

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

export const defineBackendChangeObjects = async (changeObjects = [], maaraystyypit, locale, kohteet) => {
  const opetustehtavat = await getOpetustehtavatFromStorage();
  // Luodaan LISÄYS
  const lisatiedotChangeObj = find(compose(endsWith(".lisatiedot"), prop("anchor")), changeObjects);
  const opetusMuutokset = map(opetustehtava => {
    const opetustehtavaAnchor = `opetustehtavat.opetustehtava.${opetustehtava.koodiarvo}`;
    const changeObj = getChangeObjByAnchor(opetustehtavaAnchor, changeObjects);

      return changeObj ? {
        generatedId: `opetustehtava-${Math.random()}`,
        kohde: find(propEq("tunniste", "tutkinnotjakoulutukset"), kohteet), // TODO: Onko oikea kohde?
        koodiarvo: opetustehtava.koodiarvo,
        koodisto: opetustehtava.koodisto.koodistoUri,
        kuvaus: opetustehtava.metadata[locale].kuvaus,
        maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
        meta: {
          changeObjects: [changeObj, lisatiedotChangeObj]
        },
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
      } : null
    }, opetustehtavat).filter(Boolean);

  return opetusMuutokset;
}

export function getOpetustehtavatFromStorage() {
  return localforage.getItem("opetustehtavat");
}
