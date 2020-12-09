const messages = {
  addAttachment: "Lisää liite",
  attachmentDownload: "Lataa koneellesi",
  attachmentError: "Virhe liitteen käsiteltyssä",
  attachmentErrorName: "Virhe",
  attachmentName: "Liitteen nimi",
  attachmentNone: "Ei liitteitä",
  attachmentRemove: "Poista",
  attachmentSecretSelect: "Aseta salaiseksi",
  attachmentSecretUnselect: "Aseta julkiseksi",
  attachmentSecret: "Liite on salainen",
  cancel: "Peruuta",
  ok: "OK"
};

export const attachmentsStory = {
  changes: [],
  categories: [
    {
      anchor: "A",
      code: "1",
      title: "Category",
      components: [
        {
          anchor: "A",
          name: "Attachments",
          messages,
          properties: {
            code: "A.A",
            name: "example-attachment-1",
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
              messages,
              anchor: "A",
              name: "Attachments"
            }
          ]
        }
      ]
    }
  ]
};
