import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { map } from "ramda";

function getModificationForm(koulutusdata) {
  return map(item => {
    return {
      anchor: item.code,
      components: [
        {
          anchor: "A",
          name: "RadioButtonWithLabel",
          properties: {
            forChangeObject: {
              isReasoningRequired: item.isReasoningRequired,
              isInLupa: item.isInLupa,
              koodisto: item.koodisto,
              metadata: item.metadata,
              maaraysUuid: item.maaraysUuid
            },
            name: "RadioButtonWithLabel",
            title: item.title,
            isChecked: item.shouldBeChecked,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: item.isInLupa ? isInLupa : {}
            }
          }
        }
      ]
    };
  }, koulutusdata.items);
}

export default function getTyovoimakoulutuslomake(action, data) {
  switch (action) {
    case "modification":
      return getModificationForm(data.koulutusdata);
    default:
      return [];
  }
}
