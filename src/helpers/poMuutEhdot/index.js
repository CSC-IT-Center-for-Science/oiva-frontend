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
  startsWith
} from "ramda";
import localforage from "localforage";
import { createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects } from "../../utils/rajoitteetUtils";
import { getMaarayksetByTunniste } from "../lupa";
import {
  createDynamicTextBoxBeChangeObjects,
  createBECheckboxChangeObjectsForDynamicTextBoxes
} from "../../services/lomakkeet/dynamic";

export const initializePOMuuEhto = ehto => {
  return omit(["koodiArvo"], {
    ...ehto,
    koodiarvo: ehto.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), ehto.metadata))
  });
};

export const initializePOMuutEhdot = ehdot => {
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
    map(ehto => {
      return initializePOMuuEhto(ehto);
    }, ehdot)
  );
};

export function getPOMuutEhdotFromStorage() {
  return localforage.getItem("poMuutEhdot");
}

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  lupaMaaraykset,
  kohteet,
  locale
) => {
  const { rajoitteetByRajoiteId } = changeObjects;

  const kohde = find(
    propEq("tunniste", "muutkoulutuksenjarjestamiseenliittyvatehdot"),
    kohteet
  );

  const maaraykset = await getMaarayksetByTunniste(
    kohde.tunniste,
    lupaMaaraykset
  );

  const maarayksiaVastenLuodutRajoitteet = createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects(
    maaraykset,
    rajoitteetByRajoiteId,
    kohteet,
    maaraystyypit,
    kohde
  );

  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const muutEhdot = await getPOMuutEhdotFromStorage();

  const muutokset = map(ehto => {
    // Checkbox-kenttien muutokset
    const checkboxChangeObj = find(
      compose(endsWith(`.${ehto.koodiarvo}.valintaelementti`), prop("anchor")),
      changeObjects.muutEhdot
    );

    const ehtoonLiittyvatMaaraykset = filter(
      m =>
        propEq("koodiarvo", ehto.koodiarvo, m) &&
        propEq("koodisto", "pomuutkoulutuksenjarjestamiseenliittyvatehdot", m),
      maaraykset
    );

    const isCheckboxChecked =
      (!!ehtoonLiittyvatMaaraykset.length && !checkboxChangeObj) ||
      (checkboxChangeObj &&
        pathEq(["properties", "isChecked"], true, checkboxChangeObj));

    // Kuvauskenttien muutokset kohdassa (muu ehto)
    const kuvausChangeObjects = filter(changeObj => {
      return (
        ehto.koodiarvo ===
          path(["metadata", "koodiarvo"], changeObj.properties) &&
        endsWith(".kuvaus", changeObj.anchor)
      );
    }, changeObjects.muutEhdot);

    let checkboxBEchangeObject = null;
    let kuvausBEchangeObjects = [];

    const rajoitteetByRajoiteIdAndKoodiarvo = reject(
      isNil,
      mapObjIndexed(rajoite => {
        return startsWith(
          `${ehto.koodiarvo}-`,
          path([1, "properties", "value", "value"], rajoite)
        )
          ? rajoite
          : null;
      }, rajoitteetByRajoiteId)
    );

    if (length(kuvausChangeObjects) && isCheckboxChecked) {
      kuvausBEchangeObjects = createDynamicTextBoxBeChangeObjects(
        kuvausChangeObjects,
        ehtoonLiittyvatMaaraykset,
        isCheckboxChecked,
        ehto,
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
        ehto,
        rajoitteetByRajoiteIdAndKoodiarvo,
        kohteet,
        kohde,
        maaraystyypit,
        maaraystyyppi,
        ehtoonLiittyvatMaaraykset,
        isCheckboxChecked,
        locale,
        "muuEhto"
      );
    }

    return [checkboxBEchangeObject, kuvausBEchangeObjects];
  }, muutEhdot);

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects.muutEhdot
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

  const objects = flatten([
    maarayksiaVastenLuodutRajoitteet,
    muutokset,
    lisatiedotBEchangeObject
  ]).filter(Boolean);

  return objects;
};
