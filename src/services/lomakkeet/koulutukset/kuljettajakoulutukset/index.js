import { isAdded, isRemoved, isInLupa } from "../../../../css/label";
import { compose, find, includes, map, path, prop } from "ramda";
import { __ } from "i18n-for-browser";
import {
  getKuljettajienJatkokoulutuslomake,
  getKuljettajienPeruskoulutuslomake
} from "services/lomakkeet/perustelut/kuljettajakoulutukset";

function getReasoningForm(koulutusdata, changeObjects, { isReadOnly }, prefix) {
  const categories = map(item => {
    const changeObj = find(
      compose(includes(`.${item.code}.`), prop("anchor")),
      changeObjects
    );

    if (!changeObj) {
      return null;
    }

    console.info(item, changeObj);

    let kuljettajienLomake = [];

    const action = path(["properties", "isChecked"], changeObj)
      ? "addition"
      : "removal";

    if (item.code === "1") {
      kuljettajienLomake = getKuljettajienPeruskoulutuslomake(
        action,
        isReadOnly,
        prefix
      );
    } else if (item.code === "2") {
      kuljettajienLomake = getKuljettajienJatkokoulutuslomake(
        action,
        isReadOnly,
        prefix
      );
    }

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
      categories: kuljettajienLomake
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

export default function getKuljettajakoulutuslomake(
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
