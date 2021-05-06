import React, { useState } from "react";
import CategorizedListRoot from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { checkboxStory } from "./storydata/checkboxStory";
import { threeLevelsOfCheckboxes } from "./storydata/threeLevelsOfCheckboxes";
import { simpleRadioStory } from "./storydata/simpleRadioStory";
import { complexStory } from "./storydata/complexStory";
import { radioStory } from "./storydata/radioStory";
import { longAndPlainStory } from "./storydata/longAndPlainStory";
import { simpleTextBoxStory } from "./storydata/simpleTextBoxStory";
import { textBoxStory } from "./storydata/textBoxStory";
import { attachmentsStory } from "./storydata/attachmentsStory";
import { inputStory } from "./storydata/inputStory";
import { datepickerStory } from "./storydata/datepickerStory";
import { alertStory } from "./storydata/alertStory";
import { multiselectStory } from "./storydata/multiselectStory";
import { oneCheckboxStory } from "./storydata/oneCheckboxStory";

storiesOf("CategorizedListRoot", module)
  .addDecorator(withInfo)
  .add("One checkbox story", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="one-checkbox"
        categories={oneCheckboxStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={true}
      />
    );
  })
  .add("Long and plain - Checkboxes only", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="long-and-plain"
        categories={longAndPlainStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={true}
      />
    );
  })
  .add("Three levels of radio buttons", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="simple-radio"
        categories={simpleRadioStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
      />
    );
  })
  .add("Checkbox under a checkbox", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="checkbox"
        categories={checkboxStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={true}
      />
    );
  })
  .add("Three levels of checkboxes", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="simple"
        categories={threeLevelsOfCheckboxes.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
      />
    );
  })
  .add("Checkboxes, radio buttons and dropdowns", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="complex"
        categories={complexStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  })
  .add("Checkboxes, radio buttons and dropdowns (simpler)", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="radio"
        categories={radioStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  })
  .add("Simple textbox example", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="simple-textbox"
        categories={simpleTextBoxStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={true}
      />
    );
  })
  .add("Checkboxes, Dropdowns, textboxes and radio buttons", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="textboxStory"
        categories={textBoxStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  })
  .add("Checkboxes, Dropdowns, inputs and radio buttons", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="input"
        categories={inputStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  })
  .add("Datepicker example", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="datepicker"
        categories={datepickerStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  })
  .add("Attachments example", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="attachments"
        categories={attachmentsStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  })
  .add("Alert example", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="alert"
        categories={alertStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  })
  .add("Multiselect example", () => {
    const [state, setState] = useState({
      changes: []
    });
    return (
      <CategorizedListRoot
        anchor="multiselect"
        categories={multiselectStory.categories}
        changes={state.changes}
        onUpdate={({ changes }) => {
          setState({ changes });
        }}
        showCategoryTitles={false}
      />
    );
  });
