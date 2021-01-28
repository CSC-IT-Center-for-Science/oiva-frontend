import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { compose, find, includes, map, path, prop } from "ramda";
import getDefaultRemovalForm from "../../perustelut/lomakeosiot/poistolomake";
import { __ } from "i18n-for-browser";

function getReasoningForm(koulutusdata, changeObjects, { isReadOnly }, prefix) {
  const categories = map(item => {
    const changeObj = find(
      compose(includes(`.${item.code}.`), prop("anchor")),
      changeObjects
    );

    if (!changeObj) {
      return null;
    }

    const isAddition = path(["properties", "isChecked"], changeObj);

    return {
      anchor: item.code,
      components: [
        {
          anchor: "A",
          name: "StatusTextRow",
          properties: {
            name: "StatusTextRow",
            code: item.code,
            title: item.title,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: Object({}, item.isInLupa ? isInLupa : {})
            }
          }
        }
      ],
      categories: isAddition
        ? [
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
                    isReadOnly,
                    title: __("reasoning.title.default"),
                    value: "",
                    requiredMessage: "Pakollinen tieto puuttuu"
                  }
                }
              ]
            }
          ]
        : getDefaultRemovalForm(isReadOnly, prefix)
    };
  }, koulutusdata.items).filter(Boolean);
  return categories;
}

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

export default function getValmentavatKoulutuksetLomake(
  mode,
  data,
  booleans,
  locale,
  changeObjects = [],
  functions,
  prefix
) {
  switch (mode) {
    case "modification":
      return getModificationForm(data.koulutusdata);
    case "reasoning":
      return getReasoningForm(
        data.koulutusdata,
        changeObjects,
        booleans,
        prefix
      );
    default:
      return [];
  }
}
