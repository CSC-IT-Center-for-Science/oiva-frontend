/* globals gauge*/
"use strict";
const {
  $,
  button,
  clear,
  goto,
  click,
  closeBrowser,
  currentURL,
  focus,
  link,
  openBrowser,
  press,
  reload,
  scrollTo,
  setViewPort,
  text,
  textBox,
  waitFor,
  write
} = require("taiko");
const chai = require("chai");
require("dotenv").config();
const assert = chai.assert;
const headless = process.env.headless_chrome.toLowerCase() === "true";

beforeSuite(async () => {
  await openBrowser({ args: ["--window-size=1600,1200"], headless });
});

afterSuite(async () => {
  await closeBrowser();
});

step("Siirry osoitteeseen <url>", async url => {
  try {
    await goto(url);
  } catch (e) {
    await click($("#details-button"));
    await click($("#proceed-link"));
  }
});

step("Odota <ms> ms", async ms => {
  await waitFor(ms);
});

step(
  "Kirjoita kenttään, jonka tyyppi on <type> arvo <value>",
  async (type, value) => {
    await focus(textBox({ type }));
    await write(value);
  }
);

step("Paina näppäintä <key>", async key => {
  await press(key);
});

step(
  "Klikkaa elementtiä, jonka <parameter> on <parameterValue>",
  async (parameter, parameterValue) => {
    await click({ [parameter]: parameterValue });
  }
);

step(
  "Klikkaa elementtiä, jonka <parameter> sisältää <parameterValue>",
  async (parameter, parameterValue) => {
    await click($(`[${parameter}*="${parameterValue}"]`));
  }
);

step(
  "Kirjoita kenttään, jonka parametri <parameter> on <parameterValue> arvo <value>",
  async (parameter, parameterValue, value) => {
    const field = textBox({ [parameter]: parameterValue });
    await focus(field);
    await waitFor(100);
    await focus(field);
    await waitFor(100);
    // await clear(field);
    await write(value);
  }
);

step(
  "Valitse asetuksen kohde <asetuksenAutocompletenId> kohteeksi <teksti>",
  async (asetuksenAutocompletenId, teksti) => {
    await click($(`input[id="${asetuksenAutocompletenId}"]`));
    await click(teksti);
  }
);

step(
  "Valitse asetuksen tarkennin <asetuksenTarkentimenAutocompletenId> kohteeksi <teksti>",
  async (asetuksenTarkentimenAutocompletenId, teksti) => {
    await click($(`input[id="${asetuksenTarkentimenAutocompletenId}"]`));
    await click(teksti);
  }
);

step("Klikkaa esidialogin hakupainiketta", async () => {
  await click(button({ "aria-label": "Hae" }));
});

step(
  "Varmista, ettei auki olevalle hakemukselle pääse kirjautumattomana",
  async () => {
    const url = await currentURL();
    await click("Poistu");
    await click("Kirjaudu ulos");
    await goto(url);
    assert.ok(
      await text("Oiva - Opetushallinnon ohjaus- ja säätelypalvelu").exists()
    );
  }
);

step("Log in as <username>", async username => {
  await click("Kirjaudu sisään");
  await click("JATKA KIRJAUTUMISEEN");
  await write(username);
  await focus(textBox({ type: "password" }));
  await write(process.env[username]);
  await click(button({ type: "submit" }));
  assert.ok(await text("Kirjaudu ulos").exists());
});

step("Log out", async () => {
  try {
    await click(link({ href: "/cas-logout" }));
  } catch (e) {
    console.error(e);
  }
});

step("Jarjestamislupa", async () => {
  try {
    click("Järjestämislupa");
    assert.ok(await text("Tutkinnot ja koulutukset").exists());
  } catch (e) {
    console.error(e);
  }
});

step("Päivitä selainikkuna", async () => {
  await reload();
});

step("Avaa uusi muutospyyntolomake", async () => {
  try {
    await click(link({ class: "link-to-own-organisation" }));
    await click(link({ id: "jarjestamislupa-asiat" }));
    await click($("button.newHakemus"));
    await text("Uusi hakemus").exists();
  } catch (e) {
    console.error(e);
  }
});

step("Klikkaa elementtiä, jossa on teksti <teksti>", async teksti => {
  try {
    await click(teksti);
  } catch (e) {
    console.error(e);
  }
});

step("Varmista, että hakulomake on avattu otsikolla <teksti>", async teksti => {
  try {
    assert.equal(await $("h1").text(), teksti);
  } catch (e) {
    console.error(e);
  }
});

step(
  "Varmista, että uuden asian esidialogi aukesi otsikolla <teksti>",
  async teksti => {
    try {
      assert.equal(await $("h6").text(), teksti);
    } catch (e) {
      console.error(e);
    }
  }
);

step(
  "Varmista, että sisäänkirjautumisen ohjedialogi aukesi otsikolla <teksti>",
  async teksti => {
    try {
      assert.equal(await $("h6").text(), teksti);
    } catch (e) {
      console.error(e);
    }
  }
);

step("Varmista, ettei löydy tekstiä <teksti>", async teksti => {
  try {
    assert.ok(!(await text(teksti).exists()));
  } catch (e) {
    console.error(e);
  }
});

step("Edellinen sivu", async () => {
  try {
    await click($("button.previous"));
  } catch (e) {
    console.error(e);
  }
});

step("Seuraava sivu", async () => {
  try {
    await click($("button.next"));
  } catch (e) {
    console.error(e);
  }
});

step("Tallenna hakemus", async () => {
  try {
    await click($("button.save"));
  } catch (e) {
    console.error(e);
  }
});

step("Lataa sivu uudelleen", async () => {
  try {
    await reload(currentURL());
  } catch (e) {
    console.error(e);
  }
});

step("Tarkista, että ollaan sivulla <pageNumber>", async pageNumber => {
  try {
    assert.include(await currentURL(), `uusi/${pageNumber}`);
  } catch (e) {
    console.error(e);
  }
});

step("Lomakeoperaatio <sectionId> valitse <item>", async (sectionId, item) => {
  try {
    //await scrollDown($(".MuiDialogContent-root"));
    await scrollTo(item);
    await click(item);
  } catch (e) {
    console.error(e);
  }
});

step("Sulje lomake", async () => {
  try {
    await click($('button[aria-label="Close"]'));
    await click("Kyllä");
    assert.notInclude(await currentURL(), "hakemukset-ja-paatokset");
  } catch (e) {
    console.error(e);
  }
});

step("Assert if text exists <string>", async string => {
  try {
    assert.ok(await text(string).exists());
  } catch (e) {
    console.error(e);
  }
});

step("Klikkaa päänavigaation linkkiä <linkinTeksti>", async linkinTeksti => {
  await click(linkinTeksti);
  assert.ok(await text(linkinTeksti).exists());
  assert.equal(await $("h1").text(), linkinTeksti);
});

step(
  "Siirry koulutusmuodon <koulutusmuoto> pääsivulle",
  async koulutusmuoto => {
    await click(koulutusmuoto);
    assert.ok(await $("h1").exists());
    assert.equal(await $("h1").text(), koulutusmuoto);
  }
);

step(
  "Siirry koulutusmuodon avoimiin asioihin sivulla olevan linkin <linkinTeksti> kautta",
  async linkinTeksti => {
    await click(linkinTeksti);
    assert.ok(await $("h1").exists());
    assert.equal(await $("h1").text(), linkinTeksti);
  }
);

step(
  "Siirry päätettyihin asioihin klikkaamalla asianhallintasivun välilehteä <tabText>",
  async tabText => {
    await click(tabText);
  }
);

step("Tarkista, että urlissa lukee <teksti>", async teksti => {
  assert.include(await currentURL(), teksti, "URL OK");
});

step("Scroll to text <teksti>", async teksti => {
  await scrollTo(teksti);
});

step("Vaihda kieleksi <locale>", async locale => {
  await click(locale);
});

step("Navigate to Lukiokoulutus", async () => {
  click(link({ href: "https://localhost:4433/lukiokoulutus" }));
  assert.ok(await text("Tulossa vuoden 2020 aikana").exists());
});

step("Navigate to Vapaa sivistystyö", async () => {
  click(link({ href: "/vapaa-sivistystyo" }));
  assert.ok(await text("Tulossa vuoden 2020 aikana").exists());
});

step("Set view port to <width> x <height>", async (width, height) => {
  await setViewPort({ width: parseInt(width), height: parseInt(height) });
});
