import {defineMessages} from "react-intl";

export default defineMessages({
  statistics: {
    id: "common.statistics",
    defaultMessage: "Tilastot"
  },
  applyFor: {
    id: "common.applyFor",
    defaultMessage: "Haettava"
  },
  difference: {
    id: "common.difference",
    defaultMessage: "Muutos"
  },
  undo: {
    id: "common.undo",
    defaultMessage: "Peruuta muutokset"
  },
  loading: {
    id: "common.loading",
    defaultMessage: "Ladataan"
  },
  ok: {
    id: "common.ok",
    defaultMessage: "Ok"
  },
  clear: {
    id: "common.clear",
    defaultMessage: "Tyhjennä"
  },
  cancel: {
    id: "common.cancel",
    defaultMessage: "Peruuta"
  },
  today: {
    id: "common.today",
    defaultMessage: "Tänään"
  },
  datemax: {
    id: "common.datemax",
    defaultMessage: "Päiväys on liian suuri"
  },
  datemin: {
    id: "common.datemin",
    defaultMessage: "Päiväys on liian pieni"
  },
  dateinvalid: {
    id: "common.dateinvalid",
    defaultMessage: "Päiväys on virheellinen"
  },
  attachmentInfo: {
    id: "common.attachmentInfo",
    defaultMessage:
      "Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muista merkitä salassa pidettävät liitteet."
  },
  attachmentNone: {
    id: "common.attachmentNone",
    defaultMessage: "Ei lisättyjä liitteitä"
  },
  attachmentError: {
    id: "common.attachmentError",
    defaultMessage:
      "Valitsemaasi liitettä ei voi lisätä hakemukseen, tarkista sen koko ja tyyppi"
  },
  attachmentAdd: {
    id: "common.attachmentAdd",
    defaultMessage: "Lisää liite"
  },
  attachmentRemove: {
    id: "common.attachmentRemove",
    defaultMessage: "Poista liite"
  },
  attachmentSecret: {
    id: "common.attachmentSecret",
    defaultMessage: "Salainen liite"
  },
  attachmentSecretSelect: {
    id: "common.attachmentSecretSelect",
    defaultMessage: "Merkitse liite salaiseksi"
  },
  attachmentSecretUnselect: {
    id: "common.attachmentSecretUnselect",
    defaultMessage: "Merkitse liite julkiseksi"
  },
  attachmentName: {
    id: "common.attachmentName",
    defaultMessage: "Liitteen nimi *"
  },
  attachmentErrorName: {
    id: "common.attachmentErrorName",
    defaultMessage: "Nimi on pakollinen"
  },
  attachmentDownload: {
    id: "common.attachmentDownload",
    defaultMessage: "Lataa liite tietokoneelle"
  },
  loginError: {
    id: "common.loginError",
    defaultMessage: "Kirjautumisessa tapahtui virhe"
  },
  welcome: {
    id: "common.welcome",
    defaultMessage: "Tervetuloa Oiva-palveluun"
  },
  fetchFailure: {
    id: "common.fetchFailure",
    defaultMessage: "Tietoja ei voitu noutaa."
  },
  fetchFailureAuthInfo: {
    id: "common.fetchFailureAuthInfo",
    defaultMessage: "Tämä voi johtua siitä, ettet ole kirjautunut sisään."
  },
  application: {
    id: "common.application",
    defaultMessage: "Hakemus"
  },
  attachment: {
    id: "common.attachement",
    defaultMessage: "Liite"
  },
  secretAttachment: {
    id: "common.secretAttachement",
    defaultMessage: "Salainen liite"
  },
  asiat: {
    id: "common.asiat",
    defaultMessage: "Asia"
  },
  asiatOpen: {
    id: "common.asiatOpen",
    defaultMessage: "Avoimet asiat"
  },
  document: {
    id: "common.document",
    defaultMessage: "Asiakirja"
  },
  author: {
    id: "common.author",
    defaultMessage: "Laatija"
  },
  documentStatus: {
    id: "common.documentStatus",
    defaultMessage: "Asiakirjan tila"
  },
  sent: {
    id: "common.sent",
    defaultMessage: "Lähetetty"
  },
  edit: {
    id: "common.edit",
    defaultMessage: "Täydennä hakemusta"
  },
  change: {
    id: "common.change",
    defaultMessage: "Järjestämisluvan muutos"
  },
  stateAsia: {
    id: "common.stateAsia",
    defaultMessage: "Asian tila"
  },
  functions: {
    id: "common.functions",
    defaultMessage: "Toiminnot"
  },
  hakemusAsiakirjat: {
    id: "common.hakemusAsiakirjat",
    defaultMessage: "Hakemuksen asiakirjat"
  },
  backFromAsiakirjat: {
    id: "common.backFromAsiakirjat",
    defaultMessage: "Takaisin Järjestämislupa asiat -taulukkoon"
  },
  newHakemus: {
    id: "common.newHakemus",
    defaultMessage: "Tee uusi hakemus"
  },
  tietoaTulevanJulkaisunAjankohdasta: {
    id: "common.tietoaTulevanJulkaisunAjankohdasta",
    defaultMessage: "Tulossa vuoden 2020 aikana"
  },
  siteShortDescription: {
    id: "common.siteShortDescription",
    defaultMessage: "Opetushallinnon ohjaus- ja säätelypalvelu"
  },
  sort: {
    id: "common.sort",
    defaultMessage: "Järjestä sarakkeen mukaan"
  },
  frontpage: {
    id: "common.frontpage",
    defaultMessage: "Etusivu"
  },
  asiaTable: {
    headers: {
      asianumero: {id: "asiaTable.headers.asianumero", defaultMessage: "Asianumero"},
      tila: {id: "asiaTable.headers.tila", defaultMessage: "Tila"},
      asia: {id: "asiaTable.headers.asia", defaultMessage: "Asia"},
      asiakas: {id: "asiaTable.headers.asiakas", defaultMessage: "Asiakkaan nimi"},
      maakunta: {id: "asiaTable.headers.maakunta", defaultMessage: "Maakunta"},
      saapunut: {id: "asiaTable.headers.saapunut", defaultMessage: "Saapunut"},
      hakupvm: {id: "asiaTable.headers.hakupvm", defaultMessage: "Haettu voimaantulo"},
      actions: {id: "asiaTable.headers.actions", defaultMessage: "Toiminnot"},
    },
    actions: {
      handle: {id: "asiaTable.actions.handle", defaultMessage: "Ota valmisteluun"}
    }
  },
  asiaStates: {
    kj: {
      LUONNOS: {id: "asiaStates.kj.LUONNOS", defaultMessage: "Luonnos"},
      AVOIN: {id: "asiaStates.kj.AVOIN", defaultMessage: "Lähetetty"},
      VALMISTELUSSA: {id: "asiaStates.kj.VALMISTELUSSA", defaultMessage: "Lähetetty"},
      TAYDENNETTAVA: {id: "asiaStates.kj.TAYDENNETTAVA", defaultMessage: "Täydennettävä"},
      PAATETTY: {id: "asiaStates.kj.PAATETTY", defaultMessage: "Päätetty"},
      PASSIVOITU: {id: "asiaStates.kj.PASSIVOITU", defaultMessage: "Poistettu"}
    },
    esittelija: {
      LUONNOS: {id: "asiaStates.esittelija.LUONNOS", defaultMessage: "Luonnos"},
      AVOIN: {id: "asiaStates.esittelija.AVOIN", defaultMessage: "Saapunut"},
      VALMISTELUSSA: {id: "asiaStates.esittelija.VALMISTELUSSA", defaultMessage: "Valmistelussa"},
      TAYDENNETTAVA: {id: "asiaStates.esittelija.TAYDENNETTAVA", defaultMessage: "Täydennettävä"},
      PAATETTY: {id: "asiaStates.esittelija.PAATETTY", defaultMessage: "Päätetty"},
      PASSIVOITU: {id: "asiaStates.esittelija.PASSIVOITU", defaultMessage: "Poistettu"}
    }
  },
  asiaTypes: {
    lupaChange: {id: "asiaTypes.lupaChange", defaultMessage: "Järjestämisluvan muutos"}
  },
  current: {
    id: "common.current",
    defaultMessage: "Nykyinen"
  },
  toBeAdded: {
    id: "common.toBeAdded",
    defaultMessage: "Lisättävä"
  },
  toBeRemoved: {
    id: "common.toBeRemoved",
    defaultMessage: "Poistettava"
  }
});
