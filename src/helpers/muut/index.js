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
  split,
  assoc
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
  const yhteistyosopimusmaaraykset = getMaarayksetByKoodiarvo("8", maaraykset);
  const muuMaaraysMaaraykset = getMaarayksetByKoodiarvo("22", maaraykset);
  const yhteistyosopimuksetUnchecked = isValintaUnchecked(
    "muut_08.yhteistyosopimus.8.A",
    changeObjects
  );
  const muuMaarayksetUnchecked = isValintaUnchecked(
    "muut_07.muumaarays.22.A",
    changeObjects
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
    /** Ei tallenneta yhteistyösopimusten/muiden määräysten tekstikenttää,
     * jos yhteistyösopimukset/muut määräykset unchecked */
    if (
      (pathEq(["properties", "metadata", "koodiarvo"], "8", changeObj) &&
        yhteistyosopimuksetUnchecked &&
        changeObj.anchor === "muut_08.yhteistyosopimus.8.tekstikentta.A") ||
      (pathEq(["properties", "metadata", "koodiarvo"], "22", changeObj) &&
        muuMaarayksetUnchecked &&
        changeObj.anchor === "muut_07.muumaarays.22.other.A")
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
    /** Tallennetaan muun määräyksen tekstikentän arvo paikkaan
     * meta->value */
    if (
      !muuMaarayksetUnchecked &&
      pathEq(["properties", "metadata", "koodiarvo"], "22", changeObj) &&
      changeObj.anchor === "muut_07.muumaarays.22.other.A"
    ) {
      meta = assoc("value", changeObj.properties.value, meta);
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
    removalObjectsShouldBeCreated(
      "8",
      yhteistyosopimusmaaraykset,
      yhteistyosopimuksetUnchecked,
      changeObjects.muutokset,
      "muut_08.yhteistyosopimus.8.tekstikentta.A"
    )
  ) {
    changes = createRemovalObjectsForMaaraykset(
      yhteistyosopimusmaaraykset,
      kohde,
      maaraystyypit,
      changes
    );
  }
  /** Poisto-objektin luominen edellisille muille määräyksille, jos löytyy muutos-objekti koskien muun määräyksen
   * tekstikenttää */
  if (
    removalObjectsShouldBeCreated(
      "22",
      muuMaaraysMaaraykset,
      muuMaarayksetUnchecked,
      changeObjects.muutokset,
      "muut_07.muumaarays.22.other.A"
    )
  ) {
    changes = createRemovalObjectsForMaaraykset(
      muuMaaraysMaaraykset,
      kohde,
      maaraystyypit,
      changes
    );
  }
  return changes;
};

const createRemovalObjectsForMaaraykset = (
  maaraykset,
  kohde,
  maaraystyypit,
  changes
) =>
  append(
    map(maarays => {
      return {
        koodiarvo: maarays.koodiarvo,
        koodisto: "oivamuutoikeudetvelvollisuudetehdotjatehtavat",
        kohde,
        maaraystyyppi: find(propEq("tunniste", "VELVOITE"), maaraystyypit),
        maaraysUuid: maarays.uuid,
        tila: "POISTO"
      };
    }, maaraykset),
    changes
  );

const getMaarayksetByKoodiarvo = (koodiarvo, maaraykset) => {
  return filter(maarays => maarays.koodiarvo === koodiarvo, maaraykset);
};

const isValintaUnchecked = (anchor, changeObjects) => {
  return !!find(
    cObj => cObj.anchor === anchor && !cObj.properties.isChecked,
    changeObjects.muutokset
  );
};

const removalObjectsShouldBeCreated = (
  koodiarvo,
  maarayksetValinnalle,
  valintaUnchecked,
  muutokset,
  textFieldAnchor
) =>
  !!length(maarayksetValinnalle) &&
  !valintaUnchecked &&
  !!find(
    cObj =>
      pathEq(["properties", "metadata", "koodiarvo"], koodiarvo, cObj) &&
      cObj.anchor === textFieldAnchor,
    muutokset
  );
