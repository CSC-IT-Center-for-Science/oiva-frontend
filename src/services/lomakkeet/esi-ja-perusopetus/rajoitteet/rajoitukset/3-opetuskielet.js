import { flatten, map, path, prop, sortBy } from "ramda";

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
export default async function getOpetuskieletlomake(osionData = []) {
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
  return osionData.length
    ? {
        anchor: "rajoitus",
        components: [
          {
            anchor: "opetuskielet",
            name: "Autocomplete",
            styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
            properties: {
              forChangeObject: {
                section: "opetuskielet"
              },
              isMulti: false,
              options: valitutKielet,
              value: ""
            }
          }
        ]
      }
    : [
        {
          anchor: "ei-valintamahdollisuutta",
          components: [
            {
              anchor: "teksti",
              name: "StatusTextRow",
              properties: {
                title: "Valitse ensin opetuskieliä päälomakkeelta."
              }
            }
          ]
        }
      ];
}
