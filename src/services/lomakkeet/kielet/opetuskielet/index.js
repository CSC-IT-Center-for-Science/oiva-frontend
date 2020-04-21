import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { map } from "ramda";

/**
 * For: Koulutuksen järjestäjä
 * Used on: Wizard page 1
 * Section: kielet, opetuskielet
 */
function getModificationForm(opetuskieletData) {
  return map(item => {
    return {
      anchor: item.code,
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject: {
              isInLupa: item.isInLupa,
              maaraysUuid: item.maaraysUuid,
              kuvaus: item.title,
              meta: item.meta
            },
            name: "CheckboxWithLabel",
            isChecked: item.shouldBeSelected,
            title: item.title,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: Object.assign({}, item.isInLupa ? isInLupa : {})
            }
          }
        }
      ]
    };
  }, opetuskieletData.items);
}

export default function getOpetuskieletLomake(action, data) {
  switch (action) {
    case "modification":
      return getModificationForm(data.opetuskieletData);
    default:
      return [];
  }
}
