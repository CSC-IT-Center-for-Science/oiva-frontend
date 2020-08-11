import "../../i18n-config";
import { __ } from "i18n-for-browser";
import { getMessages } from "../../utils";

function getModificationForm(locale) {
  return [
    {
      anchor: "yhteyshenkilo",
      title: "Yhteyshenkilön tiedot",
      styleClasses: ["pl-0"],
      components: [
        {
          anchor: "nimi",
          name: "Input",
          styleClasses: ["sm:pr-2 w-full sm:w-1/2 md:w-1/4"],
          properties: {
            fullWidth: true,
            label: "Nimi",
            isRequired: true,
            value: ""
          }
        },
        {
          anchor: "nimike",
          name: "Input",
          styleClasses: ["sm:pl-2 md:px-2 w-full sm:w-1/2 md:w-1/4"],
          properties: {
            fullWidth: true,
            label: "Nimike",
            isRequired: true,
            value: ""
          }
        },
        {
          anchor: "puhelinnumero",
          name: "Input",
          styleClasses: ["sm:pr-2 w-full sm:w-1/2 md:w-1/4"],
          properties: {
            fullWidth: true,
            label: "Puhelinnumero",
            isRequired: true,
            value: ""
          }
        },
        {
          anchor: "sahkoposti",
          name: "Input",
          styleClasses: ["sm:pl-2 w-full sm:w-1/2 md:w-1/4"],
          properties: {
            fullWidth: true,
            label: "Sähköposti",
            isRequired: true,
            value: ""
          }
        }
      ]
    },
    {
      anchor: "muutoksien-voimaantulo",
      title: "Muutoksien voimaantulo",
      styleClasses: ["mt-6 pl-0"],
      components: [
        {
          anchor: "ajankohta",
          name: "Datepicker",
          properties: {
            disablePast: true,
            fullWidth: false,
            isrequired: true,
            label: __("common.date"),
            locale: locale,
            localizations: {
              ok: __("common.ok"),
              clear: __("common.clear"),
              cancel: __("common.cancel"),
              today: __("common.today"),
              datemax: __("common.datemax"),
              datemin: __("common.datemin"),
              dateinvalid: __("common.dateinvalid")
            },
            placeholder: __("common.date"),
            value: "",
            width: "8rem"
          }
        }
      ]
    },
    {
      anchor: "saate",
      title: "Saate",
      styleClasses: ["mt-6 px-0"],
      components: [
        {
          styleClasses: ["mt-2 w-full"],
          anchor: "tekstikentta",
          name: "TextBox",
          properties: {
            isRequired: true,
            placeholder: "",
            title: "Pakollinen",
            value: ""
          }
        }
      ]
    },
    {
      anchor: "hyvaksyja",
      title: "Hakemuksen hyväksyjän / allekirjoittaja",
      styleClasses: ["mt-6 px-0"],
      components: [
        {
          styleClasses: ["w-full sm:pr-2 sm:w-1/2"],
          anchor: "nimi",
          name: "Input",
          properties: {
            fullWidth: true,
            isRequired: true,
            label: "Nimi",
            value: ""
          }
        },
        {
          styleClasses: ["w-full sm:pl-2 sm:w-1/2"],
          anchor: "nimike",
          name: "Input",
          properties: {
            fullWidth: true,
            isRequired: true,
            label: "Nimike",
            value: ""
          }
        }
      ]
    },
    {
      anchor: "liitteet",
      title: "Liitteet",
      styleClasses: ["mt-6 w-full"],
      components: [
        {
          name: "StatusTextRow",
          styleClasses: ["w-full"],
          properties: {
            title:
              "Liittäkää asiakirja tai asiakirjat, joista ilmenee hakemuksen hyväksyntä tai hyväksyjän päätösvalta (esim. hyväksyjän allekirjoitusoikeus ja päättävän elimen kokouksen pöytäkirjanote). Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet."
          }
        },
        {
          styleClasses: ["w-full"],
          anchor: "A",
          name: "Attachments",
          messages: getMessages("attachments"),
          properties: {
            isRequired: true,
            value: ""
          }
        }
      ]
    }
  ];
}

export default function getYhteenvetoYleisetTiedotLomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "modification":
      return getModificationForm(locale);
    default:
      return [];
  }
}
