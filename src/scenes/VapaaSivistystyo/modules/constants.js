import common from '../../../i18n/definitions/common'

export const GENERIC_LUPA_SECTIONS = [
  'kunnat',
  'kielet',
  'tarkoitus',
  'koulutustehtava',
  'opiskelijavuodet',
  'oppilaitos',
  'opiskelijamaara',
  'muut'
];

export const VST_LUPA_STRUCTURE = [
  // 1. Ylläpitäjän nimi ja kotipaikka
  // First Section in the resulting view is based on Järjestäjä data, not lupamääräys,
  {
    // 2. Sopimuskunnat
    // exceptional case requiring special parsing
    titleMessageKey: common.VSTLupaSectionTitleMunicipality,
    kohdeTunniste: 'kunnat'
  },
  {
    // 3. Oppilaitoksen nimi ja sijainti
    // exceptional case requiring special parsing
    titleMessageKey: common.VSTLupaSectionTitleSchoolNameAndLocation,
    kohdeTunniste: 'oppilaitos'
  },
  {
    // 4. Oppilaitoksen toiminta-alue
    // exceptional case requiring special parsing
    titleMessageKey: common.VSTLupaSectionTitleOperationalArea,
    koodisto: 'vstoppilaitoksenalueellisuusjavaltakunnallisuus'
  },
  {
    // 5. Opetuskieli
    titleMessageKey: common.VSTLupaSectionTitleTeachingLanguage,
    kohdeTunniste: 'kielet'
  },
  {
    // 6. Oppilaitoksen tarkoitus
    titleMessageKey: common.VSTLupaSectionTitleSchoolPurpose,
    kohdeTunniste: 'tarkoitus'
  },
  {
    // 7. Koulutustehtävä
    titleMessageKey: common.VSTLupaSectionTitleSchoolMission,
    kohdeTunniste: 'koulutustehtava'
  },
  {
    // 8. Koulutustehtävä
    titleMessageKey: common.VSTLupaSectionTitleSchoolMissionSpecial,
    kohdeTunniste: 'erityinenkoulutustehtava'
  },
  {
    // 9. Muut koulutuksen järjestämiseen liittyvät ehdot
    // exceptional case requiring special parsing
    titleMessageKey: common.VSTLupaSectionTitleOther,
    koodisto: 'kujamuutoikeudetmaarayksetjarajoitukset'
  }
];
