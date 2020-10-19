import {
  map,
  toUpper,
  find,
  pathEq,
  not,
  includes,
  prop,
  path,
  filter,
  uniq,
  concat
} from "ramda";
import { __ } from "i18n-for-browser";

export function getOpetuskieletOPHLomake(
  data,
  isReadOnly,
  locale,
  changeObjects
) {
  // TODO: Huomioidaan myöhemmin myös lupaan kuuluvat kielet
  const valitutEnsisijaisetKoodiarvot = map(
    prop("value"),
    path([0, "properties", "value"], changeObjects) || []
  );

  const valitutToissijaisetKoodiarvot = map(
    prop("value"),
    path([1, "properties", "value"], changeObjects) || []
  );

  const valitutKoodiarvot = uniq(
    concat(valitutEnsisijaisetKoodiarvot, valitutToissijaisetKoodiarvot)
  );

  const valittavanaOlevatEnsisisijaisetOpetuskielet = filter(
    kieli => not(includes(kieli.koodiarvo, valitutKoodiarvot)),
    data.ensisijaisetOpetuskieletOPH
  );

  const valittavanaOlevatToissisijaisetOpetuskielet = filter(
    kieli => not(includes(kieli.koodiarvo, valitutKoodiarvot)),
    data.toissijaisetOpetuskieletOPH
  );

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    data.lisatiedot || []
  );

  const localeUpper = toUpper(locale);
  return [
    {
      anchor: "opetuskieli",
      title: "Opetuskieli",
      components: [
        {
          anchor: "ensisijaiset",
          name: "Autocomplete",
          short: true,
          properties: {
            options: map(kieli => {
              return {
                label: kieli.metadata[localeUpper].nimi,
                value: kieli.koodiarvo
              };
            }, valittavanaOlevatEnsisisijaisetOpetuskielet),
            title: __("common.valitseYksiTaiUseampi")
          }
        }
      ]
    },
    {
      anchor: "opetuskieli",
      title: "Opetusta voidaan antaa myös seuraavilla kielillä",
      components: [
        {
          anchor: "toissijaiset",
          name: "Autocomplete",
          short: true,
          properties: {
            options: map(kieli => {
              return {
                label: kieli.metadata[localeUpper].nimi,
                value: kieli.koodiarvo
              };
            }, valittavanaOlevatToissisijaisetOpetuskielet),
            title: __("common.valitseYksiTaiUseampi")
          }
        }
      ]
    },
    {
      anchor: "opetuskieli",
      layout: { margins: { top: "large" } },
      components: [
        {
          anchor: "lisatiedot-info",
          name: "StatusTextRow",
          styleClasses: ["pt-8 border-t"],
          properties: {
            title: __("common.lisatiedotInfo")
          }
        }
      ]
    },
    {
      anchor: "lisatiedot",
      components: [
        {
          anchor: lisatiedotObj.koodiarvo,
          name: "TextBox",
          properties: {
            forChangeObject: {
              koodiarvo: lisatiedotObj.koodiarvo,
              koodisto: lisatiedotObj.koodisto,
              versio: lisatiedotObj.versio,
              voimassaAlkuPvm: lisatiedotObj.voimassaAlkuPvm
            },
            placeholder: __("common.lisatiedot")
          }
        }
      ]
    }
  ];
}
