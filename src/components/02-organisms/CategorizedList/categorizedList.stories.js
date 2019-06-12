import CategorizedList from "./index";
import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { isInLupa, isAdded, isRemoved } from "../../../css/label";

storiesOf("CategorizedList", module)
  .addDecorator(withInfo)
  .add("Simple example", () => {
    const handleChanges = () => {
      console.info("Simple changes...");
    };
    const changes = [];

    const categories = [
      {
        code: "1",
        title: "Category",
        components: [
          {
            name: "CheckboxWithLabel",
            properties: {
              name: "example-checkbox-1",
              code: 1,
              title: "Row item",
              labelStyles: Object.assign({}, isAdded, isInLupa),
              isChecked: false
            }
          }
        ],
        categories: [
          {
            code: "1.1",
            title: "Sub category",
            components: [
              {
                name: "CheckboxWithLabel",
                properties: {
                  name: "example-checkbox",
                  code: 1.1,
                  title: "Sub row",
                  isChecked: false,
                  value: "Testi"
                }
              }
            ]
          },
          {
            code: "1.2",
            title: "Sub category",
            components: [
              {
                name: "CheckboxWithLabel",
                properties: {
                  name: "example-checkbox",
                  code: "1.2",
                  title: "Sub row",
                  isChecked: false,
                  value: "Testi2"
                }
              }
            ]
          },
          {
            code: "1.3",
            title: "Sub category",
            components: [
              {
                name: "CheckboxWithLabel",
                properties: {
                  name: "example-checkbox",
                  code: "1.3",
                  title: "Sub row",
                  isChecked: false,
                  value: "Testi3"
                }
              }
            ]
          }
        ]
      },
      {
        code: "2",
        title: "Category",
        components: [
          {
            name: "CheckboxWithLabel",
            properties: {
              name: "example-checkbox-2",
              code: 2,
              title: "Row item",
              labelStyles: Object.assign({}, isRemoved, isInLupa),
              isChecked: false
            }
          }
        ],
        categories: [
          {
            code: "2.1",
            title: "Sub category",
            components: [
              {
                name: "CheckboxWithLabel",
                properties: {
                  name: "example-label",
                  code: 2.1,
                  title: "Sub row",
                  isChecked: true,
                  value: "Testi"
                }
              }
            ]
          },
          {
            code: "2.2",
            title: "Sub category",
            components: [
              {
                name: "CheckboxWithLabel",
                properties: {
                  name: "example-checkbox",
                  code: 2.2,
                  title: "Sub row",
                  isChecked: false,
                  value: "Testi2"
                }
              }
            ]
          },
          {
            code: "2.3",
            title: "Sub category",
            components: [
              {
                name: "CheckboxWithLabel",
                properties: {
                  name: "example-checkbox",
                  code: 2.3,
                  title: "Sub row",
                  isChecked: false,
                  value: "Testi3"
                }
              }
            ]
          }
        ]
      },
      {
        code: "3",
        title: "Category",
        components: [
          {
            name: "CheckboxWithLabel",
            properties: {
              name: "example-checkbox-3",
              code: 3,
              title: "Row item",
              labelStyles: Object.assign(isInLupa),
              isChecked: false
            }
          }
        ]
      }
    ];

    return (
      <CategorizedList
        categories={categories}
        changes={changes}
        id="root"
        onChanges={handleChanges}
        shouldBeExpanded={false}
      />
    );
  })
  .add("Complex example", () => {
    const handleChanges = () => {
      console.info("Changes...");
    };
    const changes = [];

    const categories = [
      {
        code: "01",
        title: "Category 1",
        components: [
          {
            name: "CheckboxWithLabel",
            properties: {
              name: "example-checkbox-1",
              code: 1,
              title: "Row item",
              labelStyles: Object.assign({}, isAdded, isInLupa),
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
            code: "01",
            title: "Sub category",
            components: [
              {
                name: "RadioButtonWithLabel",
                properties: {
                  name: "example-radio",
                  code: 1.1,
                  title: "Sub row",
                  isChecked: true,
                  value: "Testi"
                }
              }
            ],
            categories: [
              {
                code: "01",
                title: "Leaf node category",
                components: [
                  {
                    name: "CheckboxWithLabel",
                    properties: {
                      name: "example-checkbox-1.1.1",
                      code: "1.1.1",
                      title: "Leaf node item",
                      labelStyles: Object.assign({}, isAdded, isInLupa),
                      isChecked: false
                    }
                  }
                ]
              },
              {
                components: [
                  {
                    name: "CheckboxWithLabel",
                    properties: {
                      name: "example-checkbox-1.1.2",
                      code: "1.1.2",
                      title: "Leaf node item",
                      labelStyles: Object.assign({}, isAdded, isInLupa),
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
                      ],
                      isChecked: true
                    }
                  }
                ]
              }
            ]
          },
          {
            code: "02",
            title: "Sub category",
            components: [
              {
                name: "RadioButtonWithLabel",
                properties: {
                  name: "example-radio",
                  code: "1.2",
                  title: "Sub row",
                  isChecked: false,
                  value: "Testi2"
                }
              }
            ]
          },
          {
            components: [
              {
                name: "CheckboxWithLabel",
                properties: {
                  name: "example-checkbox",
                  code: "1.3",
                  title: "Sub row",
                  isChecked: false,
                  value: "Testi3"
                }
              }
            ]
          }
        ]
      },
      {
        components: [
          {
            name: "CheckboxWithLabel",
            properties: {
              name: "example-checkbox-2",
              code: 2,
              title: "Row item",
              labelStyles: Object.assign({}, isRemoved, isInLupa),
              isChecked: false
            }
          }
        ]
      },
      {
        components: [
          {
            name: "CheckboxWithLabel",
            properties: {
              name: "example-checkbox-3",
              code: 3,
              title: "Row item",
              labelStyles: Object.assign(isInLupa),
              isChecked: false
            }
          }
        ]
      }
    ];

    return (
      <CategorizedList
        categories={categories}
        changes={changes}
        onChanges={handleChanges}
        shouldBeExpanded={false}
      />
    );
  });
