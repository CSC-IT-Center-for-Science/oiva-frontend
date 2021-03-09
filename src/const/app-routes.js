export const AppRoute = {
  AmmatillinenKoulutus: "routes.ammatillinenKoulutus",
  Asia: "routes.asia",
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
  Jarjestamislupa: "routes.jarjestamislupa",
  Jarjestamislupaasiat: "routes.jarjestamislupaasiat",
  Koulutustoimijat: "routes.koulutustoimijat",
  KoulutusmuodonEtusivu: "routes.koulutusmuodonEtusivu",
  getKoulutusmuodonEtusivu: params => ({
    key: "routes.koulutusmuodonEtusivu",
    params
  }),
  LogIn: "routes.logIn",
  LogOut: "routes.logOut",
  Lukiokoulutus: "routes.lukiokoulutus",
  OmatTiedot: "routes.omatTiedot",
  Paatokset: "routes.paatokset",
  Saavutettavuusseloste: "routes.saavutettavuusseloste",
  Tilastot: "routes.tilastot",
  UusiHakemus: "routes.uusiHakemus",
  Hakemus: "routes.hakemus",
  VapaaSivistystyo: "routes.vapaaSivistystyo",
  Yhteydenotto: "routes.yhteydenotto"
};

export const AppRouteTitles = {
  home: new Map([[AppRoute.Home, "common.oiva"]]),
  navigation: new Map([
    [
      AppRoute.JarjestamisJaYllapitamisluvat,
      "common.jarjestamisJaYllapitamisluvat"
    ],
    [AppRoute.Tilastot, "common.statistics"],
    [AppRoute.KoulutusmuodonEtusivu, "education.preAndBasicEducation"],
    [AppRoute.KoulutusmuodonEtusivu, "education.highSchoolEducation"],
    [AppRoute.KoulutusmuodonEtusivu, "education.vocationalEducation"],
    [AppRoute.KoulutusmuodonEtusivu, "common.vstTitleName"]
  ])
};
