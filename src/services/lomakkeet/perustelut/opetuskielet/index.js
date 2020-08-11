import { find, map, propEq, toUpper } from "ramda";

function getReasoningForm(
  locale,
  changeObjects,
  isReadOnly,
  kohde,
  maaraystyyppi,
  opetuskielet
) {
  const localeUpper = toUpper(locale);
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
          kohde: kohde,
          maaraystyyppi,
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
                  isReadOnly: isReadOnly,
                  placeholder: "Sana on vapaa...",
                  title: "Perustelut",
                  value: ""
                }
              }
            ]
          }
        ]
      };
    }
    return structure;
  }, opetuskielet).filter(Boolean);
}

export default function getOpetuskieletPerustelulomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "reasoning":
      return getReasoningForm(
        locale,
        data.changeObjectsPage1,
        isReadOnly,
        data.kohde,
        data.maaraystyyppi,
        data.opetuskielet
      );
    default:
      return [];
  }
}
