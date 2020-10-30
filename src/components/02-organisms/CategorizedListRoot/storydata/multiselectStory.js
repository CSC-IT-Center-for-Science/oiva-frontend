import { isInLupa, isAdded, isRemoved } from "../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

export const multiselectStory = {
  changes: [],
  categories: [
    {
      anchor: "A",
      code: "1",
      title: "Category",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "A.A",
            isChecked: false,
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            name: "example-checkbox-1",
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
              name: "Multiselect",
              properties: {
                value: [{ label: "Aaaaaaaa", value: "Aaaaaaaa", group: "1" }],
                options: [
                  { label: "Aaaaaaaa", value: "Aaaaaaaa", group: "1" },
                  { label: "Bbbbbb", value: "Bbbbbb", group: "2" },
                  { label: "Ccccccccccc", value: "Ccccccccccc", group: "2" }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
