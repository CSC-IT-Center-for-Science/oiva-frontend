import { map, toUpper, take, takeLast, find, pathEq } from "ramda";
import {__} from "i18n-for-browser";

export function opetuskielet(data, isReadOnly, locale) {

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
            }, take(5, data.kieletOPH)),
            callback: (payload, values) => {
              console.log(values.value[0]);
            },
            title: __("common.valitseYksiTaiUseampi"),
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
            }, takeLast(4, data.kieletOPH)),
            callback: (payload, values) => {
              console.log(values.value[0]);
            },
            title: __("common.valitseYksiTaiUseampi"),
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
            title:
              __("common.lisatiedotInfo")
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
