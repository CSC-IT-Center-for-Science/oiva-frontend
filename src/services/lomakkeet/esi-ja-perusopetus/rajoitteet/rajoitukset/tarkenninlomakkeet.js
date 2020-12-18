import { __ } from "i18n-for-browser";

/**
Näitä funktioita tarvitaan rajoitedialogilla näyttämään käyttäjälle
yksittäisen asetuksen (rajoitekriteerin), tarkenninkentän/-kentät.
On olennaista, että palautettavilla lomakerakenteilla on sama ankkuri,
koska siihen luotetaan, kun rajoitteen rakennetta käydään läpi.
 */
export const getLukumaaralomake = () => {
  return [
    {
      anchor: "tarkennin",
      layout: { indentation: "none" },
      components: [
        {
          anchor: "lukumaara",
          name: "Input",
          styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
          properties: {
            placeholder: "Lukumäärä",
            value: ""
          }
        }
      ]
    }
  ];
};

export const getMaaraaikalomake = locale => {
  return [
    {
      anchor: "tarkennin",
      layout: { components: { justification: "start" }, indentation: "none" },
      components: [
        {
          anchor: "alkamispaiva",
          name: "Datepicker",
          styleClasses: ["mr-2"],
          properties: {
            forChangeObject: {
              section: "maaraaika"
            },
            label: "Alkamispäivä",
            value: "",
            onChanges: () => {},
            clearable: true,
            showTodayButton: false,
            localizations: {
              ok: __("common.ok"),
              clear: __("common.clear"),
              cancel: __("common.cancel"),
              today: __("common.today"),
              datemax: __("common.datemax"),
              datemin: __("common.datemin"),
              dateinvalid: __("common.dateinvalid")
            },
            locale
          }
        },
        {
          anchor: "valiviiva",
          name: "StatusTextRow",
          properties: {
            title: "-"
          }
        },
        {
          anchor: "paattymispaiva",
          name: "Datepicker",
          styleClasses: ["ml-2"],
          properties: {
            forChangeObject: {
              section: "maaraaika"
            },
            label: "Päättymispäivä",
            value: "",
            onChanges: () => {},
            clearable: true,
            showTodayButton: false,
            localizations: {
              ok: __("common.ok"),
              clear: __("common.clear"),
              cancel: __("common.cancel"),
              today: __("common.today"),
              datemax: __("common.datemax"),
              datemin: __("common.datemin"),
              dateinvalid: __("common.dateinvalid")
            },
            locale
          }
        }
      ]
    }
  ];
};
