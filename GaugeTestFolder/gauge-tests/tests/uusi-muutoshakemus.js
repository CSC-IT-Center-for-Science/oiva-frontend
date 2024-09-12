const {
  openBrowser,
  goto,
  click,
  write,
  press,
  setViewPort,
  closeBrowser,
  focus,
  $,
  scrollTo,
  scrollDown
} = require("taiko");
(async () => {
  try {
    await openBrowser();
    await goto("localhost");
    await click("Kirjaudu sisään");
    await click("Jatka kirjautumiseen");
    await write("oiva-essi");
    await press("Tab");
    await write("oiva-essi");
    await click("Kirjaudu");
    await setViewPort({ width: 1600, height: 1200 });
    await setViewPort({ width: 2600, height: 1200 });
    await click("Järjestämis- ja ylläpitämisluvat");
    await click("Esi- ja perusopetus");
    await click("Asianhallinta");
    await click("Luo uusi asia");
    await click("Valitse...");
    await click("Pornaisten kunta");
    await click("Hyväksy");
    await focus("asianumero");
    await focus("asianumero");
    await write($(`[id="paatoksentiedot.asianumero.A"]`).text("VS"));
    await focus($(`[id="paatoksentiedot.asianumero.A"]`));
    await write("VN/0001/0005");
    await scrollTo("1. Opetus, jota lupa koskee");
    await scrollDown($('[class*="MuiDialogContent-root"]'), 600);
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
