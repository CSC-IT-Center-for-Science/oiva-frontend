import { isInLupa, isAdded, isRemoved } from "../../../../css/label";
import * as R from "ramda";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

export const longAndPlainStory = {
  changes: [],
  categories: [
    {
      anchor: "A",
      code: "0",
      title: "Categories",
      categories: R.addIndex(R.map)((item, index) => {
        return {
          anchor: index,
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                name: `example-radio-${index}`,
                code: `A.${index}.A`,
                title: "Row item",
                labelStyles: Object.assign({}, labelStyles, {
                  custom: isInLupa
                }),
                isChecked: false
              }
            }
          ]
        };
      }, new Array(20))
    },
    {
      anchor: "B",
      code: "1",
      title: "Categories",
      categories: R.addIndex(R.map)((item, index) => {
        return {
          anchor: index,
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                name: `example-radio-${index}`,
                code: `B.${index}.A`,
                title: "Row item",
                labelStyles: Object.assign({}, labelStyles, {
                  custom: isInLupa
                }),
                isChecked: false
              }
            }
          ]
        };
      }, new Array(20))
    },
    {
      anchor: "C",
      code: "2",
      title: "Categories",
      categories: R.addIndex(R.map)((item, index) => {
        return {
          anchor: index,
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                name: `example-radio-${index}`,
                code: `C.${index}.A`,
                title: "Row item",
                labelStyles: Object.assign({}, labelStyles, {
                  custom: isInLupa
                }),
                isChecked: false
              }
            }
          ]
        };
      }, new Array(20))
    }
  ]
};
