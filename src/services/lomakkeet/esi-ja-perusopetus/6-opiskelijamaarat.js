export function opiskelijamaarat() {
  return [
    {
      anchor: "kenttaotsikko",
      components: [
        {
          anchor: "A",
          name: "StatusTextRow",
          properties: {
            title: "Opetuksen järjestäjän oppilas-/opiskelijamäärä"
          }
        }
      ]
    },
    {
      anchor: "kentat",
      layout: { components: { justification: "start" } },
      components: [
        {
          anchor: "dropdown",
          styleClasses: "mb-0 mr-2 w-1/5",
          fullWidth:true,
          name: "Dropdown",
          properties: {
            options: [{ label: "common.vahintaan",value:"vähintään" },{ label: "common.enintaan",value:"enintään" }]
          }
        },
        {
          anchor: "input",
          name: "Input",
          properties: {
            placeholder: "Oppilasta/opiskelijaa",
            value: ""
          }
        }
      ]
    },
    {
      anchor: "ohjeteksti",
      layout: { margins: { top: "large" } },
      components: [
        {
          anchor: "lisatiedot",
          name: "StatusTextRow",
          styleClasses: ["pt-8 border-t"],
          properties: {
            title:
              "Voit kirjoittaa tähän osioon liittyviä lisätietoja alla olevaan kenttään. Lisätiedot näkyvät luvassa tämän osion valintojen yhteydessä."
          }
        }
      ]
    },
    {
      anchor: "lisatiedot",
      components: [
        {
          anchor: "textarea",
          name: "TextBox",
          properties: {
            placeholder: "Lisätiedot"
          }
        }
      ]
    }
  ];
}
