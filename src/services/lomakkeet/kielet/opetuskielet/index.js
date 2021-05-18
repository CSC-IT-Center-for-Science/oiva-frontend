import { isAdded, isRemoved, isInLupa } from "css/label";
import { getOpetuskieletFromStorage } from "helpers/opetuskielet";
import { find, isNil, map, propEq, reject, toUpper } from "ramda";

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
              custom: Object.assign({}, opetuskieli.maarays ? isInLupa : {})
            }
          }
        }
      ]
    };
  }, opetuskielet);
}

async function getReasoningForm({ isReadOnly }, locale, changeObjects = []) {
  const localeUpper = toUpper(locale);
  const opetuskielet = await getOpetuskieletFromStorage();

  return map(opetuskieli => {
    let structure = null;
    const changeObj = find(
      propEq("anchor", `kielet_opetuskielet.${opetuskieli.koodiarvo}.A`),
      changeObjects
    );
    if (changeObj) {
      const isAddedBool = changeObj.properties.isChecked;
      structure = {
        anchor: opetuskieli.koodiarvo,
        meta: {
          isInLupa: !!opetuskieli.maarays,
          kuvaus: opetuskieli.metadata[localeUpper].nimi,
          meta: opetuskieli.meta
        },
        components: [
          {
            anchor: "A",
            name: "StatusTextRow",
            properties: {
              title: opetuskieli.metadata[localeUpper].nimi,
              styleClasses: ["flex"],
              statusTextStyleClasses: isAddedBool
                ? ["text-green-600 pr-4 w-20 font-bold"]
                : ["text-red-500 pr-4 w-20 font-bold"],
              statusText: isAddedBool ? " LISÄYS:" : " POISTO:"
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
                  isReadOnly,
                  placeholder: "Sana on vapaa...",
                  title: "Perustelut",
                  value: ""
                },
                styleClasses: ["mb-6 w-full"]
              }
            ]
          }
        ]
      };
    }
    return structure;
  }, opetuskielet).filter(Boolean);
}

export default async function getOpetuskieletLomake(
  mode,
  data,
  booleans,
  locale,
  changeObjects
) {
  switch (mode) {
    case "modification":
      return await getModificationForm(locale);
    case "reasoning":
      return await getReasoningForm(booleans, locale, changeObjects);
    default:
      return [];
  }
}
