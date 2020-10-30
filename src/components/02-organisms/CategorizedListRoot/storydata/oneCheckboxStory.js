import { isInLupa, isAdded, isRemoved } from "../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

export const oneCheckboxStory = {
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
      ]
    }
  ]
};
