import { find, map, propEq } from "ramda";

function getReasoningForm(
  changeObjects,
  isReadOnly,
  kohde,
  maaraystyyppi,
  opetuskielet
) {
  return map(item => {
    let structure = null;
    const changeObj = find(
      propEq("anchor", `kielet_opetuskielet.${item.code}.A`),
      changeObjects
    );
    if (changeObj) {
      const isAddedBool = changeObj.properties.isChecked;
      structure = {
        anchor: item.code,
        meta: {
          isInLupa: item.isInLupa,
          kuvaus: item.title,
          kohde: kohde,
          maaraystyyppi,
          meta: item.meta
        },
        components: [
          {
            anchor: "A",
            name: "StatusTextRow",
            properties: {
              title: item.title,
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
  }, opetuskielet.items).filter(Boolean);
}

export default function getOpetuskieletPerustelulomake(
  action,
  data,
  isReadOnly
) {
  switch (action) {
    case "reasoning":
      return getReasoningForm(
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
