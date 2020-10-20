import * as R from "ramda";

const colWidths = {
  0: "w-3/12",
  1: "w-2/12",
  2: "w-2/12",
  3: "w-2/12",
  4: "w-2/12",
  5: "w-1/12"
};

function getRandomNumber(max = 1000) {
  return Math.floor(Math.random() * max + 1);
}

/**
 * Table can contain multiple sub tables. This is one of them.
 */
export const subTable = [
  {
    role: "thead",
    rowGroups: [
      {
        rows: [
          {
            id: 0, // This can be e.g. uuid
            onClick: (row, action) => {
              console.info("The row you just clicked is: ", row, action);
            },
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  isSortable: true,
                  sortingTooltip: "Järjestä sarakkeen mukaan",
                  styleClasses: [colWidths[ii]],
                  truncate: true,
                  text: `(SubTable) ${ii}`
                };
              },
              [1, 2, 3, 4, 5, 6]
            )
          }
        ]
      }
    ]
  },
  {
    role: "tbody",
    rowGroups: [
      {
        rows: R.addIndex(R.map)((row, i) => {
          return {
            id: i, // This can be e.g. uuid
            onClick: (row, action) => {
              console.info("The row you just clicked is: ", row, action);
            },
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  styleClasses: [colWidths[ii]],
                  truncate: true,
                  text: `${getRandomNumber(10)} (${i}${ii})`
                };
              },
              [1, 2, 3, 4, 5]
            ).concat({
              menu: {
                id: `simple-menu-${i}`,
                actions: [
                  {
                    id: "start-preparing",
                    text: "Ota valmisteluun"
                  },
                  {
                    id: "delete",
                    text: "Poista"
                  }
                ]
              },
              styleClasses: [colWidths[5]]
            })
          };
        }, new Array(10))
      }
    ]
  },
  {
    role: "tfoot"
  }
];

export const subTable2 = [
  {
    role: "thead",
    rowGroups: [
      {
        rows: [
          {
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  isSortable: true,
                  styleClasses: [colWidths[ii]],
                  truncate: true,
                  text: `(subTable2) ${ii}`
                };
              },
              [1, 2, 3, 4, 5, 6]
            )
          }
        ]
      }
    ]
  },
  {
    role: "tbody",
    rowGroups: [
      {
        rows: R.addIndex(R.map)((row, i) => {
          return {
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  styleClasses: [colWidths[ii]],
                  truncate: true,
                  text: `${getRandomNumber(30)} (${i}${ii})`
                };
              },
              [1, 2, 3, 4, 5, 6]
            )
          };
        }, new Array(5))
      }
    ]
  },
  {
    role: "tfoot"
  }
];

export default [
  {
    role: "thead",
    rowGroups: [
      {
        rows: [
          {
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  isSortable: true,
                  truncate: true,
                  styleClasses: [colWidths[ii]],
                  text: `(MainTable) ${ii}`
                };
              },
              [1, 2, 3, 4, 5, 6]
            )
          }
        ]
      }
    ]
  },
  {
    role: "tbody",
    rowGroups: [
      {
        rows: [
          {
            onClick: (row, action) => {
              console.info("The row you just clicked is: ", row, action);
            },
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  truncate: true,
                  styleClasses: [colWidths[ii]],
                  text: `${getRandomNumber(3000)} (${0}${ii})`
                };
              },
              [1, 2, 3, 4, 5, 6]
            ),
            rows: [
              {
                cells: [
                  {
                    table: subTable
                  }
                ]
              }
            ]
          },
          {
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  truncate: true,
                  styleClasses: [colWidths[ii]],
                  text: `${getRandomNumber(500)} (${0}${ii})`
                };
              },
              [1, 2, 3, 4, 5, 6]
            )
          },
          {
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  truncate: true,
                  styleClasses: [colWidths[ii]],
                  text: `${getRandomNumber(300)} (${0}${ii})`
                };
              },
              [1, 2, 3, 4, 5, 6]
            ),
            rows: [
              {
                cells: [
                  {
                    table: subTable2
                  }
                ]
              }
            ]
          },
          {
            cells: R.addIndex(R.map)(
              (col, ii) => {
                return {
                  truncate: true,
                  styleClasses: [colWidths[ii]],
                  text: `${getRandomNumber(10000)} (${0}${ii})`
                };
              },
              [1, 2, 3, 4, 5, 6]
            )
          }
        ]
      }
    ]
  },
  {
    role: "tfoot"
  }
];
