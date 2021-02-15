import {
  append,
  compose,
  endsWith,
  find,
  flatten,
  includes,
  map,
  path,
  prop,
  propEq,
  toUpper,
  values
} from "ramda";
import { getKunnatFromStorage } from "helpers/kunnat";

export default async function getOpetustaAntavatKunnat(
  isReadOnly,
  osionData = [],
  locale,
  useMultiselect = false
) {
  const localeUpper = toUpper(locale);
  const kunnat = await getKunnatFromStorage();

  const changesByProvinceObj = find(
    compose(endsWith(".maakunnatjakunnat"), prop("anchor")),
    osionData
  );

  // Ulkomaiden eri kunnat, jotka käyttäjä on syöttänyt vapaasti
  // päälomakkeella, halutaan samaan luetteloon Suomen kuntien kanssa.
  // Päälomakkeella on syöttämistä varten yksi textarea-elementti, joten
  // tilaobjekteja on 0 - 1 kappale(tta).
  const ulkomaaStateObj = find(
    propEq("anchor", "toimintaalue.ulkomaa.200.lisatiedot"),
    osionData
  );

  // Jos kunta ulkomailta löytyi, luodaan sen pohjalta vaihtoehto (option)
  // alempana koodissa luotavaa pudostusvalikkoa varten.
  const ulkomaaOption = ulkomaaStateObj && ulkomaaStateObj.properties.value
    ? {
        label: ulkomaaStateObj.properties.value,
        value: ulkomaaStateObj.properties.metadata.koodiarvo
      }
    : null;

  if (kunnat) {
    const valitutKunnat = changesByProvinceObj
      ? map(
          path(["properties", "metadata", "koodiarvo"]),
          flatten(
            values(changesByProvinceObj.properties.changeObjectsByProvince)
          )
        )
      : [];

    return [
      {
        anchor: "komponentti",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "opetustaAntavatKunnat"
          },
          isMulti: useMultiselect,
          isReadOnly,
          options: append(
            ulkomaaOption,
            map(kunta => {
              const { koodiarvo, metadata } = kunta;
              return includes(koodiarvo, valitutKunnat)
                ? { label: metadata[localeUpper].nimi, value: koodiarvo }
                : null;
            }, kunnat)
          ).filter(Boolean),
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
