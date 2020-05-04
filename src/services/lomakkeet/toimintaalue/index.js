import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import "../i18n-config";
import { __ } from "i18n-for-browser";

function getModificationForm(
  isEiMaariteltyaToimintaaluettaChecked,
  isValtakunnallinenChecked,
  lupakohde,
  valtakunnallinenMaarays,
  options = []
) {
  console.info("Options: ", options);
  return [
    {
      anchor: "maakunnat-ja-kunnat",
      components: [
        {
          anchor: "radio",
          name: "RadioButtonWithLabel",
          properties: {
            isChecked:
              !isEiMaariteltyaToimintaaluettaChecked &&
              !isValtakunnallinenChecked,
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
        // {
        //   anchor: "valintakentta",
        //   isVisible:
        //     !isValtakunnallinenChecked &&
        //     !isEiMaariteltyaToimintaaluettaChecked,
        //   layout: { indentation: "none" },
        //   components: [
        //     {
        //       anchor: "maakunnatjakunnat",
        //       name: "Input",
        //       styleClasses: ["ml-10 mt-4"],
        //       properties: {
        //         isMulti: false,
        //         placeholder: "Valitse...",
        //         value: ""
        //       }
        //     }
        //   ]
        // },
        ...options
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
              custom:
                lupakohde.valtakunnallinen &&
                lupakohde.valtakunnallinen.arvo === "FI1"
                  ? isInLupa
                  : {},
              removal: isRemoved
            },
            forChangeObject: {
              maaraysUuid: valtakunnallinenMaarays
                ? valtakunnallinenMaarays.uuid
                : null,
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
        data.isEiMaariteltyaToimintaaluettaChecked,
        data.isValtakunnallinenChecked,
        data.lupakohde,
        data.valtakunnallinenMaarays,
        data.options
      );
    default:
      return [];
  }
}
