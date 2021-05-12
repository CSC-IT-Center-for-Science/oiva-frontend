import "../i18n-config";
import { __ } from "i18n-for-browser";
import { find, propEq, path, isEmpty } from "ramda";

/**
 * Tarkistaa annetun ankkurin perusteella kentän nykytilan. Paluuarvo kertoo,
 * onko kenttä tyhjä.
 * @param {string} anchor
 * @param {string} defaultValue
 * @param {array} changeObjects
 */
const isFieldEmpty = (anchor, defaultValue, changeObjects) => {
  const changeObj = find(propEq("anchor", anchor), changeObjects);
  const currentValue = path(["properties", "value"], changeObj) || defaultValue;
  return isEmpty(currentValue);
};

/**
 * There are three fields in the beginning of the Esittelija's
 * muutoshakemus: asianumero, päätöspäivä and voimaantulopäivä.
 * This function will return them as a one form.
 */
export default async function getPaatoksenTiedot(
  data,
  { isReadOnly },
  locale,
  changeObjects
) {
  const defaultAsianumero = "";
  const defaultDiaarinumero = "";

  const isAsianumeroFieldEmpty = await isFieldEmpty(
    "paatoksentiedot.asianumero.A",
    defaultAsianumero,
    changeObjects
  );

  const isDiaarinumeroFieldEmpty = await isFieldEmpty(
    "paatoksentiedot.diaarinumero.A",
    defaultAsianumero,
    changeObjects
  );

  const isValid =
    (!isAsianumeroFieldEmpty || !isDiaarinumeroFieldEmpty) &&
    !(!isAsianumeroFieldEmpty && !isDiaarinumeroFieldEmpty);

  return {
    /**
     * Diaarinumerokentän lisäämisen myötä lomakkeen validiusehtoa
     * päivitettiin siten, että joko asianumero tai diaarinumero
     * tulee olla annettu, jotta lomake olisi validi. Jos molemmat
     * on annettu, ei lomake ole validi.
     *
     * Diaarinumerokenttä lähtenee myöhemmin pois, kunhan vanhat
     * luvat on saatu syötettyä, jolloin tätä validiusehtoa tulee
     * päivittää.
     */
    isValid,
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
              isRequired: isDiaarinumeroFieldEmpty,
              isValid,
              label: __("common.asianumero"),
              type: "text",
              value: defaultAsianumero
            }
          }
        ]
      },
      {
        anchor: "diaarinumero",
        components: [
          {
            anchor: "A",
            name: "Input",
            styleClasses: ["w-full"],
            properties: {
              isReadOnly,
              isRequired: isAsianumeroFieldEmpty,
              isValid,
              label: __("common.diaarinumero"),
              type: "text",
              value: defaultDiaarinumero
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
              label: __("common.paatospaiva"),
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
              label: __("common.voimaantulopaiva"),
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
