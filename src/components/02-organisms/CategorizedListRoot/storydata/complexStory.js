import { isInLupa, isAdded, isRemoved } from "../../../../css/label";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

export const complexStory = {
  changes: [
    {
      anchor: "complex.A.A",
      properties: {
        isChecked: true
      }
    },
    {
      anchor: "complex.B.A",
      properties: {
        isChecked: true
      }
    },

    {
      anchor: "complex.A.B.A",
      properties: {
        isChecked: true
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
              anchor: "A",
              code: "0",
              title: "Categories",
              components: [
                {
                  anchor: "A",
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
              anchor: "B",
              code: "1",
              title: "Categories",
              components: [
                {
                  anchor: "A",
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
              anchor: "A",
              code: "0",
              title: "Categories",
              components: [
                {
                  anchor: "A",
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
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox-1.2.2",
                    code: "1.2.2",
                    title: "Leaf node item",
                    labelStyles: Object.assign({}, labelStyles, {
                      custom: isInLupa
                    }),
                    isChecked: true
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
              name: "CheckboxWithLabel",
              properties: {
                name: "example-checkbox",
                code: "1.3",
                title: "Sub row",
                isChecked: false,
                labelStyles,
                value: "Testi3"
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
            code: 2,
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
                code: "3.1",
                title: "Sub row",
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
                    code: "3.1.1",
                    title: "Sub sub row",
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
                        code: "3.1.1.1",
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
                        code: "3.1.1.2",
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
                    code: "3.1.2",
                    title: "Sub sub row",
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
                        code: "3.1.2.1",
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
                      name: "CheckboxWithLabel",
                      properties: {
                        name: "example-checkbox-1.2.2",
                        code: "3.1.2.2",
                        title: "Leaf node item",
                        labelStyles: Object.assign({}, labelStyles, {
                          custom: isInLupa
                        }),
                        isChecked: true
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
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "example-checkbox",
                    code: "3.1.3",
                    title: "Sub row",
                    isChecked: false,
                    labelStyles,
                    value: "Testi3"
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
                code: 3.2,
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
                code: 3.3,
                title: "Row item",
                labelStyles: Object.assign({}, labelStyles, {
                  custom: isInLupa
                }),
                isChecked: false
              }
            }
          ]
        }
      ],
      components: [
        {
          anchor: "A",
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
