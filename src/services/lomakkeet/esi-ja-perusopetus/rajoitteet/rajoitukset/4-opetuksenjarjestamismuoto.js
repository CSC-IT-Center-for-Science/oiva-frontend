import { getOpetuksenJarjestamismuodotFromStorage } from "helpers/opetuksenJarjestamismuodot";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";
import { map,toUpper } from "ramda";

export default async function opetuksenjarjestamismuodot(
  asetus,
  changeObjects = [],
  locale
) {
  const opetuksenjarjestamismuodot = await getOpetuksenJarjestamismuodotFromStorage();
  const localeUpper = toUpper(locale);

  if (opetuksenjarjestamismuodot.length) {
    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "opetuksenJarjestamismuodot",
          name: "Autocomplete",
          properties: {
            options: map((opetuksenjarjestamismuodot) => {
              const maarays = false; // TO DO: Etsi opetustehtävää koskeva määräys
              const anchor = `opetuksenJarjestamismuodot.${opetuksenjarjestamismuodot.koodiarvo}.valinta`;
              const changeObj = getChangeObjByAnchor(anchor, changeObjects);
              return (!!maarays &&
              (!changeObj || changeObj.properties.isChecked)) ||
              (changeObj && changeObj.properties.isChecked)
                ? {
                    label: opetuksenjarjestamismuodot.metadata[localeUpper].nimi,
                    value: opetuksenjarjestamismuodot.koodiarvo
                  }
                : null;
            }, opetuksenjarjestamismuodot).filter(Boolean),
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
