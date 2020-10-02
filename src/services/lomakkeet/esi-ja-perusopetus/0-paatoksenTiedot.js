import "../i18n-config";
import { __ } from "i18n-for-browser";
import { find, propEq, path } from "ramda";

const isAsianumeroValid = async (value, uuid, formatMessage) => {
  // validointi väliaikaisesti poistettu käytöstä
  return true;

};

/**
 * There are three fields in the beginning of the Esittelija's
 * muutoshakemus: asianumero, päätöspäivä and voimaantulopäivä.
 * This function will return them as a one form.
 */
export default async function getPaatoksenTiedot(
  data,
  isReadOnly,
  locale,
  changeObjects
) {
  const defaultAsianumero = "VN/";
  const changeObjAsianumero = find(
    propEq("anchor", "paatoksentiedot.asianumero.A"),
    changeObjects
  );
  const asianumero =
    path(["properties", "value"], changeObjAsianumero) || defaultAsianumero;

  const validAsianumero = await isAsianumeroValid(
    asianumero,
    data.uuid,
    data.formatMessage);

  return {
    isValid: validAsianumero,
    structure: [
      {
        anchor: "asianumero",
        components: [
          {
            anchor: "A",
            name: "Input",
            styleClasses: ["w-full"],
            properties: {
              isReadOnly,
              isRequired: true,
              isValid: validAsianumero,
              label: __("asianumero"),
              type: "text",
              value: defaultAsianumero,
              forChangeObject: {
                uuid: data.uuid
              }
            }
          }
        ]
      },
      {
        anchor: "paatospaiva",
        components: [
          {
            anchor: "A",
            name: "Datepicker",
            styleClasses: [""],
            properties: {
              fullWidth: true,
              label: __("paatospaiva"),
              placeholder: __("common.date"),
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
            anchor: "A",
            name: "Datepicker",
            styleClasses: [""],
            properties: {
              fullWidth: true,
              label: __("voimaantulopaiva"),
              placeholder: __("common.date"),
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
          anchor: "paattymispaivamaara",
          components: [
            {
              anchor: "A",
              name: "Datepicker",
              styleClasses: [""],
              properties: {
                  fullWidth: true,
                  label: __("common.paattymispaivamaara"),
                  placeholder: __("common.paattymispaivamaara"),
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
    ]
  };
}
