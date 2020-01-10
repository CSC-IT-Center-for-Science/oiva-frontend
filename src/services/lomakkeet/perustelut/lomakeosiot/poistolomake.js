export default function getDefaultRemovalForm(prefix) {
  return [
    {
      anchor: prefix ? `${prefix}-removal` : "removal",
      components: [
        {
          anchor: "textbox",
          name: "TextBox",
          properties: {
            placeholder: "Syitä voi olla monia. Sana on vapaa...",
            title: "Perustelut poistolle"
          }
        }
      ]
    }
  ];
}
