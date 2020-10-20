import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import multidimensionalTable from "./storydata/multidimensionalTable";
import dateTable from "./storydata/dateTable";
import simpleTable from "./storydata/simpleTable";
import Table from "./index";
import SearchFilter from "../SearchFilter/index";
import Dropdown from "../../00-atoms/Dropdown/index";
import Pill from "../../00-atoms/Chip/index";

import conditionalMenuInTableCell from "./storydata/conditionalMenuInTableCell";

/**
 * Tables are created using descriptive structures. One per table.
 * Example structures are defined under storydata folder. A table
 * can contain 0 - n sub tables, sub tables can contain sub tables
 * and so on. The most common use case is propably a one dimension
 * table.
 */
storiesOf("Table", module)
  .addDecorator(withInfo)
  .add("Multidimensional table", () => {
    return <Table structure={multidimensionalTable} />;
  })
  .add("Simple table", () => {
    return <Table structure={simpleTable} />;
  })
  .add("Conditional menu in table cell", () => {
    return <Table structure={conditionalMenuInTableCell} />;
  })
  .add("Table with filters", () => {
    return (
      <>
        <div className="flex flex-col lg:flex-row mb-4">
          <div className="lg:mr-4 h-13 w-full lg:w-1/4">
            <SearchFilter callback={() => {}} />
          </div>
          <div className="mt-2 lg:mt-0 lg:mr-4 h-13">
            <Dropdown
              isTall={true}
              className="w-20"
              options={[
                { label: "Aaaaaaaa", value: "Aaaaaaaa" },
                { label: "Bbbbbb", value: "Bbbbbb" },
                { label: "Ccccccccccc", value: "Ccccccccccc" }
              ]}
            />
          </div>
          <div className="mt-2 lg:ml-4 lg:mx-auto">
            <Pill label="Something" onDelete={() => {}} />
          </div>
        </div>
        <Table structure={conditionalMenuInTableCell} />
      </>
    );
  })
  .add("Dates", () => {
    return <Table structure={dateTable} />;
  });
