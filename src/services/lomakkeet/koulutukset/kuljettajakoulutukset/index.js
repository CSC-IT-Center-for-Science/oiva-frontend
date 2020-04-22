import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { map } from "ramda";

function getModificationForm(koulutusdata) {
  const categories = map(item => {
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
  return categories;
}

export default function getKuljettajakoulutuslomake(action, data) {
  switch (action) {
    case "modification":
      return getModificationForm(data.koulutusdata);
    default:
      return [];
  }
}
