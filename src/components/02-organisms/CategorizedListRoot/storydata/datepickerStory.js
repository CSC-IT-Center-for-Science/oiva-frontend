const localizations = {
  ok: "Ok",
  clear: "Tyhjennä",
  cancel: "Peruuta",
  today: "Tänään",
  datemax: "Päiväys on liian suuri",
  datemin: "Päiväys on liian pieni",
  dateinvalid: "Päiväys on virheellinen"
};

export const datepickerStory = {
  changes: [],
  categories: [
    {
      anchor: "A",
      code: "1",
      title: "Category",
      components: [
        {
          anchor: "A",
          name: "Datepicker",
          properties: {
            localizations,
            code: "A.A",
            name: "example-datepicker-1",
            title: "Row item"
          }
        }
      ],
      categories: [
        {
          anchor: "A",
          code: "1",
          title: "Category",
          components: [
            {
              anchor: "A",
              name: "Datepicker",
              properties: {
                localizations,
                code: "A.A.A",
                name: "example-datepicker-1-1",
                title: "Row item"
              }
            }
          ]
        }
      ]
    }
  ]
};
