import { isInLupa, isAdded, isRemoved } from "../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

export const textBoxStory = {
  changes: [
    {
      anchor: "textbox.A.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "textbox.B.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "textbox.A.B.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "textbox.A.C.A",
      properties: { value: "Muutettu" }
    }
  ],
  categories: [
    {
      anchor: "A",
      code: "0",
      title: "Categories",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            name: "example-checkbox-1",
            code: "A.A",
            title: "Row item",
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            isChecked: false
          }
        },
        {
          anchor: "B",
          name: "Dropdown",
          properties: {
            options: [
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" }
            ]
          }
        }
      ],
      categories: [
        {
          anchor: "A",
          code: "0",
          title: "Categories",
          components: [
            {
              anchor: "A",
              name: "RadioButtonWithLabel",
              properties: {
                name: "example-radio",
                code: "A.A.A",
                title: "Sub row",
                isChecked: false,
                labelStyles,
                value: "Testi"
              }
            }
          ],
          categories: [
            {
              anchor: "A",
              code: "0",
              title: "Categories",
              components: [
                {
                  anchor: "A",
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox-1.1.1",
                    code: "A.A.A.A",
                    title: "Leaf node item",
                    labelStyles: Object.assign({}, labelStyles, {
                      custom: isInLupa
                    }),
                    isChecked: false
                  }
                }
              ]
            },
            {
              anchor: "B",
              code: "1",
              title: "Categories",
              components: [
                {
                  anchor: "A",
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox-1.1.2",
                    code: "A.A.B.A",
                    title: "Leaf node item",
                    labelStyles,
                    isChecked: false
                  }
                },
                {
                  anchor: "B",
                  name: "Dropdown",
                  properties: {
                    options: [
                      { value: "chocolate", label: "Chocolate" },
                      {
                        value: "strawberry",
                        label: "Strawberry"
                      },
                      { value: "vanilla", label: "Vanilla" }
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "B",
          code: "1",
          title: "Categories",
          components: [
            {
              anchor: "A",
              name: "RadioButtonWithLabel",
              properties: {
                name: "example-radio",
                code: "A.B.A",
                title: "Sub row",
                isChecked: false,
                labelStyles,
                value: "Testi2"
              }
            }
          ],
          categories: [
            {
              anchor: "A",
              code: "0",
              title: "Categories",
              components: [
                {
                  anchor: "A",
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox-1.2.1",
                    code: "A.B.A.A",
                    title: "Leaf node item",
                    labelStyles,
                    isChecked: false
                  }
                },
                {
                  anchor: "B",
                  name: "Dropdown",
                  properties: {
                    options: [
                      { value: "chocolate", label: "Chocolate" },
                      {
                        value: "strawberry",
                        label: "Strawberry"
                      },
                      { value: "vanilla", label: "Vanilla" }
                    ]
                  }
                }
              ]
            },
            {
              anchor: "B",
              code: "1",
              title: "Categories",
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    defaultValue:
                      "Text 1"
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "C",
          code: "2",
          title: "Categories",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                defaultValue:
                  "Text 2"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "B",
      code: "1",
      title: "Categories",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            name: "example-checkbox-2",
            code: "B.A",
            title: "Row item",
            labelStyles,
            isChecked: false
          }
        }
      ]
    },
    {
      anchor: "C",
      code: "2",
      title: "Categories",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            name: "example-checkbox-3",
            code: "C.A",
            title: "Row item",
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            isChecked: false
          }
        }
      ]
    }
  ]
};
