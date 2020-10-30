import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { map, toUpper } from "ramda";

/**
 * For: Koulutuksen järjestäjä
 * Used on: Wizard page 1
 * Section: kielet, opetuskielet
 */
function getModificationForm(locale, opetuskielet) {
  const localeUpper = toUpper(locale);
  return map(opetuskieli => {
    return {
      anchor: opetuskieli.koodiarvo,
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject: {
              isInLupa: !!opetuskieli.maarays,
              maaraysUuid: opetuskieli.maaraysUuid,
              kuvaus: opetuskieli.metadata[localeUpper].kuvaus,
              meta: opetuskieli.meta
            },
            name: "CheckboxWithLabel",
            isChecked: !!opetuskieli.maarays,
            title: opetuskieli.metadata[localeUpper].nimi,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: Object.assign({}, !!opetuskieli.maarays ? isInLupa : {})
            }
          }
        }
      ]
    };
  }, opetuskielet);
}

export default function getOpetuskieletLomake(action, data, isReadOnly, locale) {
  switch (action) {
    case "modification":
      return getModificationForm(locale, data.opetuskielet);
    default:
      return [];
  }
}
