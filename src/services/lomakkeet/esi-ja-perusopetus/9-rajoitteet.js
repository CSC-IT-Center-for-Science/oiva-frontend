import { __ } from "i18n-for-browser";
import { find, flatten, mapObjIndexed, propEq, values } from "ramda";

const localizations = {
  opetustaAntavatKunnat: "2. Kunnat, joissa opetusta järjestetään",
  maaraaika: "Määräaika"
};

const sections = {
  opetustaAntavatKunnat: () => {
    return {
      anchor: "kuntavalinta",
      components: [
        {
          name: "Autocomplete",
          properties: {}
        }
      ]
    };
  },
  maaraaika: locale => {
    return {
      anchor: "aikavali",
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
};

export function rajoitelomake(data, isReadOnly, locale, changeObjects) {
  let kohteenTarkennin = {};
  const changeObj = find(
    propEq("anchor", "rajoitteet.kohteenValinta.valintaelementti"),
    changeObjects
  );

  if (changeObj) {
    kohteenTarkennin = sections[changeObj.properties.value.value]();
  }
  console.info(kohteenTarkennin);
  return flatten([
    {
      anchor: "kohteenValinta",
      components: [
        {
          anchor: "valintaelementti",
          name: "Autocomplete",
          properties: {
            isMulti: false,
            options: values(
              mapObjIndexed((categoryFn, key) => {
                return { label: localizations[key], value: key };
              }, sections)
            )
          }
        }
      ]
    },
    kohteenTarkennin
  ]);
}

/**
 *
 * 2. Kunnat, joissa opetusta annetaan -> Lista kunnista pudotusvalikossa
 * 6. Oppilas- ja opiskelijamäärät -> Enintään/Vähintään n kpl
 * x. Määräaika -> Alkamispäivä ja päättymispäivä
 */
