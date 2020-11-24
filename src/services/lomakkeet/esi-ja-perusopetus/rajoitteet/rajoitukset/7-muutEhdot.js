import { getPOMuutEhdotFromStorage } from "helpers/poMuutEhdot";
import { getChangeObjByAnchor } from "../../../../../components/02-organisms/CategorizedListRoot/utils";
import { map, toUpper } from "ramda";

export default async function muutEhdot(changeObjects = [], locale) {
  // npm run extract:messages ei ajaudu onnistuneesti, jos funktion otsikko
  // on sama kuin muuttujan nimi funktiossa.
  const _muutEhdot = await getPOMuutEhdotFromStorage();
  const localeUpper = toUpper(locale);

  if (muutEhdot.length) {
    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "muutEhdot",
          name: "Autocomplete",
          properties: {
            options: map(muutEhdot => {
              const maarays = false; // TO DO: Etsi opetustehtävää koskeva määräys
              const anchor = `muutEhdot.${muutEhdot.koodiarvo}.valintaelementti`;
              const changeObj = getChangeObjByAnchor(anchor, changeObjects);
              return (!!maarays &&
                (!changeObj || changeObj.properties.isChecked)) ||
                (changeObj && changeObj.properties.isChecked)
                ? {
                    label: muutEhdot.metadata[localeUpper].kuvaus
                      ? muutEhdot.metadata[localeUpper].kuvaus
                      : muutEhdot.metadata[localeUpper].nimi,
                    value: muutEhdot.koodiarvo
                  }
                : null;
            }, _muutEhdot).filter(Boolean),
            value: ""
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
