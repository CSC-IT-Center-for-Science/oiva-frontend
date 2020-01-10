import { isInLupa, isAdded, isRemoved } from "../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

export const simpleStory = {
  changes: [
    {
      anchor: "simple.A.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "simple.C.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "simple.B.B.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "simple.A.A.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "simple.B.B.A.A",
      properties: {
        isChecked: true
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
          name: "CheckboxWithLabel",
          properties: {
            code: "A.A",
            isChecked: false,
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            name: "example-checkbox-1",
            title: "Tutkinto 1"
          }
        }
      ],
      categories: [
        {
          anchor: "A",
          code: "1.1",
          title: "Sub category",
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                code: "A.A.A",
                isChecked: false,
                labelStyles: Object.assign({}, labelStyles, {
                  custom: isInLupa
                }),
                name: "example-checkbox",
                title: "Osaamisala 1",
                value: "Testi"
              }
            }
          ]
        },
        {
          anchor: "B",
          code: "1.2",
          title: "Sub category",
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                code: "A.B.A",
                isChecked: false,
                labelStyles,
                name: "example-checkbox",
                title: "Osaamisala 2",
                value: "Testi2"
              }
            }
          ]
        },
        {
          anchor: "C",
          code: "3",
          title: "Sub category",
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                code: "A.C.A",
                isChecked: true,
                labelStyles: Object.assign({}, labelStyles, {
                  custom: isInLupa
                }),
                name: "example-checkbox",
                title: "Osaamisala 3",
                value: "Testi3"
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "B",
      code: "2",
      title: "Category",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "B.A",
            isChecked: true,
            labelStyles,
            name: "example-checkbox-2",
            title: "Tutkinto 2"
          }
        }
      ],
      categories: [
        {
          anchor: "A",
          code: "2.1",
          title: "Sub category",
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                code: "B.A.A",
                isChecked: true,
                labelStyles,
                name: "example-label",
                title: "Osaamisala 1",
                value: "Testi"
              }
            }
          ]
        },
        {
          anchor: "B",
          code: "2.2",
          title: "Sub category",
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                code: "B.B.A",
                isChecked: false,
                labelStyles,
                name: "example-checkbox",
                title: "Osaamisala 2",
                value: "Testi2"
              }
            }
          ],
          categories: [
            {
              anchor: "A",
              code: "2.2.1",
              title: "Sub category",
              components: [
                {
                  anchor: "A",
                  name: "CheckboxWithLabel",
                  properties: {
                    code: "B.B.A.A",
                    title: "Osaamisalan alakohta 1",
                    isChecked: false,
                    labelStyles,
                    name: "example-label",
                    value: "Testi"
                  }
                }
              ]
            },
            {
              anchor: "B",
              code: "2.2.2",
              title: "Sub category",
              components: [
                {
                  anchor: "A",
                  name: "CheckboxWithLabel",
                  properties: {
                    code: "B.B.B.A",
                    isChecked: false,
                    labelStyles,
                    name: "example-checkbox",
                    title: "Osaamisalan alakohta 2",
                    value: "Testi2"
                  }
                }
              ]
            },
            {
              anchor: "C",
              code: "2.2.3",
              title: "Sub category",
              components: [
                {
                  anchor: "A",
                  name: "CheckboxWithLabel",
                  properties: {
                    code: "B.B.C.A",
                    isChecked: false,
                    labelStyles,
                    name: "example-checkbox",
                    title: "Osaamisalan alakohta 3",
                    value: "Testi3"
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "C",
          code: "2.3",
          title: "Sub category",
          components: [
            {
              anchor: "A",
              name: "CheckboxWithLabel",
              properties: {
                code: "B.C.A",
                isChecked: false,
                labelStyles,
                name: "example-checkbox",
                title: "Osaamisala 3",
                value: "Testi3"
              }
            }
          ]
        }
      ],
      changes: []
    },
    {
      anchor: "C",
      code: "3",
      title: "Category",
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: "C.A",
            isChecked: false,
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            name: "example-checkbox-3",
            title: "Tutkinto 3"
          }
        }
      ]
    }
  ]
};
