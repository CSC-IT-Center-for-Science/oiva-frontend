import { __ } from "i18n-for-browser";

export default function maaraaika(
  changeObjects,
  otherChangeObjects = [],
  tarkentimetChangeObjects = [],
  locale
) {
  return {
    anchor: "maaraaika",
    components: [
      {
        anchor: "alkamispaiva",
        name: "Datepicker",
        properties: {
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
        anchor: "paattymispaiva",
        name: "Datepicker",
        properties: {
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
  };
}
