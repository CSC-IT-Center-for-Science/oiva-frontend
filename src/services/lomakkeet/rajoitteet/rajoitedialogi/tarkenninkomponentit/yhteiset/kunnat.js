import {
  compose,
  endsWith,
  find,
  flatten,
  includes,
  map,
  path,
  prop,
  toUpper,
  values,
  filter,
  startsWith,
  concat
} from "ramda";
import { getKunnatFromStorage } from "helpers/kunnat";

export default async function getKunnat(
  isReadOnly,
  osionData = [],
  locale,
  isMulti,
  inputId
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
  const ulkomaatStateObj = filter(changeObj => {
    return (
      endsWith(".lisatiedot", changeObj.anchor) &&
      startsWith("toimintaalue.ulkomaa.", changeObj.anchor)
    );
  }, osionData);

  // Jos kunta ulkomailta löytyi, luodaan sen pohjalta vaihtoehto (option)
  // alempana koodissa luotavaa pudostusvalikkoa varten.
  const ulkomaaOptions = ulkomaatStateObj.map((item, index) => {
    if (item.properties.metadata) {
      return {
        label: item.properties.value,
        value: item.properties.metadata.koodiarvo,
        index
      };
    }
    return null;
  });

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
          inputId,
          isMulti,
          isReadOnly,
          options: concat(
            map(kunta => {
              const { koodiarvo, metadata } = kunta;
              return includes(koodiarvo, valitutKunnat)
                ? { label: metadata[localeUpper].nimi, value: koodiarvo }
                : null;
            }, kunnat),
            ulkomaaOptions
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
