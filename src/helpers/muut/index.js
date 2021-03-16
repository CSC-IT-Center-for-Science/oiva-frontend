import {
  append,
  assocPath,
  compose,
  includes,
  filter,
  flatten,
  length,
  path,
  omit,
  prop,
  groupBy,
  head,
  mapObjIndexed,
  map,
  find,
  pathEq,
  propEq,
  join,
  init,
  split
} from "ramda";
import localforage from "localforage";
import { fillForBackend } from "../../services/lomakkeet/backendMappings";

export const initializeMuu = muuData => {
  return omit(["koodiArvo"], {
    ...muuData,
    koodiarvo: muuData.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), muuData.metadata))
  });
};

export function getMuutFromStorage() {
  return localforage.getItem("muut");
}

export const getChangesToSave = (
  changeObjects = {},
  kohde,
  maaraystyypit,
  maaraykset
) => {
  const yhteistyosopimusmaaraykset = filter(
    maarays => maarays.koodiarvo === "8",
    maaraykset
  );
  const yhteistyosopimuksetUnchecked = !!find(
    cObj =>
      cObj.anchor === "muut_08.yhteistyosopimus.8.A" &&
      !cObj.properties.isChecked,
    changeObjects.muutokset
  );

  let changes = map(changeObj => {
    const anchorInit = compose(join("."), init, split("."))(changeObj.anchor);

    let tila = changeObj.properties.isChecked ? "LISAYS" : "POISTO";
    if (
      (changeObj.properties.isChecked === undefined ||
        changeObj.properties.isChecked === null) &&
      changeObj.properties.value
    ) {
      tila = "MUUTOS";
    }

    const perustelut = filter(
      compose(includes(anchorInit), prop("anchor")),
      changeObjects.perustelut
    );

    const perustelutForBackend = fillForBackend(perustelut, changeObj.anchor);

    const perusteluteksti = perustelutForBackend
      ? null
      : map(perustelu => {
          if (path(["properties", "value"], perustelu)) {
            return { value: path(["properties", "value"], perustelu) };
          }
          return {
            value: path(["properties", "metadata", "fieldName"], perustelu)
          };
        }, perustelut);

    let meta = Object.assign(
      {},
      {
        tunniste: "muut",
        changeObjects: flatten([[changeObj], perustelut]),
        muutosperustelukoodiarvo: []
      },
      perustelutForBackend,
      perusteluteksti ? { perusteluteksti } : null
    );
    /** Ei tallenneta yhteistyösopimusten tekstikenttää, jos yhteistyösopimukset unchecked */
    if (
      pathEq(["properties", "metadata", "koodiarvo"], "8", changeObj) &&
      yhteistyosopimuksetUnchecked &&
      changeObj.anchor === "muut_08.yhteistyosopimus.8.tekstikentta.A"
    ) {
      return null;
    }
    /** Yhteistyösopimustekstin pitää tallentua määräykselle paikkaan
     * meta->yhteistyosopimus->kuvaus */
    if (
      !yhteistyosopimuksetUnchecked &&
      pathEq(["properties", "metadata", "koodiarvo"], "8", changeObj) &&
      changeObj.anchor === "muut_08.yhteistyosopimus.8.tekstikentta.A"
    ) {
      meta = assocPath(
        ["yhteistyosopimus", "kuvaus"],
        changeObj.properties.value,
        meta
      );
    }
    return {
      koodiarvo: path(["properties", "metadata", "koodiarvo"], changeObj),
      koodisto: path(
        ["properties", "metadata", "koodisto", "koodistoUri"],
        changeObj
      ),
      isInLupa: path(["properties", "metadata", "isInLupa"], changeObj),
      kohde,
      maaraystyyppi: find(propEq("tunniste", "VELVOITE"), maaraystyypit),
      maaraysUuid: changeObj.properties.metadata.maaraysUuid,
      meta,
      tila
    };
  }, changeObjects.muutokset).filter(Boolean);

  /** Poisto-objektin luominen edellisille yhteistyösopimusmääräyksille, jos löytyy muutos-objekti koskien yhteistyösopimuksen
   * tekstikenttää */
  if (
    !!length(yhteistyosopimusmaaraykset) &&
    !yhteistyosopimuksetUnchecked &&
    !!find(
      cObj =>
        pathEq(["properties", "metadata", "koodiarvo"], "8", cObj) &&
        cObj.anchor === "muut_08.yhteistyosopimus.8.tekstikentta.A",
      changeObjects.muutokset
    )
  ) {
    changes = append(
      map(maarays => {
        return {
          koodiarvo: "8",
          koodisto: "oivamuutoikeudetvelvollisuudetehdotjatehtavat",
          kohde,
          maaraystyyppi: find(propEq("tunniste", "VELVOITE"), maaraystyypit),
          maaraysUuid: maarays.uuid,
          tila: "POISTO"
        };
      }, yhteistyosopimusmaaraykset),
      changes
    );
  }
  return changes;
};
