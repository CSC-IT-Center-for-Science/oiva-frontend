import { getOpetuksenJarjestamismuodotFromStorage } from "helpers/opetuksenJarjestamismuodot";
import { find, length, map, path, pathEq } from "ramda";

export default async function getOpetuksenJarjestamismuotokomponentit(
  isReadOnly,
  osionData = []
) {
  const opetuksenJarjestamismuodot = await getOpetuksenJarjestamismuodotFromStorage();

  const valittuJarjestamismuoto = find(
    pathEq(["properties", "isChecked"], true),
    osionData
  );
  console.info(valittuJarjestamismuoto, osionData);
  /**
   * Päälomakkeella valinta tehdään radio button -elementeillä, joista yksi
   * on hyvin todennäköisesti valittuna, vaikka käyttäjä ei olisi itse valinnut
   * yhtäkään elementeistä. (oletusvalinta)
   */
  if (length(opetuksenJarjestamismuodot)) {
    /**
     * Näytetään valittu arvo autocomplete-kentässä yhdenmukaisuuden vuoksi,
     * vaikka kenttään tuleekin vain yksi arvo, joka on oletuksena valittuna.
     */
    return [
      {
        anchor: "opetuksenJarjestamismuodot",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "opetuksenJarjestamismuoto"
          },
          isMulti: false,
          isReadOnly,
          options: map(muoto => {
            /**
             * Tarkistetaan, onko kyseinen opetuksen järjestämismuoto
             * valittuna lomakkeella, jota vasten rajoituksia ollaan
             * tekemässä.
             **/
            console.info(muoto, valittuJarjestamismuoto);
            return path(
              ["properties", "forChangeObject", "koodiarvo"],
              valittuJarjestamismuoto
            ) === muoto.koodiarvo
              ? {
                  label: valittuJarjestamismuoto.properties.title,
                  value: valittuJarjestamismuoto.anchor
                }
              : null;
          }, opetuksenJarjestamismuodot).filter(Boolean),
          value: ""
        }
      }
    ];
  } else {
    return [
      {
        anchor: "ei-järjestamismuotoja",
        name: "StatusTextRow",
        properties: {
          title: "Ei valittuja opetuksen järjestämismuotoja."
        }
      }
    ];
  }
}
