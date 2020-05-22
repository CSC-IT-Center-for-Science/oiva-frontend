import getDefaultRemovalForm from "../../lomakeosiot/poistolomake";
import { isAdded, isRemoved, isInLupa } from "../../../../../css/label";
import { curriedGetAnchorPartsByIndex } from "../../../../../utils/common";
import * as R from "ramda";

function getAdditionForm(koulutusdata, changeObjectsPage1 = [], isReadOnly) {
  const getAnchorPartsByIndex = curriedGetAnchorPartsByIndex(
    changeObjectsPage1
  );
  const categories = R.map(item => {
    let structure = null;
    if (R.includes(item.code, getAnchorPartsByIndex(1))) {
      structure = {
        anchor: item.code,
        components: [
          {
            anchor: "A",
            name: "StatusTextRow",
            properties: {
              name: "StatusTextRow",
              title: item.title,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object({}, item.isInLupa ? isInLupa : {})
              }
            }
          }
        ],
        categories: [
          {
            anchor: "perustelut",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  forChangeObject: {
                    isInLupa: item.isInLupa,
                    koodisto: item.koodisto,
                    metadata: item.metadata
                  },
                  isReadOnly: isReadOnly,
                  requiredMessage: "Pakolinen tieto puuttuu",
                  title:
                    "Perustele lyhyesti miksi tälle muutokselle on tarvetta",
                  value: ""
                }
              }
            ]
          }
        ]
      };
    }
    return structure;
  }, koulutusdata.items);
  return categories.filter(Boolean);
}

export default function getATVKoulutuksetPerustelulomake(
  action,
  data,
  isReadOnly,
  prefix
) {
  switch (action) {
    case "addition":
      return getAdditionForm(
        data.koulutusdata,
        data.changeObjectsPage1,
        isReadOnly
      );
    case "removal":
      return getDefaultRemovalForm(isReadOnly, prefix);
    default:
      return [];
  }
}
