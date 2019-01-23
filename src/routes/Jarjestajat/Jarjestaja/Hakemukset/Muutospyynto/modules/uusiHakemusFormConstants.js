export const FORM_NAME_UUSI_HAKEMUS = 'uusiHakemus'

export const FIELD_ARRAY_NAMES = {
  TUTKINNOT_JA_KOULUTUKSET: 'tutkinnotjakoulutukset',
  OPETUS_JA_TUTKINTOKIELET: 'opetusjatutkintokielet',
  TOIMINTA_ALUEET: 'toimintaalueet',
  OPISKELIJAVUODET: 'opiskelijavuodet',
  TALOUDELLISET: 'taloudelliset',
  MUUT: 'muutmuutokset',
  HAKIJAN_TIEDOT: 'hakijantiedot'
}

export const FIELDS = {
  TILA: {
    NAME: 'tila',
    VALUES: {
      LUONNOS: 'LUONNOS',
      AVOIN: 'AVOIN',
      VALMISTELUSSA: 'VALMISTELUSSA',
      TAYDENNETTAVA: 'TAYDENNETTAVA',
      PAATETTY: 'PAATETTY',
      PASSIVOITU: 'PASSIVOITU'
    }
  }
}

export const MUUTOS_TYPES = {
  ADDITION: 'addition',
  REMOVAL: 'removal',
  CHANGE: 'change'
}

export const MUUTOS_TILAT = {
  MUUTOS: 'MUUTOS',
  LISAYS: 'LISAYS',
  POISTO: 'POISTO'
}

export const OPISKELIJAVUODET_KATEGORIAT = {
  SISAOPPILAITOS: 'sisaoppilaitos',
  VAATIVA: 'vaativa',
  VAHIMMAISOPISKELIJAVUODET: 'vahimmaisopiskelijavuodet'
}

export const MUUTOS_TYPE_TEXTS = {
  ADDITION: {
    FI: 'Lisäys',
    SV: 'På Svenska'
  },
  REMOVAL: {
    FI: 'Poisto',
    SV: 'På Svenska'
  },
  CHANGE: {
    FI: 'Muutos',
    SV: 'På Svenska'
  }
}

export const COMPONENT_TYPES = {
  MUUTOS: 'muutos',
  MUUTOS_YHTEENVETO: 'muutosYhteenveto'
}
