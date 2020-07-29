import {
  mapObjIndexed,
  groupBy,
  prop,
  head,
  lensIndex,
  view,
  split,
  compose,
  equals,
  flatten,
  map,
  filter,
  propEq,
  path,
  find
} from "ramda";
import localforage from "localforage";

export const initializeKieli = ({
  koodiArvo: koodiarvo,
  koodisto,
  metadata,
  versio,
  voimassaAlkuPvm
}) => {
  return {
    koodiarvo,
    koodisto,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), metadata)),
    versio,
    voimassaAlkuPvm
  };
};

export function getKieletFromStorage() {
  return localforage.getItem("kielet");
}

export const getChangesToSave = (changeObjects = {}, kohde, maaraystyypit) =>
  map(changeObj => {
    const anchorParts = changeObj.anchor.split(".");
    const code = view(lensIndex(1), anchorParts);
    const perustelut = filter(
      compose(equals(code), view(lensIndex(1)), split("."), prop("anchor")),
      changeObjects.perustelut
    );
    const meta = path(["properties", "metadata"], changeObj) || {};

    return {
      koodiarvo: code,
      koodisto: "oppilaitoksenopetuskieli",
      nimi: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
      kuvaus: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
      isInLupa: meta.isInLupa,
      kohde, //: meta.kohde.kohdeArvot[0].kohde,
      maaraystyyppi: find(propEq("tunniste", "VELVOITE"), maaraystyypit), // : meta.maaraystyyppi,
      maaraysUuid: meta.maaraysUuid,
      meta: {
        tunniste: "opetuskieli",
        changeObjects: flatten([[changeObj], perustelut]),
        perusteluteksti: map(perustelu => {
          if (path(["properties", "value"], perustelu)) {
            return { value: path(["properties", "value"], perustelu) };
          }
          return {
            value: path(["properties", "metadata", "fieldName"], perustelu)
          };
        }, perustelut)
      },
      tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
      type: changeObj.properties.isChecked ? "addition" : "removal"
    };
  }, changeObjects.muutokset).filter(Boolean);
