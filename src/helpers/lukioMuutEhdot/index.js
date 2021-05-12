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
import { getMaarayksetByTunniste } from "../lupa/index";
import localforage from "localforage";
import { createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects } from "../../utils/rajoitteetUtils";
import {
  createDynamicTextBoxBeChangeObjects,
  createBECheckboxChangeObjectsForDynamicTextBoxes
} from "../../services/lomakkeet/dynamic";

export const initializeLukioMuuEhto = ehto => {
  return omit(["koodiArvo"], {
    ...ehto,
    koodiarvo: ehto.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), ehto.metadata))
  });
};

export const initializeLukioMuutEhdot = ehdot => {
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
      return initializeLukioMuuEhto(ehto);
    }, ehdot)
  );
};

export function getLukioMuutEhdotFromStorage() {
  return localforage.getItem(
    "lukioMuutKoulutuksenJarjestamiseenLiittyvatEhdot"
  );
}

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  lupaMaaraykset,
  locale,
  kohteet
) => {
  const maaraykset = await getMaarayksetByTunniste(
    "muutkoulutuksenjarjestamiseenliittyvatehdot",
    lupaMaaraykset
  );

  const { rajoitteetByRajoiteId } = changeObjects;

  const kohde = find(
    propEq("tunniste", "muutkoulutuksenjarjestamiseenliittyvatehdot"),
    kohteet
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const muutEhdot = await getLukioMuutEhdotFromStorage();

  const muutokset = map(ehto => {
    // Checkbox-kenttien muutokset
    const checkboxChangeObj = find(
      compose(endsWith(`.${ehto.koodiarvo}.valintaelementti`), prop("anchor")),
      changeObjects.muutEhdot
    );

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

    const ehtoonLiittyvatMaaraykset = filter(
      m =>
        propEq("koodiarvo", ehto.koodiarvo, m) &&
        propEq(
          "koodisto",
          "lukiomuutkoulutuksenjarjestamiseenliittyvatehdot",
          m
        ),
      maaraykset
    );

    const isCheckboxChecked =
      (!!ehtoonLiittyvatMaaraykset.length && !checkboxChangeObj) ||
      (checkboxChangeObj &&
        pathEq(["properties", "isChecked"], true, checkboxChangeObj));

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

  const maarayksiaVastenLuodutRajoitteet =
    createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects(
      maaraykset,
      rajoitteetByRajoiteId,
      kohteet,
      maaraystyypit,
      kohde
    );

  const objects = flatten([
    maarayksiaVastenLuodutRajoitteet,
    muutokset,
    lisatiedotBEchangeObject
  ]).filter(Boolean);

  return objects;
};
