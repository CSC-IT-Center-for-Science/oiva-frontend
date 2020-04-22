import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { map } from "ramda";

function getModificationForm(koulutusdata) {
  const categories = map(item => {
    return {
      anchor: item.code,
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject: {
              isInLupa: item.isInLupa,
              koodisto: item.koodisto,
              metadata: item.metadata,
              maaraysUuid: item.maaraysUuid
            },
            name: "CheckboxWithLabel",
            code: item.code,
            title: item.title,
            isChecked: item.shouldBeChecked,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: Object({}, item.isInLupa ? isInLupa : {})
            }
          }
        }
      ]
    };
  }, koulutusdata.items);
  return categories;
}

export default function getValmentavatKoulutuksetLomake(action, data) {
  switch (action) {
    case "modification":
      return getModificationForm(data.koulutusdata);
    default:
      return [];
  }
}
