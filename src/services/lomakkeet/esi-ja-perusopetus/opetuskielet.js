import { map, toUpper } from "ramda";

export function opetuskielet(data, isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  return [
    {
      anchor: "opetuskieli",
      title: "Opetuskieli",
      components: [
        {
          anchor: "ensisijaiset",
          name: "Autocomplete",
          properties: {
            options: map(kieli => {
              return {
                label: kieli.metadata[localeUpper].nimi,
                value: kieli.koodiarvo
              };
            }, data.kieletOPH),
            callback: (payload, values) => {
              console.log(values.value[0]);
            },
            title: "Valitse yksi tai useampi"
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
          styleClasses: ["pb-8 border-b"],
          properties: {
            options: map(kieli => {
              return {
                label: kieli.metadata[localeUpper].nimi,
                value: kieli.koodiarvo
              };
            }, data.kieletOPH),
            callback: (payload, values) => {
              console.log(values.value[0]);
            },
            title: "Valitse yksi tai useampi"
          }
        }
      ]
    },
    {
      anchor: "opetuskieli",
      components: [
        {
          anchor: "lisatiedot",
          name: "TextBox",
          properties: {
            placeholder: "Lisätiedot",
            title:
              "Voit kirjoittaa tähän osioon liittyviä lisätietoja alla olevaan kenttään."
          }
        }
      ]
    }
  ];
}
