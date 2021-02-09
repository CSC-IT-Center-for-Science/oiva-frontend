export const AppRoute = {
  AmmatillinenKoulutus: "routes.ammatillinenKoulutus",
  Asianhallinta: "routes.asianhallinta",
  AsianhallintaAvoimet: "routes.asianhallintaAvoimet",
  AsianhallintaAvoimetPath: "routes.asianhallintaAvoimetPath",
  AsianhallintaPaatetyt: "routes.asianhallintaPaatetyt",
  CasAuth: "routes.casAuth",
  CasLogOut: "routes.casLogOut",
  CasReady: "routes.casReady",
  EsiJaPerusopetus: "routes.esiJaPerusopetus",
  Home: "routes.home",
  JarjestamisJaYllapitamisluvat: "routes.jarjestamisJaYllapitamisluvat",
  KoulutuksenJarjestajat: "routes.koulutuksenJarjestajat",
  getKoulutusmuodonEtusivu: params => ({
    key: "routes.koulutusmuodonEtusivu",
    params
  }),
  LogIn: "routes.logIn",
  LogOut: "routes.logOut",
  Lukiokoulutus: "routes.lukiokoulutus",
  Saavutettavuusseloste: "routes.saavutettavuusseloste",
  Tietosuojailmoitus: "routes.tietosuojailmoitus",
  Tilastot: "routes.tilastot",
  UusiHakemus: "routes.uusiHakemus",
  Hakemus: "routes.hakemus",
  VapaaSivistystyo: "routes.vapaaSivistystyo",
  Yhteydenotto: "routes.yhteydenotto"
};

export const AppRouteTitles = {
  home: new Map([[AppRoute.Home, "common.oiva"]]),
  navigation: {
    level1: new Map([
      [
        AppRoute.JarjestamisJaYllapitamisluvat,
        "common.jarjestamisJaYllapitamisluvat"
      ],
      [AppRoute.Tilastot, "common.statistics"]
    ]),
    level2: new Map([
      [AppRoute.KoulutusmuodonEtusivu, "education.preAndBasicEducation"],
      [AppRoute.KoulutusmuodonEtusivu, "education.highSchoolEducation"],
      [AppRoute.KoulutusmuodonEtusivu, "education.vocationalEducation"],
      [AppRoute.KoulutusmuodonEtusivu, "common.vstTitleName"]
    ])
  }
};

// export const AppRouteTitles = new Map([
//   [AppRoute.CasAuth, "common.oiva"],
//   [AppRoute.CasLogOut, "common.oiva"],
//   [AppRoute.CasReady, "common.oiva"],
//   [AppRoute.LogIn, "auth.logIn"],
//   [AppRoute.LogOut, "auth.logOut"],
//   [AppRoute.Saavutettavuusseloste, "common.saavutettavuusseloste"],
//   [AppRoute.Tietosuojailmoitus, "common.tietosuojailmoitus"],
//   [AppRoute.Tilastot, "common.statistics"],
//   [AppRoute.VapaaSivistystyo, "common.vstTitleName"],
//   [AppRoute.Yhteydenotto, "common.yhteydenotto"]
// ]);
