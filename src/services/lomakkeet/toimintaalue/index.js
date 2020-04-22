import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import "../i18n-config";
import { __ } from "i18n-for-browser";
import { map } from "ramda";

function getModificationForm(
  isEiMaariteltyaToimintaaluettaChecked,
  isValtakunnallinenChecked,
  kunnatInLupa,
  lupakohde,
  maakunnatInLupa,
  lisattavatKunnat,
  lisattavatMaakunnat,
  valittavissaOlevatKunnat,
  valittavissaOlevatMaakunnat,
  valtakunnallinenMaarays
) {
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
        /**
         * VALINTAKENTTÄ - MAAKUNNAT
         */
        {
          anchor: "valintakentta",
          isVisible:
            !isValtakunnallinenChecked &&
            !isEiMaariteltyaToimintaaluettaChecked,
          layout: { indentation: "none" },
          components: [
            {
              anchor: "maakunnat",
              name: "Autocomplete",
              styleClasses: ["ml-10 mt-4"],
              properties: {
                isMulti: false,
                options: valittavissaOlevatMaakunnat,
                placeholder: "Valitse maakunta...",
                value: []
              }
            }
          ]
        },
        /**
         * LUPAAN KUULUVAT MAAKUNNAT
         */
        {
          anchor: "lupaan-kuuluvat-maakunnat",
          isVisible:
            !isEiMaariteltyaToimintaaluettaChecked &&
            !isValtakunnallinenChecked &&
            !!maakunnatInLupa &&
            maakunnatInLupa.length > 0,
          layout: {
            indentation: "large",
            components: {
              justification: "start"
            }
          },
          components: map(maakunta => {
            return {
              anchor: maakunta.metadata.koodiarvo,
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2 sm:w-1/4"],
              properties: {
                isChecked: true,
                labelStyles: {
                  removal: isRemoved
                },
                forChangeObject: {
                  koodiarvo: maakunta.metadata.koodiarvo,
                  koodisto: { koodistoUri: maakunta.metadata.koodisto },
                  maaraysUuid: maakunta.metadata.kohde.uuid,
                  title: maakunta.title
                },
                title: maakunta.title
              }
            };
          }, maakunnatInLupa),
          title:
            maakunnatInLupa && maakunnatInLupa.length ? "Lupaan kuuluvat" : ""
        },
        /**
         * LUPAAN LISÄTTÄVÄT MAAKUNNAT
         */
        {
          anchor: "lupaan-lisattavat-maakunnat",
          isVisible:
            !isEiMaariteltyaToimintaaluettaChecked &&
            !isValtakunnallinenChecked &&
            !!lisattavatMaakunnat &&
            lisattavatMaakunnat.length > 0,
          layout: {
            indentation: "large",
            components: {
              justification: "start"
            }
          },
          components: map(maakunta => {
            return {
              anchor: maakunta.metadata.koodiarvo,
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2 sm:w-1/4"],
              properties: {
                isChecked: true,
                labelStyles: {
                  addition: isAdded,
                  custom: isAdded,
                  removal: isRemoved
                },
                title: maakunta.title
              }
            };
          }, lisattavatMaakunnat),
          title: "Lupaan lisättävät"
        },
        /**
         * VALINTAKENTTÄ - KUNNAT
         */
        {
          anchor: "valintakentta",
          isVisible:
            !isValtakunnallinenChecked &&
            !isEiMaariteltyaToimintaaluettaChecked,
          layout: { indentation: "none" },
          components: [
            {
              anchor: "kunnat",
              name: "Autocomplete",
              styleClasses: ["ml-10 mt-4"],
              properties: {
                isMulti: false,
                options: valittavissaOlevatKunnat,
                placeholder: "Valitse kunta...",
                value: []
              }
            }
          ]
        },
        /**
         * LUPAAN KUULUVAT KUNNAT
         */
        {
          anchor: "lupaan-kuuluvat-kunnat",
          isVisible:
            !isEiMaariteltyaToimintaaluettaChecked &&
            !isValtakunnallinenChecked &&
            !!kunnatInLupa &&
            kunnatInLupa.length,
          layout: {
            indentation: "large",
            components: {
              justification: "start"
            }
          },
          components: map(kunta => {
            return {
              anchor: kunta.metadata.koodiarvo,
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2 sm:w-1/4"],
              properties: {
                isChecked: true,
                labelStyles: {
                  removal: isRemoved
                },
                forChangeObject: {
                  koodiarvo: kunta.metadata.koodiarvo,
                  koodisto: { koodistoUri: kunta.metadata.koodisto },
                  maaraysUuid: kunta.maaraysUuid,
                  title: kunta.title
                },
                title: kunta.title
              }
            };
          }, kunnatInLupa),
          title: kunnatInLupa && kunnatInLupa.length ? "Lupaan kuuluvat" : ""
        },
        /**
         * LUPAAN LISÄTTÄVÄT KUNNAT
         */
        {
          anchor: "lupaan-lisattavat-kunnat",
          isVisible:
            !isEiMaariteltyaToimintaaluettaChecked &&
            !isValtakunnallinenChecked &&
            !!lisattavatKunnat &&
            lisattavatKunnat.length > 0,
          layout: {
            indentation: "large",
            components: {
              justification: "start"
            }
          },
          components: map(kunta => {
            return {
              anchor: kunta.metadata.koodiarvo,
              name: "CheckboxWithLabel",
              styleClasses: ["w-1/2 sm:w-1/4"],
              properties: {
                isChecked: true,
                labelStyles: {
                  addition: isAdded,
                  custom: isAdded,
                  removal: isRemoved
                },
                title: kunta.title
              }
            };
          }, lisattavatKunnat),
          title: "Lupaan lisättävät"
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
              custom:
                lupakohde.valtakunnallinen &&
                lupakohde.valtakunnallinen.arvo === "FI1"
                  ? isInLupa
                  : {},
              removal: isRemoved
            },
            forChangeObject: {
              maaraysUuid: valtakunnallinenMaarays ? valtakunnallinenMaarays.uuid: null,
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
        data.kunnatInLupa,
        data.lupakohde,
        data.maakunnatInLupa,
        data.lisattavatKunnat,
        data.lisattavatMaakunnat,
        data.valittavissaOlevatKunnat,
        data.valittavissaOlevatMaakunnat,
        data.valtakunnallinenMaarays
      );
    default:
      return [];
  }
}
