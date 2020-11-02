import { isAdded, isInLupa, isRemoved } from "css/label";
import { map, toLower } from "ramda";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Yhteistyosopimukset.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getMuutYhteistyosopimus(
  { items, maarayksetByKoodiarvo },
  isReadOnly,
  locale
) {
  const localeUpper = locale.toUpperCase();

  return map(item => {
    const maarays = maarayksetByKoodiarvo[item.koodiarvo];
    let title =
      item.metadata[localeUpper].kuvaus || item.metadata[localeUpper].nimi;

    /**
     * Koodi 8 on erikoistapaus. Sen tullessa vastaan, ei käytetä edellä
     * määriteltyä yleistä kuvaustekstiä, vaan kuvausteksti kaivetaan
     * määräyksen alta. Tämä johtuu siitä, että eri koulutuksen
     * järjestäjillä on koodilla 8 erilaisia kuvaustekstejä.
     **/
    if (item.koodiarvo === "8") {
      title = maarays
        ? maarays.meta["yhteistyösopimus"][toLower(locale)]
        : title;
    }

    return {
      anchor: item.koodiarvo,
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            isChecked: !!maarays,
            isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: !!maarays ? isInLupa : {}
            },
            title
          }
        }
      ]
    };
  }, items);
}
