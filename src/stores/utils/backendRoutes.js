/**
 * The comprehensive list of the backend routes.
 * Format: { key: url, ... }
 * Example: { luvat: api/luvat/jarjestajilla, ... }
 */
export const backendRoutes = {
  elykeskukset: { path: `koodistot/koodit/elykeskukset` },
  kayttaja: { path: `auth/me` },
  kielet: { path: `koodistot/kielet` },
  kohteet: { path: `kohteet` },
  tutkinnot: { path: `koodistot/ammatillinen/tutkinnot` },
  koulutuksetMuut: { path: `koodistot/koodit/` },
  koulutus: { path: `koodistot/koodi/koulutus/` },
  koulutusalat: { path: `koodistot/koulutusalat/` },
  koulutustyypit: { path: `koodistot/koulutustyypit/` },
  kunnat: { path: `koodistot/kunnat` },
  lupa: { path: `luvat/jarjestaja/` },
  lupahistoria: { path: `luvat/historia/` },
  luvat: { path: `luvat/jarjestajilla` },
  maakunnat: { path: `koodistot/maakunnat` },
  maakuntakunnat: { path: `koodistot/maakuntakunta` },
  maaraystyypit: { path: `maaraykset/maaraystyypit` },
  muut: {
    path: `koodistot/koodit/oivamuutoikeudetvelvollisuudetehdotjatehtavat`
  },

  // Muutospyynnöt
  lahetaMuutospyynto: { path: "muutospyynnot/tila/avoin/" },
  muutospyynnonLiitteet: { path: "muutospyynnot/", postfix: "/liitteet/" },
  muutospyynnot: { path: "muutospyynnot/" },
  muutospyynto: { path: "muutospyynnot/id/" },
  muutospyyntoPaatetyksi: { path: "muutospyynnot/tila/paatetty/" },
  muutospyyntoEsittelyyn: { path: "muutospyynnot/tila/esittelyssa/" },
  muutospyyntoValmisteluun: { path: "muutospyynnot/tila/valmistelussa/" },
  poistaMuutospyynto: { path: "muutospyynnot/" },
  tallennaMuutospyynto: { path: "muutospyynnot/tallenna" },
  tallennaMuutospyyntoEsittelijanToimesta: {
    path: "muutospyynnot/esittelija/tallenna"
  },
  tarkistaDuplikaattiAsianumero: { path: "muutospyynnot/duplikaattiasianumero" },

  oivamuutoikeudetvelvollisuudetehdotjatehtavat: {
    path: `koodistot/koodit/oivamuutoikeudetvelvollisuudetehdotjatehtavat`
  },
  oivaperustelut: { path: `koodistot/koodit/oivaperustelut` },
  opetuskielet: { path: `koodistot/opetuskielet` },
  organisaatio: { path: `organisaatiot/` },
  paatoskierrokset: { path: `paatoskierrokset/open` },
  vankilat: { path: `koodistot/koodit/vankilat` },
  liitteet: { path: `liitteet/`, abortController: false },
  kaannokset: { path: "lokalisaatio" },

  organisaatiot: { path: "luvat/organisaatiot" }
};
