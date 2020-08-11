import "../i18n-config";
import { __ } from "i18n-for-browser";
import { getMessages } from "../utils";

function getYleisetTiedotForm(isReadOnly) {
  return [
    {
      anchor: "edellytykset-tekstikentta",
      styleClasses: ["mb-6"],
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly: isReadOnly,
            isRequired: true,
            placeholder: "",
            title: "Taloudelliset edellytykset",
            tooltip: {
              text: __("taloudelliset.yleisettiedot.kentta1.tooltip")
            },
            value: ""
          }
        }
      ]
    },
    {
      anchor: "vaikutukset-tekstikentta",
      styleClasses: ["mb-6"],
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly: isReadOnly,
            isRequired: true,
            placeholder: "",
            title: "Vaikutukset taloudellisten resurssien kohdentamiseen",
            tooltip: {
              text: __("taloudelliset.yleisettiedot.kentta2.tooltip")
            },
            value: ""
          }
        }
      ]
    },
    {
      anchor: "sopeuttaminen-tekstikentta",
      styleClasses: [""],
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly: isReadOnly,
            isRequired: true,
            placeholder: "",
            title: "Toiminnan ja talouden sopeuttaminen",
            tooltip: {
              text: __("taloudelliset.yleisettiedot.kentta3.tooltip")
            },
            value: ""
          }
        }
      ]
    }
  ];
}

export function getInvestoinnitForm(isReadOnly) {
  return [
    {
      anchor: "investoinnit-tekstikentta",
      styleClasses: ["font-normal"],
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly: isReadOnly,
            isRequired: true,
            placeholder: "",
            tooltip: {
              text: __("taloudelliset.tooltipTaloudellisetInvestoinnitKentta1")
            },
            value: "",
            title: "Tarvittavat investoinnit"
          }
        }
      ]
    },
    {
      anchor: "kustannukset-Input",
      styleClasses: ["flex"],
      components: [
        {
          anchor: "A",
          name: "Input",
          styleClasses: ["w-full sm:w-1/2 md:w-1/3"],
          properties: {
            isReadOnly: isReadOnly,
            isRequired: true,
            fullWidth: true,
            type: "number",
            tooltip: {
              text: __("taloudelliset.tooltipTaloudellisetInvestoinnitKentta2")
            },
            value: "",
            label: "Investoinnin kustannukset"
          }
        }
      ]
    },
    {
      anchor: "rahoitus-tekstikentta",
      styleClasses: ["flex sm:row"],
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly: isReadOnly,
            isRequired: true,
            placeholder: "",
            tooltip: {
              text: __("taloudelliset.tooltipTaloudellisetInvestoinnitKentta3")
            },
            value: "",
            title: "Investointien rahoitus"
          }
        }
      ]
    }
  ];
}

function getTilinpaatostiedotForm(isReadOnly) {
  return [
    {
      anchor: "tilinpaatostiedot",
      styleClasses: ["mb-2"],
      components: [
        {
          anchor: "omavaraisuusaste",
          name: "Input",
          styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
          properties: {
            fullWidth: true,
            isReadOnly: isReadOnly,
            isRequired: true,
            label: __("taloudelliset.omavaraisuusaste"),
            type: "number",
            value: ""
          }
        },
        {
          anchor: "maksuvalmius",
          name: "Input",
          styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
          properties: {
            fullWidth: true,
            isReadOnly: isReadOnly,
            isRequired: true,
            label: __("taloudelliset.maksuvalmius"),
            type: "number",
            value: ""
          }
        },
        {
          anchor: "velkaantuneisuus",
          name: "Input",
          styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
          properties: {
            fullWidth: true,
            isReadOnly: isReadOnly,
            isRequired: true,
            label: __("taloudelliset.velkaantuneisuus"),
            type: "number",
            value: ""
          }
        },
        {
          anchor: "kannattavuus",
          name: "Input",
          styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
          properties: {
            fullWidth: true,
            isReadOnly: isReadOnly,
            isRequired: true,
            label: __("taloudelliset.kannattavuus"),
            type: "number",
            value: ""
          }
        },
        {
          anchor: "jaama",
          name: "Input",
          styleClasses: ["px-2 w-full sm:w-1/2 md:w-2/3"],
          properties: {
            fullWidth: true,
            isReadOnly: isReadOnly,
            isRequired: true,
            label: __("taloudelliset.kumulatiivinen"),
            type: "number",
            value: ""
          }
        }
      ]
    }
  ];
}

function getLiitteetForm(isReadOnly) {
  return [
    {
      anchor: "liitteet",
      components: [
        {
          name: "StatusTextRow",
          styleClasses: ["w-full"],
          properties: {
            title:
              "Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet.",
            isHidden: isReadOnly
          }
        },
        {
          anchor: "A",
          styleClasses: ["w-full"],
          name: "Attachments",
          messages: getMessages("attachments")
        }
      ]
    }
  ];
}

export function getTaloudellisetlomake(action, data, isReadOnly) {
  switch (action) {
    case "yleisettiedot":
      return getYleisetTiedotForm(isReadOnly);
    case "investoinnit":
      return getInvestoinnitForm(isReadOnly);
    case "tilinpaatostiedot":
      return getTilinpaatostiedotForm(isReadOnly);
    case "liitteet":
      return getLiitteetForm(isReadOnly);
    default:
      return [];
  }
}
