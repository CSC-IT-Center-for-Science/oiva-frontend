import {
  compose,
  includes,
  flatten,
  path,
  omit,
  prop,
  groupBy,
  head,
  mapObjIndexed,
  map,
  find,
  propEq,
  join,
  init,
  split,
  filter
} from "ramda";
import localforage from "localforage";
import { fillForBackend } from "../../services/lomakkeet/backendMappings";
import { getAnchorInit } from "utils/common";

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

export const getChangesToSave = (changeObjects = {}, kohde, maaraystyypit) =>
  map(changeObj => {
    const anchorInit = getAnchorInit(changeObj.anchor);

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
        tunniste: "oivamuutoikeudetvelvollisuudetehdotjatehtavat",
        changeObjects: flatten([[changeObj], perustelut]),
        muutosperustelukoodiarvo: []
      },
      perustelutForBackend,
      perusteluteksti ? { perusteluteksti } : null
    );
    const maaraysUuid = path(
      ["properties", "metadata", "maaraysUuid"],
      changeObj
    );
    return {
      koodiarvo: path(["properties", "metadata", "koodiarvo"], changeObj),
      koodisto: path(
        ["properties", "metadata", "koodisto", "koodistoUri"],
        changeObj
      ),
      kohde,
      maaraystyyppi: find(propEq("tunniste", "VELVOITE"), maaraystyypit),
      maaraysUuid,
      meta,
      tila
    };
  }, changeObjects.muutokset).filter(Boolean);
