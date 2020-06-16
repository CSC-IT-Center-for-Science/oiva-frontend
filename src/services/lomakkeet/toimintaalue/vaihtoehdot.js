export default function getToimintaalueenVaihtoehdotForm() {
  return [
    {
      anchor: "A",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            isChecked: true
          }
        }
      ]
    }
  ];
}
