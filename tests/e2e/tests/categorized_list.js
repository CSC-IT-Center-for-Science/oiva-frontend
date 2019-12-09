"use strict";

const {
  $,
  attach,
  clear,
  click,
  focus,
  into,
  textBox,
  to,
  write
} = require("taiko");
const chai = require("chai");
const assert = chai.assert;

function getRandomNumber(min, max, decimalCount) {
  const multiplier = Math.pow(10, decimalCount);
  const randomNumber = Math.random() * (max - min) + min;
  return Math.round(multiplier * randomNumber) / multiplier;
}

function getRandomText(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function getTextBox(anchor) {
  return await textBox({ id: anchor });
}

async function verifyThatElementUnderAnchorIsChecked(
  type,
  anchor,
  statusSelector = ""
) {
  try {
    const element = await $(
      `[data-anchor="${anchor}"] [type="${type}"]${statusSelector}`
    );
    assert.ok(await element.exists());
  } catch (e) {
    console.error(e);
  }
}

async function setValueIntoTextBox(anchor, value, shouldBeCleared = true) {
  try {
    const textBox = await getTextBox(anchor);
    let valueBeforeWriting = "";
    await focus(textBox);
    // let's clear the previous value of the focuced field first
    if (shouldBeCleared) {
      await clear();
    } else {
      valueBeforeWriting = await textBox.value();
    }
    // ensuring that the value is a string by creating a template string of it
    await write(`${value}`, into(textBox));
    const text = await textBox.value();
    assert.equal(text, valueBeforeWriting + value);
    gauge.dataStore.scenarioStore.put(anchor, value);
  } catch (err) {
    console.error(err);
  }
}

step("Assert if <type> <anchor> is checked", async (type, anchor) => {
  verifyThatElementUnderAnchorIsChecked(type, anchor, ":checked");
});

step("Assert if <type> <anchor> is not checked", async (type, anchor) => {
  verifyThatElementUnderAnchorIsChecked(type, anchor, "");
});

step("Focus textarea <anchor>", async anchor => {
  await focus(textbox({ id: anchor }));
});

step("Set value <value> into textarea <anchor>", async (value, anchor) => {
  const textBox = getTextBox(anchor);
  await write(value, into(textBox));
});

step(
  "Set random <length> chars into textarea <anchor>",
  async (length, anchor) => {
    const randomValue = getRandomText(length);
    await setValueIntoTextBox(anchor, randomValue);
  }
);

step(
  "Set random number with <decimalCount> decimals between <min> and <max> into <anchor>",
  async (decimalCount, min, max, anchor) => {
    const randomNumber = getRandomNumber(min, max, decimalCount);
    await setValueIntoTextBox(anchor, randomNumber);
  }
);

step("View textbox <anchor>", async anchor => {
  const storedValue = gauge.dataStore.scenarioStore.get(anchor);
  const textBox = await getTextBox(anchor);
  assert.equal(storedValue, await textBox.value());
});

step("Attach file <filename> to <anchor>", async (filename, anchor) => {
  try {
    await attach(`./files-to-attach/${filename}`, to($(`[id="${anchor}"]`)));
    await click("OK");
  } catch (err) {
    console.error(err);
  }
});
