import {
  compose,
  concat,
  endsWith,
  filter,
  find,
  flatten,
  includes,
  map,
  path,
  pathEq,
  prop,
  startsWith,
  toUpper,
  values,
  without
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

  const areaOfAction = find(
    compose(endsWith(".maakunnatjakunnat"), prop("anchor")),
    osionData
  );

  // Ulkomaiden eri kunnat, jotka käyttäjä on syöttänyt vapaasti
  // päälomakkeella, halutaan samaan luetteloon Suomen kuntien kanssa.
  // Päälomakkeella on syöttämistä varten yksi textarea-elementti, joten
  // tilaobjekteja on 0 - 1 kappale(tta).
  const ulkomaatStateObj = filter(changeObj => {
    return (
      endsWith(".kuvaus", changeObj.anchor) &&
      startsWith("toimintaalue.200.", changeObj.anchor)
    );
  }, osionData);

  // Jos kunta ulkomailta löytyi, luodaan sen pohjalta vaihtoehto (option)
  // alempana koodissa luotavaa pudostusvalikkoa varten.
  const ulkomaaOptions = map((item, index) => {
    return {
      label: item.properties.value,
      value: "200",
      index
    };
  }, ulkomaatStateObj);

  if (kunnat) {
    // Koska osion data ei ole ajantasalla johtuen kuntaosion monimutkaisesta
    // rakenteesta, on osion muutoksia tarkkailtava, jotta käyttäjälle osataan
    // näyttää vain ja ainoastaan kunnat, jotka ovat valittuina päälomakkeella.
    const muutoksillaValitutKunnat = areaOfAction
      ? map(
          path(["properties", "metadata", "koodiarvo"]),
          filter(changeObj => {
            return pathEq(["properties", "isChecked"], true, changeObj);
          }, flatten(values(areaOfAction.properties.changeObjectsByProvince)))
        )
      : [];

    const oletusarvoinValitutKunnat = areaOfAction
      ? map(prop("koodiarvo"), areaOfAction.properties.currentMunicipalities)
      : [];

    const muutoksillaPoistetutKunnat = areaOfAction
      ? map(
          path(["properties", "metadata", "koodiarvo"]),
          filter(changeObj => {
            return pathEq(["properties", "isChecked"], false, changeObj);
          }, flatten(values(areaOfAction.properties.changeObjectsByProvince)))
        )
      : [];

    const valitutKunnat = without(
      concat(["200"], muutoksillaPoistetutKunnat),
      concat(oletusarvoinValitutKunnat, muutoksillaValitutKunnat)
    );

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
