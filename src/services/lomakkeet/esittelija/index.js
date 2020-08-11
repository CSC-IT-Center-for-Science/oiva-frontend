import "../i18n-config";
import { __ } from "i18n-for-browser";
import ProcedureHandler from "components/02-organisms/procedureHandler";
import { find, propEq, path } from "ramda";

const isAsianumeroValid = async (value, uuid, formatMessage) => {
  const isValueInValidFormat = /^VN\/[0-9]{1,9}\/[0-9]{4}$/.test(value);
  /**
   * Jos kentän arvo on muodoltaan oikeanlainen, tarkistetaan
   * onko kyseinen asianumero jo käytössä.
   */
  if (isValueInValidFormat) {
    const procedureHandler = new ProcedureHandler(formatMessage);
    const outputs = await procedureHandler.run(
      "muutospyynto.muutokset.tarkistaDuplikaattiAsianumero",
      [uuid, value]
    );
    const isAsianumeroAlreadyInUse =
      outputs.muutospyynto.muutokset.tarkistaDuplikaattiAsianumero.output
        .result;
    /**
     * Mikäli asianumero ei ole käytössä, on kenttä arvoltaan
     * validi sen sisällön ollessa oikeassa muodossa.
     */
    return !isAsianumeroAlreadyInUse;
  } else {
    return false;
  }
};

/**
 * There are three fields in the beginning of the Esittelija's
 * muutoshakemus: asianumero, päätöspäivä and voimaantulopäivä.
 * This function will return them as a one form.
 */
export default async function getTopThree(
  data,
  isReadOnly,
  locale,
  changeObjects
) {
  const defaultAsianumero = "VN/";
  const changeObjAsianumero = find(
    propEq("anchor", "topthree.asianumero.A"),
    changeObjects
  );
  const asianumero =
    path(["properties", "value"], changeObjAsianumero) || defaultAsianumero;

  return [
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
            isValid: await isAsianumeroValid(
              asianumero,
              data.uuid,
              data.formatMessage
            ),
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
    }
  ];
}
