import { find, pathEq } from "ramda";

export default async function getOpetuksenJarjestamismuodotLomake(
  osionData = []
) {
  const valittuJarjestamismuoto = find(
    pathEq(["properties", "isChecked"], true),
    osionData
  );

  /**
   * Päälomakkeella valinta tehdään radio button -elementeillä, joista yksi
   * on hyvin todennäköisesti valittuna, vaikka käyttäjä ei olisi itse valinnut
   * yhtäkään elementeistä. (oletusvalinta)
   */
  if (valittuJarjestamismuoto) {
    /**
     * Näytetään valittu arvo autocomplete-kentässä yhdenmukaisuuden vuoksi,
     * vaikka kenttään tuleekin vain yksi arvo, joka on oletuksena valittuna.
     */
    const valittuArvo = {
      label: valittuJarjestamismuoto.properties.title,
      value: valittuJarjestamismuoto.anchor
    };

    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "opetuksenJarjestamismuodot",
          name: "Autocomplete",
          styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
          properties: {
            forChangeObject: {
              section: "opetuksenJarjestamismuoto"
            },
            isMulti: false,
            options: [valittuArvo],
            value: [valittuArvo]
          }
        }
      ]
    };
  } else {
    return {
      anchor: "ei-valintamahdollisuutta",
      components: [
        {
          anchor: "teksti",
          name: "StatusTextRow",
          properties: {
            title: "Ei valintamahdollisuutta."
          }
        }
      ]
    };
  }
}
