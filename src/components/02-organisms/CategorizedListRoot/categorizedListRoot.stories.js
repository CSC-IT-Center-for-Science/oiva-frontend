import React from "react";
import CategorizedListRoot from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { checkboxStory } from "./storydata/checkboxStory";
import { simpleStory } from "./storydata/simpleStory";
import { simpleRadioStory } from "./storydata/simpleRadioStory";
import { complexStory } from "./storydata/complexStory";
import { radioStory } from "./storydata/radioStory";
import { longAndPlainStory } from "./storydata/longAndPlainStory";
import { simpleTextBoxStory } from "./storydata/simpleTextBoxStory";
import { subformStory } from "./storydata/subformStory";
import { textBoxStory } from "./storydata/textBoxStory";
import { attachmentsStory } from "./storydata/attachmentsStory";
import { inputStory } from "./storydata/inputStory";
import { datepickerStory } from "./storydata/datepickerStory";
import Stage from "./Stage";

storiesOf("CategorizedListRoot", module)
  .addDecorator(withInfo)
  .add("Long and plain example", () => {
    return (
      <Stage
        anchor={"long-and-plain"}
        // interval={0}
        loopChanges={[
          { anchor: "A.0.A", properties: { isChecked: true } },
          { anchor: "B.0.A", properties: { isChecked: true } },
          { anchor: "C.0.A", properties: { isChecked: true } },
          { anchor: "A.0.A", properties: { isChecked: false } },
          { anchor: "B.0.A", properties: { isChecked: false } },
          { anchor: "C.0.A", properties: { isChecked: false } },
        ]}
        categories={longAndPlainStory.categories}
        changes={longAndPlainStory.changes}
        render={props => <CategorizedListRoot showCategoryTitles={true} {...props} />}
      ></Stage>
    );
  })
  .add("Simple radio example", () => {
    return (
      <Stage
        anchor={"simple-radio"}
        // interval={0}
        loopChanges={[
          { anchor: "A.B.A", properties: { isChecked: true } },
          { anchor: "A.C.A", properties: { isChecked: true } },
          { anchor: "B.B.C.A", properties: { isChecked: true } },
          { anchor: "B.C.A", properties: { isChecked: true } },
          { anchor: "B.A.A", properties: { isChecked: true } },
          { anchor: "B.B.A.A", properties: { isChecked: true } },
          { anchor: "C.A", properties: { isChecked: true } }
        ]}
        categories={simpleRadioStory.categories}
        changes={simpleRadioStory.changes}
        render={props => <CategorizedListRoot {...props} />}
      ></Stage>
    );
  })
  .add("One checkbox example", () => {
    return (
      <Stage
        anchor={"checkbox"}
        interval={0}
        loopChanges={[
          { anchor: "A.A", properties: { isChecked: true } },
          { anchor: "A.A.A", properties: { isChecked: true } },
          { anchor: "A.A.A", properties: { isChecked: false } },
          { anchor: "A.A", properties: { isChecked: false } },
          { anchor: "A.A.A", properties: { isChecked: true } },
          { anchor: "A.A", properties: { isChecked: false } }
        ]}
        categories={checkboxStory.categories}
        changes={checkboxStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={true} {...props} />
        )}
      ></Stage>
    );
  })
  .add("Simple example", () => {
    return (
      <Stage
        anchor={"simple"}
        interval={0}
        loopChanges={[
          { anchor: "A.B.A", properties: { isChecked: true } },
          { anchor: "A.A", properties: { isChecked: false } },
          { anchor: "B.B.C.A", properties: { isChecked: true } },
          { anchor: "C.A", properties: { isChecked: false } },
          { anchor: "B.A", properties: { isChecked: false } },
          { anchor: "B.B.A.A", properties: { isChecked: true } },
          { anchor: "C.A", properties: { isChecked: true } }
        ]}
        categories={simpleStory.categories}
        changes={simpleStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={false} {...props} />
        )}
      ></Stage>
    );
  })
  .add("Complex example", () => {
    return (
      <Stage
        anchor={"complex"}
        // interval={1000}
        loopChanges={[
          { anchor: "A.A.A.A", properties: { isChecked: true } },
          { anchor: "A.B.B.A", properties: { isChecked: true } },
          { anchor: "A.B.A.A", properties: { isChecked: true } },
          {
            anchor: "A.B.A.B",
            properties: {
              selectedOption: { label: "Strawberry", value: "strawberry" }
            }
          },
          { anchor: "C.A.A", properties: { isChecked: true } },
          { anchor: "C.B.A", properties: { isChecked: true } },
          { anchor: "C.C.A", properties: { isChecked: true } },
          {
            anchor: "A.B.A.B",
            properties: {
              selectedOption: { label: "Chocolate", value: "chocolate" }
            }
          },
          { anchor: "A.A", properties: { isChecked: false } },
          { anchor: "C.A", properties: { isChecked: false } },
          { anchor: "C.A.B.A.A", properties: { isChecked: true } },
          { anchor: "B.A", properties: { isChecked: false } },
          { anchor: "A.B.A.A", properties: { isChecked: true } },
          { anchor: "B.A", properties: { isChecked: true } }
        ]}
        categories={complexStory.categories}
        changes={complexStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={false} {...props} />
        )}
      ></Stage>
    );
  })
  .add("Radio example", () => {
    return (
      <Stage
        anchor={"radio"}
        // interval={1000}
        loopChanges={[
          { anchor: "C.A.A", properties: { isChecked: true } },
          { anchor: "B.A", properties: { isChecked: true } },
          { anchor: "A.A.A", properties: { isChecked: true } },
          { anchor: "A.C.A", properties: { isChecked: true } },
          { anchor: "A.B.A", properties: { isChecked: true } }
        ]}
        categories={radioStory.categories}
        changes={radioStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={false} {...props} />
        )}
      ></Stage>
    );
  })
  .add("Simple text box example", () => {
    return (
      <Stage
        anchor={"simple-textbox"}
        // interval={1000}
        loopChanges={[
          { anchor: "A.A", properties: { isChecked: true } },
          { anchor: "A.A", properties: { isChecked: false } }
        ]}
        categories={simpleTextBoxStory.categories}
        changes={simpleTextBoxStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={true} {...props} />
        )}
      ></Stage>
    );
  })
  .add("Text box example", () => {
    return (
      <Stage
        anchor={"textbox"}
        // interval={1000}
        loopChanges={[
          { anchor: "A.A", properties: { isChecked: true } },
          { anchor: "C.A", properties: { isChecked: true } },
          { anchor: "B.A", properties: { isChecked: false } },
          { anchor: "A.A", properties: { isChecked: false } },
          { anchor: "A.B.A.A", properties: { isChecked: true } },
          { anchor: "B.A", properties: { isChecked: true } },
          { anchor: "C.A", properties: { isChecked: false } },
          { anchor: "A.A", properties: { isChecked: false } }
        ]}
        categories={textBoxStory.categories}
        changes={textBoxStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={false} {...props} />
        )}
      ></Stage>
    );
  })
  .add("Input example", () => {
    return (
      <Stage
        anchor={"input"}
        // interval={1000}
        loopChanges={[
          { anchor: "A.A", properties: { isChecked: true } },
          { anchor: "C.A", properties: { isChecked: true } },
          { anchor: "B.A", properties: { isChecked: false } },
          { anchor: "A.A", properties: { isChecked: false } },
          { anchor: "A.B.A.A", properties: { isChecked: true } },
          { anchor: "B.A", properties: { isChecked: true } },
          { anchor: "C.A", properties: { isChecked: false } },
          { anchor: "A.A", properties: { isChecked: false } }
        ]}
        categories={inputStory.categories}
        changes={inputStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={false} {...props} />
        )}
      ></Stage>
    );
  })
  .add("Datepicker example", () => {
    return (
      <CategorizedListRoot
        anchor="datepicker"
        categories={datepickerStory.categories}
        changes={datepickerStory.changes}
        onUpdate={() => {}}
        showCategoryTitles={false}
      />
    );
  })
  .add("Attachments example", () => {
    return (
      <Stage
        anchor={"attachments"}
        // interval={1000}
        categories={attachmentsStory.categories}
        changes={attachmentsStory.changes}
        render={props => (
          <CategorizedListRoot
            showCategoryTitles={false}
            {...props}
            placement="test"
          />
        )}
      ></Stage>
    );
  })
  .add("Dynamic subform example", () => {
    return (
      <Stage
        anchor={"dynamicSubforms"}
        // interval={1000}
        loopChanges={
          [
            // { anchor: "A.A", properties: { isChecked: true } },
            // { anchor: "C.A", properties: { isChecked: true } },
            // { anchor: "B.A", properties: { isChecked: false } },
            // { anchor: "A.A", properties: { isChecked: false } },
            // { anchor: "A.B.A.A", properties: { isChecked: true } },
            // { anchor: "B.A", properties: { isChecked: true } },
            // { anchor: "C.A", properties: { isChecked: false } },
            // { anchor: "A.A", properties: { isChecked: false } }
          ]
        }
        categories={subformStory.categories}
        changes={subformStory.changes}
        render={props => (
          <CategorizedListRoot showCategoryTitles={false} {...props} />
        )}
      ></Stage>
    );
  });
