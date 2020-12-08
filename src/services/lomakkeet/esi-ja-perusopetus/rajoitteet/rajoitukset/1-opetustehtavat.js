import { getOpetustehtavatFromStorage } from "helpers/opetustehtavat";
import { getChangeObjByAnchor } from "../../../../../components/02-organisms/CategorizedListRoot/utils";
import { map, toUpper } from "ramda";

export default async function getOpetustehtavatLomake(
  changeObjects = [],
  locale
) {
  const opetustehtavat = await getOpetustehtavatFromStorage();
  const localeUpper = toUpper(locale);

  if (opetustehtavat.length) {
    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "opetustehtavat",
          name: "Autocomplete",
          properties: {
            forChangeObject: {
              section: "getOpetustehtavatLomake"
            },
            options: map(opetustehtava => {
              const maarays = false; // TO DO: Etsi opetustehtävää koskeva määräys
              const anchor = `opetustehtavat.opetustehtava.${opetustehtava.koodiarvo}`;
              const changeObj = getChangeObjByAnchor(anchor, changeObjects);
              return (!!maarays &&
                (!changeObj || changeObj.properties.isChecked)) ||
                (changeObj && changeObj.properties.isChecked)
                ? {
                    label: opetustehtava.metadata[localeUpper].nimi,
                    value: opetustehtava.koodiarvo
                  }
                : null;
            }, opetustehtavat).filter(Boolean),
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
