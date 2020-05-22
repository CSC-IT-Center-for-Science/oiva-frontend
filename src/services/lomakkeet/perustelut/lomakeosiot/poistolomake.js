export default function getDefaultRemovalForm(isReadOnly, prefix) {
  return [
    {
      anchor: prefix ? `${prefix}-removal` : "removal",
      components: [
        {
          anchor: "textbox",
          name: "TextBox",
          properties: {
            isReadOnly,
            placeholder: "Syitä voi olla monia. Sana on vapaa...",
            title: "Perustelut poistolle",
            value: ""
          }
        }
      ]
    }
  ];
}
