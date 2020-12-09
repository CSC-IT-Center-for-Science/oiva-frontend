import React from "react";
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
import { withState } from "@dump247/storybook-state";

storiesOf("CategorizedListRoot", module)
  .addDecorator(withInfo)
  .add(
    "One checkbox story",
    withState(oneCheckboxStory)(({ store }) => (
      <CategorizedListRoot
        anchor="one-checkbox"
        categories={oneCheckboxStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={true}
      />
    ))
  )
  .add(
    "Long and plain - Checkboxes only",
    withState(longAndPlainStory)(({ store }) => (
      <CategorizedListRoot
        anchor="long-and-plain"
        categories={longAndPlainStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={true}
      />
    ))
  )
  .add(
    "Three levels of radio buttons",
    withState(simpleRadioStory)(({ store }) => (
      <CategorizedListRoot
        anchor="simple-radio"
        categories={simpleRadioStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
      />
    ))
  )
  .add(
    "Checkbox under a checkbox",
    withState(checkboxStory)(({ store }) => (
      <CategorizedListRoot
        anchor="checkbox"
        categories={checkboxStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={true}
      />
    ))
  )
  .add(
    "Three levels of checkboxes",
    withState(checkboxStory)(({ store }) => (
      <CategorizedListRoot
        anchor="simple"
        categories={threeLevelsOfCheckboxes.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
      />
    ))
  )
  .add(
    "Checkboxes, radio buttons and dropdowns",
    withState(complexStory)(({ store }) => (
      <CategorizedListRoot
        anchor="complex"
        categories={complexStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  )
  .add(
    "Checkboxes, radio buttons and dropdowns (simpler)",
    withState(complexStory)(({ store }) => (
      <CategorizedListRoot
        anchor="radio"
        categories={radioStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  )
  .add(
    "Simple textbox example",
    withState(simpleTextBoxStory)(({ store }) => (
      <CategorizedListRoot
        anchor="simple-textbox"
        categories={simpleTextBoxStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={true}
      />
    ))
  )
  .add(
    "Checkboxes, Dropdowns, textboxes and radio buttons",
    withState(textBoxStory)(({ store }) => (
      <CategorizedListRoot
        anchor="textboxStory"
        categories={textBoxStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  )
  .add(
    "Checkboxes, Dropdowns, inputs and radio buttons",
    withState(inputStory)(({ store }) => (
      <CategorizedListRoot
        anchor="input"
        categories={inputStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  )
  .add(
    "Datepicker example",
    withState(inputStory)(({ store }) => (
      <CategorizedListRoot
        anchor="datepicker"
        categories={datepickerStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  )
  .add(
    "Attachments example",
    withState(attachmentsStory)(({ store }) => (
      <CategorizedListRoot
        anchor="attachments"
        categories={attachmentsStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  )
  .add(
    "Alert example",
    withState(attachmentsStory)(({ store }) => (
      <CategorizedListRoot
        anchor="alert"
        categories={alertStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  )
  .add(
    "Multiselect example",
    withState(multiselectStory)(({ store }) => (
      <CategorizedListRoot
        anchor="multiselect"
        categories={multiselectStory.categories}
        changes={store.state.changes}
        onUpdate={({ changes }) => {
          store.set({ changes });
        }}
        showCategoryTitles={false}
      />
    ))
  );
