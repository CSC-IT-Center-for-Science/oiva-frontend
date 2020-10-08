import { __ } from "i18n-for-browser";

export function rajoitteet(data) {
  return [
    {
      anchor: "ohjeteksti",
      components: [
        {
          anchor: "rajoiteosio",
          name: "StatusTextRow",
          properties: {
            title:
              "Lupaan kohdistuvia rajoitteita voit tehdä lomakkeella tekemiesi valintojen perusteella."
          }
        }
      ]
    },
    {
      anchor: "rajoitteenLisaaminen",
      components: [
        {
          anchor: "painike",
          name: "SimpleButton",
          onClick: data.onAddRestriction,
          properties: {
            text: "Lisää rajoite"
          }
        }
      ]
    }
  ];
}
