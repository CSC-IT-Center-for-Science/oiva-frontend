/* globals gauge*/
"use strict";

const R = require("ramda");

const {
  $,
  click,
  focus,
  scrollDown,
  scrollTo,
  textBox,
  waitFor,
  write
} = require("taiko");
const chai = require("chai");
const assert = chai.assert;

step("Tee muutos kohtaan <kielet>", async kielet => {
  const handleKielet = async (rows, index) => {
    await scrollDown($(".MuiDialogContent-root"));
    const kieli = R.view(R.lensIndex(1), rows[index].cells);
    await scrollTo(kieli);
    await click(kieli);
    if (index < rows.length - 1) {
      return handleKielet(rows, index + 1);
    }
    return true;
  };

  try {
    await handleKielet(kielet.rows, 0);
  } catch (e) {
    console.error(e);
  }
});

step("Perustele kielet <kielet>", async kielet => {
  const perusteleKielet = async (rows, index) => {
    await scrollDown($(".MuiDialogContent-root"));
    const kieliId = R.view(R.lensIndex(0), rows[index].cells);
    const textareaId = `perustelut_kielet_opetuskielet.${kieliId}.vapaa-tekstikentta.A`;
    await focus(textBox({ id: textareaId }));
    await write(`The robot was here. ${new Date().toUTCString()}`);
    if (index < rows.length - 1) {
      return perusteleKielet(rows, index + 1);
    }
    return true;
  };

  try {
    await perusteleKielet(kielet.rows, 0);
  } catch (e) {
    console.error(e);
  }
});

step(
  "Tarkista muutosten lukumäärä <id> <numberOfChanges>",
  async (id, expectedValue) => {
    try {
      await waitFor(500);
      const element = await $(`[id="${id}"]`);
      assert.ok(await element.exists(), "Element id=" + id + " does not exist");
      const text = await element.text();
      assert.equal(R.head(text), expectedValue);
    } catch (e) {
      console.error(e);
    }
  }
);

step("Avaa ExpandableRow <anchor>", async anchor => {
  const id = `${anchor}-summary`;
  const closedExpandableRow = await $(`[id="${id}"][aria-expanded="false"]`);
  // If ExpandableRow is NOT expanded it will be expanded by clicking it.
  if (closedExpandableRow) {
    await click(closedExpandableRow);
  }
  const openExpandableRow = await $(`[id="${id}"][aria-expanded="true"]`);
  assert.ok(await openExpandableRow.exists());
});

step("Sulje ExpandableRow <anchor>", async anchor => {
  const id = `${anchor}-summary`;
  const openExpandableRow = await $(`[id="${id}"][aria-expanded="true"]`);
  // If ExpandableRow is NOT expanded it will be expanded by clicking it.
  if (openExpandableRow) {
    await click(openExpandableRow);
  }
  const closedExpandableRow = await $(`[id="${id}"][aria-expanded="false"]`);
  assert.ok(await closedExpandableRow.exists());
});
