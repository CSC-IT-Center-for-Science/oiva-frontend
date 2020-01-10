import { isInLupa, isAdded, isRemoved } from "../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

const handleClickOfAddSubformButton = payload => {
  console.info(payload, subformStory.subForm, subformStory.categories);
};

export const subformStory = {
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
        },
        {
          anchor: `add-subform`,
          name: "SimpleButton",
          onClick: handleClickOfAddSubformButton,
          styleClasses: "flex justify-end",
          properties: {
            text: "Add subform"
          }
        }
      ]
    }
  ],
  subForm: [
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
        },
        {
          anchor: `add-subform`,
          name: "SimpleButton",
          onClick: handleClickOfAddSubformButton,
          styleClasses: "flex justify-end",
          properties: {
            text: "Add subform"
          }
        }
      ]
    }
  ]
};
