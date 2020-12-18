import { isAdded, isRemoved } from "css/label";
import { find, pathEq, propEq } from "ramda";
import { __ } from "i18n-for-browser";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";

export async function getOpiskelijamaaratLomake(
  { maaraykset },
  { isPreviewModeOn, isReadOnly }
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const lisatiedot = await getLisatiedotFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  return [
    {
      anchor: "info",
      components: [
        {
          anchor: "valinta",
          name: "StatusTextRow",
          styleClasses: ["mb-6"],
          properties: {
            title: __("opiskelijamaara.osionInfoteksti")
          }
        }
      ]
    },
    {
      anchor: "kokonaismaara",
      components: [
        {
          anchor: "valinta",
          name: "RadioButtonWithLabel",
          properties: {
            forChangeObject: {
              strategia: "kokonaismaara"
            },
            isChecked: false,
            isIndeterminate: false,
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            title: __("opiskelijamaara.kokonaismaaraJaSenKohdennukset")
          }
        }
      ]
    },
    {
      anchor: "vainKohdennetut",
      components: [
        {
          anchor: "valinta",
          name: "RadioButtonWithLabel",
          properties: {
            forChangeObject: {
              strategia: "vainKohdennetut"
            },
            isChecked: false,
            isIndeterminate: false,
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            title: __("opiskelijamaara.vainKohdennetutRajoitukset")
          }
        }
      ]
    },
    {
      anchor: "eiRajoiteta",
      components: [
        {
          anchor: "valinta",
          name: "RadioButtonWithLabel",
          properties: {
            forChangeObject: {
              strategia: "eiRajoitetta"
            },
            isChecked: true,
            isIndeterminate: false,
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            title: __("opiskelijamaara.eiRajoiteta")
          }
        }
      ]
    },
    {
      anchor: "lisatiedot",
      layout: { margins: { top: "large" } },
      components: [
        {
          anchor: "info",
          name: "StatusTextRow",
          styleClasses: ["pt-8", "border-t"],
          properties: {
            title: __("common.lisatiedotInfo")
          }
        }
      ]
    },
    {
      anchor: "lisatiedot",
      components: [
        {
          anchor: lisatiedotObj.koodiarvo,
          name: "TextBox",
          properties: {
            forChangeObject: {
              koodiarvo: lisatiedotObj.koodiarvo,
              koodisto: lisatiedotObj.koodisto,
              versio: lisatiedotObj.versio,
              voimassaAlkuPvm: lisatiedotObj.voimassaAlkuPvm
            },
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            placeholder: __("common.lisatiedot"),
            value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
          }
        }
      ]
    }
  ];
}
