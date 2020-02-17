import "../../i18n-config";
import { __ } from "i18n-for-browser";

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
          styleClasses: ["w-full sm:pr-2 sm:w-1/2 md:w-1/4"],
          properties: {
            fullWidth: true,
            label: __("common.date"),
            placeholder: __("common.date"),
            disablePast: true,
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
            title: "Pvm",
            value: ""
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
          value: ""
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
