import { isInLupa, isAdded, isRemoved } from "../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

export const textBoxStory = {
  changes: [
    {
      anchor: "textbox.0",
      path: [0, "components", 0],
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "textbox.1",
      path: [1, "components", 0],
      properties: {
        isChecked: true,
        title: "Koulutukseen panostettu on (muutos)"
      }
    },
    {
      anchor: "textbox.0.1",
      path: [0, "categories", 1, "components", 0],
      properties: {
        isChecked: true,
        title: "Osaamisala (muutos)"
      }
    },
    {
      anchor: "textbox.0.2",
      path: [0, "categories", 2, "components", 0],
      properties: { value: "Muutettu" }
    }
  ],
  categories: [
    {
      anchor: "0",
      code: "0",
      title: "Categories",
      components: [
        {
          name: "CheckboxWithLabel",
          properties: {
            name: "example-checkbox-1",
            code: 1,
            title: "Row item",
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            isChecked: false
          }
        },
        {
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
          anchor: "0",
          code: "0",
          title: "Categories",
          components: [
            {
              name: "RadioButtonWithLabel",
              properties: {
                name: "example-radio",
                code: 1.1,
                title: "Sub row",
                isChecked: false,
                labelStyles,
                value: "Testi"
              }
            }
          ],
          categories: [
            {
              anchor: "0",
              code: "0",
              title: "Categories",
              components: [
                {
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox-1.1.1",
                    code: "1.1.1",
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
              anchor: "1",
              code: "1",
              title: "Categories",
              components: [
                {
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox-1.1.2",
                    code: "1.1.2",
                    title: "Leaf node item",
                    labelStyles,
                    isChecked: false
                  }
                },
                {
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
          anchor: "1",
          code: "1",
          title: "Categories",
          components: [
            {
              name: "RadioButtonWithLabel",
              properties: {
                name: "example-radio",
                code: "1.2",
                title: "Sub row",
                isChecked: false,
                labelStyles,
                value: "Testi2"
              }
            }
          ],
          categories: [
            {
              anchor: "0",
              code: "0",
              title: "Categories",
              components: [
                {
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox-1.2.1",
                    code: "1.2.1",
                    title: "Leaf node item",
                    labelStyles,
                    isChecked: false
                  }
                },
                {
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
              anchor: "1",
              code: "1",
              title: "Categories",
              components: [
                {
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
          anchor: "2",
          code: "2",
          title: "Categories",
          components: [
            {
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
      anchor: "1",
      code: "1",
      title: "Categories",
      components: [
        {
          name: "CheckboxWithLabel",
          properties: {
            name: "example-checkbox-2",
            code: 2,
            title: "Row item",
            labelStyles,
            isChecked: false
          }
        }
      ]
    },
    {
      anchor: "2",
      code: "2",
      title: "Categories",
      components: [
        {
          name: "CheckboxWithLabel",
          properties: {
            name: "example-checkbox-3",
            code: 3,
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
