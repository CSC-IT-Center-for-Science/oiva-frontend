import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  groupBy,
  head,
  includes,
  isNil,
  length,
  map,
  mapObjIndexed,
  omit,
  path,
  pathEq,
  prop,
  propEq,
  reject,
  sort,
  startsWith,
  toUpper
} from "ramda";
import localforage from "localforage";
import { createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects } from "../../utils/rajoitteetUtils";
import { getMaarayksetByTunniste } from "../lupa";
import {
  createDynamicTextBoxBeChangeObjects,
  createBECheckboxChangeObjectsForDynamicTextBoxes
} from "../../services/lomakkeet/dynamic";

export const initializePOErityinenKoulutustehtava = erityinenKoulutustehtava => {
  return omit(["koodiArvo"], {
    ...erityinenKoulutustehtava,
    koodiarvo: erityinenKoulutustehtava.koodiArvo,
    metadata: mapObjIndexed(
      head,
      groupBy(prop("kieli"), erityinenKoulutustehtava.metadata)
    )
  });
};

export const initializePOErityisetKoulutustehtavat = erityisetKoulutustehtavat => {
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
      return initializePOErityinenKoulutustehtava(erityinenKoulutustehtava);
    }, erityisetKoulutustehtavat)
  );
};

export const defineBackendChangeObjects = async (
  changeObjects = {},
  maaraystyypit,
  locale,
  lupaMaaraykset,
  kohteet
) => {
  const { rajoitteetByRajoiteId } = changeObjects;

  const kohde = find(propEq("tunniste", "erityinenkoulutustehtava"), kohteet);
  const maaraykset = await getMaarayksetByTunniste(
    kohde.tunniste,
    lupaMaaraykset
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const erityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();

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
        propEq("koodisto", "poerityinenkoulutustehtava", m),
      maaraykset
    );

    // Kuvauskenttien muutokset kohdassa (muu koulutustehtava)
    const kuvausChangeObjects = filter(changeObj => {
      return (
        koulutustehtava.koodiarvo ===
          path(["metadata", "koodiarvo"], changeObj.properties) &&
        endsWith(".kuvaus", changeObj.anchor)
      );
    }, changeObjects.erityisetKoulutustehtavat);

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

    const isCheckboxChecked =
      (!!tehtavaanLiittyvatMaaraykset.length && !checkboxChangeObj) ||
      (checkboxChangeObj &&
        pathEq(["properties", "isChecked"], true, checkboxChangeObj));

    if (length(kuvausChangeObjects) && isCheckboxChecked) {
      kuvausBEchangeObjects = createDynamicTextBoxBeChangeObjects(
        kuvausChangeObjects,
        tehtavaanLiittyvatMaaraykset,
        isCheckboxChecked,
        koulutustehtava,
        maaraystyyppi,
        maaraystyypit,
        rajoitteetByRajoiteIdAndKoodiarvo,
        checkboxChangeObj,
        kohde,
        kohteet
      );
    } else {
      return createBECheckboxChangeObjectsForDynamicTextBoxes(
        checkboxChangeObj,
        koulutustehtava,
        rajoitteetByRajoiteIdAndKoodiarvo,
        kohteet,
        kohde,
        maaraystyypit,
        maaraystyyppi,
        tehtavaanLiittyvatMaaraykset,
        isCheckboxChecked,
        locale,
        "erityinenKoulutustehtava"
      );
    }

    return [checkboxBEchangeObject, kuvausBEchangeObjects];
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

export function getPOErityisetKoulutustehtavatFromStorage() {
  return localforage.getItem("poErityisetKoulutustehtavat");
}
