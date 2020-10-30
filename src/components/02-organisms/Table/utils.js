import * as R from "ramda";

/**
 * Basic table components.
 */
export const components = [
  // Grid is around the whole table data.
  {
    id: "grid",
    name: "Grid"
  },
  // It's a row of a table.
  {
    id: "table-row",
    name: "TableRow"
  },
  // Cell definition of a header row.
  {
    id: "header-cell",
    name: "TableCell",
    properties: {
      isHeader: true
    }
  },
  // Cell of a body section.
  {
    id: "cell",
    name: "TableCell"
  },
  // A row group can contain one or multiple rows.
  {
    id: "row-group",
    name: "RowGroup"
  }
];

function getCell(properties) {
  return {
    ref: "cell",
    properties
  };
}

function getHeaderCell(properties) {
  return {
    ref: "header-cell",
    properties
  };
}

export function getMain(properties) {
  return {
    main: {
      components: [
        {
          ref: "grid",
          includes: properties.includes
        }
      ]
    }
  };
}

export function getRowGroup(id, properties) {
  return {
    [id]: {
      components: [
        {
          ref: "row-group",
          includes: properties.includes,
          properties: {
            styleClasses: ["flex flex-col"]
          }
        }
      ]
    }
  };
}

export function getTableRow(id, properties, onClick) {
  return {
    [id]: {
      components: [
        Object.assign(
          {},
          {
            ref: "table-row",
            includes: properties.includes
          },
          onClick
            ? {
                properties: {
                  onClick: (action, properties) => {
                    return onClick(action, properties);
                  }
                }
              }
            : {}
        )
      ]
    }
  };
}

export function dataCellsOnHeaderRow(id, cellsOfARow, properties, onClick) {
  return {
    [id]: {
      components: R.addIndex(R.map)((cellData, i) => {
        return getHeaderCell({
          isHeader: true,
          isSortable: cellData.isSortable,
          columnIndex: i,
          orderOfBodyRows: properties.orderOfBodyRows,
          onClick: (action, properties) => {
            return onClick(action, properties);
          },
          sortingToolTip: cellData.sortingTooltip,
          styleClasses: cellData.styleClasses || [`w-1/${cellsOfARow.length}`],
          title: cellData.text
        });
      }, cellsOfARow)
    }
  };
}

export function dataCellsOnRow(id, cellsOfARow) {
  const obj = {
    [id]: {
      components: R.map(cellData => {
        const cell = getCell(
          {
            styleClasses: cellData.styleClasses || [
              `w-1/${cellsOfARow.length}`
            ],
            title: cellData.text
          },
          cellData
        );
        return {
          ...cell,
          includes: cellData.includes || []
        };
      }, cellsOfARow)
    }
  };
  return obj;
}

// export function addRowGroupsToObject(prefix, ) {
//   const objectToAdd = getTableRow(
//     `${prefix}-rowGroup-${index}`,
//     {
//       includes: [`cells-of-${prefix}row-${index}`]
//     },
//     onClick
//   );
//   const updatedResult = Object.assign({}, result, objectToAdd);
//   if (rows[index + 1]) {
//     return addRowsToObject(prefix, onClick, index + 1, updatedResult);
//   }
//   return updatedResult;
// }

export function addCellsToObject(
  cells,
  properties = {},
  onClick,
  index = 0,
  level = 0,
  prefix = "",
  result = {}
) {
  const objectToAdd = properties.isHeader
    ? dataCellsOnHeaderRow(`cells-of-${prefix}`, cells, properties, onClick)
    : dataCellsOnRow(`cells-of-${prefix}`, cells, properties, onClick);
  const updatedResult = Object.assign({}, result, objectToAdd);
  if (cells[index + 1]) {
    return addCellsToObject(
      cells,
      properties,
      onClick,
      index + 1,
      level,
      prefix,
      updatedResult
    );
  }
  return updatedResult;
}

export function addRowsToObject(
  rows = [],
  properties = {},
  onClick,
  index = 0,
  level = 0,
  prevLevelPrefix = "",
  result = {}
) {
  let updatedResult = result;
  let nextLevelKeys = [];
  let rowGroupKey = "";

  const prefixPart = `${
    prevLevelPrefix ? prevLevelPrefix + "-" : ""
  }${level}-${index}`;

  const prefix = properties.isHeader ? `${prefixPart}-header` : prefixPart;

  if (rows[index] && rows[index].rows) {
    const subRows = addRowsToObject(
      rows[index].rows,
      {},
      onClick,
      0,
      level + 1,
      prefix
    );

    updatedResult = Object.assign({}, result, subRows);

    nextLevelKeys = R.filter(
      R.and(
        R.startsWith(prefix),
        R.compose(R.equals(R.length(prefix) + 4), R.length)
      ),
      R.keys(subRows)
    );

    rowGroupKey = `${prefix}-rowGroup`;

    const rowGroup = getRowGroup(`${prefix}-rowGroup`, {
      includes: nextLevelKeys
    });

    updatedResult = Object.assign({}, updatedResult, rowGroup);
  }

  const objectToAdd = getTableRow(
    prefix,
    {
      includes: [
        [`cells-of-${prefix}`],
        rowGroupKey ? [rowGroupKey] : null
      ].filter(Boolean)
    },
    onClick
  );

  updatedResult = Object.assign({}, updatedResult, objectToAdd);

  if (rows[index] && rows[index].cells) {
    const cellsOfTheCurrentRow = addCellsToObject(
      rows[index].cells,
      properties,
      onClick,
      0,
      0,
      prefix
    );
    updatedResult = Object.assign({}, updatedResult, cellsOfTheCurrentRow);
  }

  if (rows[index + 1]) {
    return addRowsToObject(
      rows,
      properties,
      onClick,
      index + 1,
      level,
      prevLevelPrefix,
      updatedResult
    );
  }
  return updatedResult;
}
