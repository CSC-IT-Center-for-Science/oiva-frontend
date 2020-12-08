import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { getOpetuskieletFromStorage } from "helpers/opetuskielet";
import { isNil, map, reject, toUpper } from "ramda";

/**
 * For: Koulutuksen järjestäjä
 * Used on: Wizard page 1
 * Section: kielet, opetuskielet
 */
async function getModificationForm(locale) {
  const localeUpper = toUpper(locale);
  const opetuskielet = await getOpetuskieletFromStorage();
  return map(opetuskieli => {
    return {
      anchor: opetuskieli.koodiarvo,
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject: reject(isNil)({
              isInLupa: !!opetuskieli.maarays,
              maaraysUuid: opetuskieli.maaraysUuid,
              kuvaus: opetuskieli.metadata[localeUpper].kuvaus,
              meta: opetuskieli.meta
            }),
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

export default async function getOpetuskieletLomake(
  action,
  data,
  { isReadOnly },
  locale
) {
  switch (action) {
    case "modification":
      return await getModificationForm(locale);
    default:
      return [];
  }
}
