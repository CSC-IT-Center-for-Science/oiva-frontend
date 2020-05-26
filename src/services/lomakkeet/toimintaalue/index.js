import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import "../i18n-config";
import { __ } from "i18n-for-browser";

function getModificationForm(
  fiCode,
  maaraysUuid,
  changeObjectsByProvince = {},
  isEiMaariteltyaToimintaaluettaChecked,
  isMaakunnatJaKunnatChecked,
  isValtakunnallinenChecked,
  options = [],
  onChanges,
  kunnat,
  maakunnat,
  localizations,
  isMaakunnatJaKunnatActive
) {
  return [
    {
      anchor: "maakunnat-ja-kunnat",
      components: [
        {
          anchor: "radio",
          name: "RadioButtonWithLabel",
          properties: {
            isChecked: isMaakunnatJaKunnatChecked,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            forChangeObject: {
              title: "Maakunnat ja kunnat"
            },
            title: "Maakunnat ja kunnat"
          }
        }
      ],
      categories: [
        {
          anchor: "valintakentta",
          isVisible: isMaakunnatJaKunnatActive,
          layout: { indentation: "none" },
          components: [
            {
              anchor: "maakunnatjakunnat",
              name: "CategoryFilter",
              styleClasses: ["ml-10 mt-4"],
              properties: {
                anchor: "maakuntakunnat",
                changeObjectsByProvince,
                localizations,
                municipalities: kunnat,
                onChanges: payload => {
                  onChanges(payload);
                },
                provinces: options,
                provincesWithoutMunicipalities: maakunnat,
                showCategoryTitles: false
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "valtakunnallinen",
      components: [
        {
          anchor: "radio",
          name: "RadioButtonWithLabel",
          properties: {
            title: "Koko Suomi - pois lukien Ahvenanmaan maakunta",
            isChecked: isValtakunnallinenChecked,
            labelStyles: {
              addition: isAdded,
              custom: fiCode === "FI1" ? isInLupa : {},
              removal: isRemoved
            },
            forChangeObject: {
              maaraysUuid,
              title: __("responsibilities")
            }
          }
        }
      ]
    },
    {
      anchor: "ei-maariteltya-toiminta-aluetta",
      components: [
        {
          anchor: "radio",
          name: "RadioButtonWithLabel",
          properties: {
            isChecked: isEiMaariteltyaToimintaaluettaChecked,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            forChangeObject: {
              title: "Ei määriteltyä toiminta-aluetta"
            },
            title: "Ei määriteltyä toiminta-aluetta"
          }
        }
      ]
    }
  ];
}

export default function getToimintaaluelomake(action, data) {
  switch (action) {
    case "modification":
      return getModificationForm(
        data.fiCode,
        data.maaraysUuid,
        data.changeObjectsByProvince,
        data.isEiMaariteltyaToimintaaluettaChecked,
        data.isMaakunnatJaKunnatChecked,
        data.isValtakunnallinenChecked,
        data.options,
        data.onChanges,
        data.kunnat,
        data.maakunnat,
        data.localizations,
        data.isMaakunnatJaKunnatActive
      );
    default:
      return [];
  }
}
