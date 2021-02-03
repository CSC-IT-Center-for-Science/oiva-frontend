export const AppRoute = {
  AmmatillinenKoulutus: "routes.ammatillinenKoulutus",
  CasAuth: "routes.casAuth",
  CasLogOut: "routes.casLogOut",
  CasReady: "routes.casReady",
  EsiJaPerusopetus: "routes.esiJaPerusopetus",
  Home: "routes.home",
  JarjestamisJaYllapitamisluvat: "routes.jarjestamisJaYllapitamisluvat",
  LogIn: "routes.logIn",
  LogOut: "routes.logOut",
  Lukiokoulutus: "routes.lukiokoulutus",
  Saavutettavuusseloste: "routes.saavutettavuusseloste",
  Tietosuojailmoitus: "routes.tietosuojailmoitus",
  Tilastot: "routes.tilastot",
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
      [AppRoute.EsiJaPerusopetus, "education.preAndBasicEducation"],
      [AppRoute.Lukiokoulutus, "education.highSchoolEducation"],
      [AppRoute.AmmatillinenKoulutus, "education.vocationalEducation"],
      [AppRoute.VapaaSivistystyo, "common.vstTitleName"]
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
