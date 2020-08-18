import {
  mapObjIndexed,
  map,
  head,
  groupBy,
  prop,
  omit,
  filter,
  sortBy,
  path,
  reject,
  isNil
} from "ramda";
import localforage from "localforage";

export function initializeMaakunta(maakuntadata, localeUpper) {
  const currentDate = new Date();
  if (
    currentDate >= new Date(maakuntadata.voimassaAlkuPvm) &&
    currentDate <= new Date(maakuntadata.voimassaLoppuPvm || currentDate)
  ) {
    // Filter out ulkomaat
    const kunnat = filter(
      kunta => kunta.koodiArvo !== "200",
      maakuntadata.kunta || []
    );
    return reject(isNil)(
      omit(["kunta", "koodiArvo"], {
        ...maakuntadata,
        koodiarvo: maakuntadata.koodiArvo,
        kunnat: kunnat.length
          ? sortBy(
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
            )
          : null,
        metadata: mapObjIndexed(
          head,
          groupBy(prop("kieli"), maakuntadata.metadata)
        )
      })
    );
  }
  return null;
}

export async function getMaakuntakunnat() {
  return await localforage.getItem("maakuntakunnat");
}
