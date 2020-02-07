function getLiitteetForm() {
  return [
    {
      anchor: "hakemuksenliitteet",
      components: [
        {
          name: "StatusTextRow",
          styleClasses: ["w-full"],
          properties: {
            title:
              "Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet."
          }
        },
        {
          anchor: "A",
          styleClasses: ["w-full"],
          name: "Attachments"
        }
      ]
    }
  ];
}

export default function getYhteenvetoLiitteetLomake(action) {
  switch (action) {
    case "modification":
      return getLiitteetForm();
    default:
      return [];
  }
}
