import { getKujalisamaareetFromStorage } from "helpers/kujalisamaareet";
import {
  map,
  path,
  toUpper
} from "ramda";

export const getKohdennuksenKohdekomponentti = async (isReadOnly, locale) => {
  const kujalisamaareet = await getKujalisamaareetFromStorage(
    "joistaLisaksi"
  );
  return {
    anchor: "kohde",
    name: "Autocomplete",
    layout: { indentation: "none" },
    styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
    properties: {
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: map(maare => {
        const koodistoUri = path(["koodisto", "koodistoUri"], maare);
        return {
          value: `${koodistoUri}_${maare.koodiarvo}`,
          label: maare.metadata[toUpper(locale)].nimi
        };
      }, kujalisamaareet),
      value: ""
    }
  };
};
