import { getPOErityisetKoulutustehtavatFromStorage } from "helpers/poErityisetKoulutustehtavat";
import { getChangeObjByAnchor } from "../../../../../components/02-organisms/CategorizedListRoot/utils";
import { map, addIndex, toUpper } from "ramda";

export default async function opetuksenjarjestamismuodot(
  asetus,
  changeObjects = [],
  locale
) {
  const erityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();
  const localeUpper = toUpper(locale);
  const mapIndexed = addIndex(map);

  if (erityisetKoulutustehtavat.length) {
    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "opetuksenJarjestamismuodot",
          name: "Autocomplete",
          properties: {
            options: mapIndexed((erityisetKoulutustehtavat, index) => {
              const maarays = false; // TO DO: Etsi opetustehtävää koskeva määräys
              const anchor = `erityisetKoulutustehtavat.${erityisetKoulutustehtavat.koodiarvo}.valintaelementti`;
              const changeObj = getChangeObjByAnchor(anchor, changeObjects);
              return (!!maarays &&
                (!changeObj || changeObj.properties.isChecked)) ||
                (changeObj && changeObj.properties.isChecked)
                ? {
                    label: erityisetKoulutustehtavat.metadata[localeUpper].nimi,
                    value: erityisetKoulutustehtavat.koodiarvo
                  }
                : null;
            }, erityisetKoulutustehtavat).filter(Boolean),
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
