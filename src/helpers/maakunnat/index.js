import {
  mapObjIndexed,
  map,
  head,
  groupBy,
  prop,
  omit,
  filter,
  sortBy,
  path
} from "ramda";
import localforage from "localforage";

export function initializeMaakunta(maakuntadata, localeUpper) {
  const currentDate = new Date();
  if (
    currentDate >= new Date(maakuntadata.voimassaAlkuPvm) &&
    currentDate <= new Date(maakuntadata.voimassaLoppuPvm || currentDate) &&
    // 21 = Ahvenanmaa
    maakuntadata.koodiArvo !== "21" &&
    // 99 = Ei tiedossa
    maakuntadata.koodiArvo !== "99"
  ) {
    // Filter out ulkomaat
    const kunnat = filter(
      kunta => kunta.koodiArvo !== "200",
      maakuntadata.kunta
    );
    return omit(["kunta", "koodiArvo"], {
      ...maakuntadata,
      koodiarvo: maakuntadata.koodiArvo,
      kunnat: sortBy(
        path(["metadata", localeUpper, "nimi"]),
        map(
          kunta =>
            omit(["koodiArvo"], {
              ...kunta,
              koodiarvo: kunta.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), kunta.metadata)
              )
            }),
          kunnat
        )
      ),
      metadata: mapObjIndexed(
        head,
        groupBy(prop("kieli"), maakuntadata.metadata)
      )
    });
  }
  return null;
}

export async function getMaakunnat() {
  return await localforage.getItem("maakunnat");
}

export async function getMaakuntakunnat() {
  return await localforage.getItem("maakuntakunnat");
}
