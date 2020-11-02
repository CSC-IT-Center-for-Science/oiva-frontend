import { getOpetuksenJarjestamismuodotFromStorage } from "helpers/opetuksenJarjestamismuodot";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";
import { map, addIndex, toUpper } from "ramda";

export default async function opetuksenjarjestamismuodot(
  asetus,
  changeObjects = [],
  locale
) {
  const opetuksenjarjestamismuodot = await getOpetuksenJarjestamismuodotFromStorage();
  const localeUpper = toUpper(locale);
  const mapIndexed = addIndex(map);

  console.info(asetus, changeObjects, opetuksenjarjestamismuodot, locale);

  if (opetuksenjarjestamismuodot.length) {
    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "opetuksenJarjestamismuodot",
          name: "Autocomplete",
          properties: {
            options: mapIndexed((opetuksenjarjestamismuodot, index) => {
              const maarays = false; // TO DO: Etsi opetustehtävää koskeva määräys
              const anchor = `opetuksenJarjestamismuodot.${index}.valinta`;
              console.log(anchor);
              console.log(changeObjects);
              const changeObj = getChangeObjByAnchor(anchor, changeObjects);
              console.info(changeObj);
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
