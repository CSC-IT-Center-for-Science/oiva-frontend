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
  ELY: {
    FI: 'ELY-keskuslistausta ladattaessa tapahtui virhe.',
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
  },
  LIITE: {
    FI: 'Valitsemaasi liitettä ei voi lisätä hakemukseen, tarkista sen koko ja tyyppi',
    SV: 'På Svenska'
  },
  TOIMINTAALUE: {
    FI: 'Toiminta-aluetta ladattaessa tapahtui virhe',
    SV: 'Samma på svenska'
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
  },
  LIITE_LISATTY: {
    FI: 'Liite lisätty',
    SV: 'LIITE_LISATTY'
  },
  TOIMINTAALUE_EI_MAARITETTY: {
    FI: 'Toiminta-aluetta ei määritetty',
    SV: 'På svenska'
  },
  TIEDOSTON_NIMI: {
    FI: 'Liitteen nimi *',
    SV: 'TIEDOSTON_NIMI'
  },
  OK: {
    FI: 'OK',
    SV: 'OK'
  },
  PERUUTA: {
    FI: 'Peruuta',
    SV: 'PERUUTA'
  },
  TIEDOSTO_NIMI_ERROR: {
    FI: 'Nimi on pakkollinen',
    SV: 'TIEDOSTO_NIMI_ERROR'
  },
  TALLENNUS_ERROR: {
    FI: 'Tallennus epäonnistui. Yritä tallennusta uudelleen hetken kuluttua. Virheen toistuessa ota yhteyttä pääkäyttäjään.',
    SV: 'TALLENNUS_ERROR'
  },
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
  LIITE_HEADER: {
    FI: 'Liitteet',
    SV: 'På Svenska'
  },
  LIITE_YLEISET_HEADER: {
    FI: 'Hakemuksen yleiset liitteet',
    SV: 'På Svenska'
  },
  LIITE_OHJE: {
    FI: 'Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet.',
    SV: 'På Svenska'
  },
  LIITE_YHTEENVETO_OHJE: {
    FI: 'Liittäkää asiakirja tai asiakirjat, joista ilmenee hakemuksen hyväksyntä tai hyväksyjän päätösvalta (esim. hyväksyjän allekirjoitusoikeus ja päättävän elimen kokouksen pöytäkirjanote).',
    SV: 'På Svenska'
  },
  LISAA_LIITE: {
    FI: 'Lisää liite',
    SV: 'På Svenska'
  },
  POISTA_LIITE: {
    FI: 'Poista liite',
    SV: 'På Svenska'
  },
  VALTAKUNNALLINEN: {
    FI: 'Koulutuksen järjestäjällä on velvollisuus järjestää tutkintoja ja koulutusta Ahvenanmaan maakuntaa lukuunottamatta koko Suomen osaamis- ja koulutustarpeeseen.',
    SV: 'På svenska',
  },
  SALAINEN_LIITE: {
    FI: 'Salainen liite',
    SV: 'På Svenska'
  },
  SALAINEN_LIITE_VALINTA: {
    FI: 'Merkitse liite salaiseksi',
    SV: 'På Svenska'
  },
  SALAINEN_LIITE_VALINTA_POISTA: {
    FI: 'Merkitse liite julkiseksi',
    SV: 'På Svenska'
  },
  EI_MUUTOKSIA: {
    FI: 'Ei muutoksia.',
    SV: 'På Svenska'
  }
}

export const COMPONENT_TYPES = {
  MUUTOS: 'muutos',
  MUUTOS_YHTEENVETO: 'muutosYhteenveto'
}

export const HAKEMUS_OHJEET = {
  TOIMINTAALUE: {
    FI: 'Tähän lyhyt ohjeteksti kohteen täyttämisestä',
    SV: 'På svenska'
  },
  TOIMINTAALUE_VALINTA: {
    FI: 'Tähän lyhyt ohjeteksti toimialueiden valintaan liittyen',
    SV: 'På svenska'
  },
  VALTAKUNNALLINEN: {
    FI: 'Tähän lyhyt ohjeteksti valtakunnallisen valintaan liittyen',
    SV: 'På svenska'
  }
}
