import "../i18n-config";
import { __ } from "i18n-for-browser";

/**
 * There are three fields in the beginning of the Esittelija's
 * muutoshakemus: asianumero, päätöspäivä and voimaantulopäivä.
 * This function will return them as a one form.
 */
export default function getTopThree(data, isReadOnly, locale) {
  return [
    {
      anchor: "asianumero",
      components: [
        {
          anchor: "A",
          name: "Input",
          properties: {
            label: __("asianumero"),
            width: "100%"
          }
        }
      ]
    },
    {
      anchor: "paatospaiva",
      components: [
        {
          anchor: "paatospaiva",
          name: "Datepicker",
          styleClasses: [""],
          properties: {
            fullWidth: true,
            label: __("paatospaiva"),
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
            value: ""
          }
        }
      ]
    },
    {
      anchor: "voimaantulopaiva",
      components: [
        {
          anchor: "paatospaiva",
          name: "Datepicker",
          styleClasses: [""],
          properties: {
            fullWidth: true,
            label: __("voimaantulopaiva"),
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
            value: ""
          }
        }
      ]
    }
  ];
}
