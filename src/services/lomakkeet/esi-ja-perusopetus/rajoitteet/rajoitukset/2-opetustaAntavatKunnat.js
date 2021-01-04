import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  includes,
  isNil,
  map,
  not,
  path,
  prop,
  sortBy,
  toUpper,
  values
} from "ramda";
import { getKunnatFromStorage } from "helpers/kunnat";

export default async function getOpetustaAntavatKunnat(
  isReadOnly,
  osionData = [],
  locale
) {
  const localeUpper = toUpper(locale);
  const kunnat = await getKunnatFromStorage();

  console.info("osion data", osionData);

  const changesByProvinceObj = find(
    compose(endsWith(".maakunnatjakunnat"), prop("anchor")),
    osionData
  );

  console.info(changesByProvinceObj);

  if (kunnat) {
    const valitutKunnat = changesByProvinceObj
      ? map(
          path(["properties", "metadata", "koodiarvo"]),
          flatten(
            values(changesByProvinceObj.properties.changeObjectsByProvince)
          )
        )
      : [];

    console.info(valitutKunnat);

    return [
      {
        anchor: "opetustaAntavatKunnat",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "opetustaAntavatKunnat"
          },
          isMulti: false,
          isReadOnly,
          options: map(kunta => {
            const { koodiarvo, metadata } = kunta;
            return includes(koodiarvo, valitutKunnat)
              ? { label: metadata[localeUpper].nimi, value: koodiarvo }
              : null;
          }, kunnat).filter(Boolean),
          value: ""
        }
      }
    ];
  } else {
    return [
      {
        anchor: "ei-kuntia",
        name: "StatusTextRow",
        properties: {
          title: "Ei valintamahdollisuutta."
        }
      }
    ];
  }
}
