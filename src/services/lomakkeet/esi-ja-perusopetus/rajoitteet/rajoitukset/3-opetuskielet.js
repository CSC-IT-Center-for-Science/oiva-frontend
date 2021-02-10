import { getKieletOPHFromStorage } from "helpers/opetuskielet";
import { find, flatten, map, path, prop, propEq, sortBy } from "ramda";

/**
 * Mikäli päälomakkeella on valittuna opetuskieliä, tämä funktio määrittää
 * ja palauttaa pudotusvalikon, jossa valitut opetuskielet ovat valittavina
 * rajoitteiksi. Muussa tapauksessa palautuu tieto siitä, ettei rajoituksia
 * ole mahdollista tehdä opetuskielten perusteella, koska päälomakkeella
 * niistä yksikään ei ole valittuna.
 *
 * @param {array} osionData - Sisältää päälomakkeen opetuskieliosion
 * lomakerakenteen täydennettyinä siihen tehdyillä muutoksilla.
 */
export default async function getOpetuskielikomponentit(
  isReadOnly,
  osionData = [],
  locale,
  useMultiselect = false
) {
  const kielet = await getKieletOPHFromStorage();

  // Yhdistetään päälomakkkeella valittuina olevat ensisijaiset ja toissijaiset
  // opetuskielet yhdeksi taulukoksi, koska tällä tietoa ei ole syystä
  // luoda omaa pudotusvalikkoa molemmille.
  const valitutKielet = sortBy(
    prop("label"),
    flatten(
      map(stateObj => {
        const valikko = path(
          ["properties", "forChangeObject", "valikko"],
          stateObj
        );
        return valikko ? stateObj.properties.value : null;
      }, osionData).filter(Boolean)
    )
  );

  // Palautettava lomakerakenne
  return kielet.length
    ? [
        {
          anchor: "komponentti",
          name: "Autocomplete",
          styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
          properties: {
            forChangeObject: {
              section: "opetuskielet"
            },
            isMulti: useMultiselect,
            isReadOnly,
            options: map(opetuskieli => {
              /**
               * Tarkistetaan, onko kyseinen opetuskieli valittuna
               * lomakkeella, jota vasten rajoituksia ollaan tekemässä.
               **/
              return find(
                propEq("value", opetuskieli.koodiarvo),
                valitutKielet
              );
            }, kielet).filter(Boolean),
            value: ""
          }
        }
      ]
    : [
        {
          anchor: "teksti",
          name: "StatusTextRow",
          properties: {
            title: "Ongelma kielien näyttämisessä."
          }
        }
      ];
}
