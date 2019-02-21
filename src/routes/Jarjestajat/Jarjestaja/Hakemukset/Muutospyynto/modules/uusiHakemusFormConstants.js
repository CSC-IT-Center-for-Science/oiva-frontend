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

export const HAKEMUS_VIRHE = {
  HEADER: {
    FI: 'Muutospyyntöä ei voida tehdä',
    SV: 'På Svenska'
  },
  PERUSTELU: {
    FI: 'Muutosperusteluita ladattaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  VANKILA: {
    FI: 'Vankilalistausta ladattaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  VANKILA: {
    FI: 'Vankilalistausta ladattaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  ELY: {
    FI: 'ELY-keskuslistausta ladattaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  PAATOSKIERROS: {
    FI: 'Päätoskierroksia ladattaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  PAATOSKIERROS: {
    FI: 'Päätoskierroksia ladattaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  LUVANLATAUS: {
    FI: 'Lupaa haettaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  MUUTOSPYYNTO: {
    FI: 'Muutospyyntöä ladattaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  HAKEMUKSIENNLATAUS: {
    FI: 'Hakemuksia haettaessa tapahtui virhe.',
    SV: 'På Svenska'
  },
  OIKEUS: {
    FI: 'Sinulla ei ole oikeuksia katsoa toisen organisaation hakemuksia',
    SV: 'På Svenska'
  }
}

export const HAKEMUS_VIESTI = {
  VARMISTUS_HEADER: {
    FI: 'Poistuminen muutoshakemuksen teosta',
    SV: 'På Svenska'
  },
  VARMISTUS: {
    FI: 'Oletko varma, että haluat poistua muutoshakemuksen luonnista? Tekemiäsi muutoksia ei tallenneta.',
    SV: 'På Svenska'
  },
  KIRJAUTUMINEN: {
    FI: 'Uuden hakemuksen tekeminen vaatii kirjautumisen palveluun',
    SV: 'På Svenska'
  },
  KYLLA: {
    FI: 'Kyllä',
    SV: 'Ja'
  },
  EI: {
    FI: 'Ei',
    SV: 'Nej'
  }
}

export const HAKEMUS_OTSIKOT = {
  UUSI_MUUTOSHAKEMUS: {
    FI: 'Uusi muutoshakemus',
    SV: 'På Svenska'
  },
  MUUTOKSET: {
    FI: 'Uusi muutoshakemus',
    SV: 'På Svenska'
  },
  PERUSTELUT: {
    FI: 'Perustelut',
    SV: 'På Svenska'
  },
  EDELLYTYKSET: {
    FI: 'Taloudelliset edellytykset',
    SV: 'På Svenska'
  },
  YHTEENVETO: {
    FI: 'Yhteenveto',
    SV: 'På Svenska'
  },
}

export const COMPONENT_TYPES = {
  MUUTOS: 'muutos',
  MUUTOS_YHTEENVETO: 'muutosYhteenveto'
}
