import _ from "lodash"
import { getMuutosperusteluObjectById, getTutkintoKoodiByMaaraysId } from "./koulutusUtil"
import { parseLocalizedField } from "../../../../../../modules/helpers"
import dateformat from "dateformat"
import store from "../../../../../../store"
import { MUUTOS_TILAT, MUUTOS_TYPES } from "./uusiHakemusFormConstants"
import { KOHTEET } from "../../../modules/constants"

export function formatMuutospyynto(muutospyynto) {

  const {
    diaarinumero,
    jarjestajaOid,
    jarjestajaYtunnus,
    luoja,
    luontipvm,
    lupaUuid,
    tila,
    uuid,
    tutkinnotjakoulutukset = [],
    opetusjatutkintokielet = [],
    toimintaalueet = [],
    opiskelijavuodet = [],
    muutmuutokset = [],
    hakija = []
  } = muutospyynto

  let muutokset = [
    ...formatMuutosArray(tutkinnotjakoulutukset),
    ...formatMuutosArray(opetusjatutkintokielet),
    ...formatMuutosArray(toimintaalueet),
    ...formatMuutosArray(opiskelijavuodet),
    ...formatMuutosArray(muutmuutokset)
  ]


  return {
    diaarinumero,
    jarjestajaOid,
    jarjestajaYtunnus,
    luoja,
    luontipvm,
    lupaUuid,
    uuid,
    paatoskierros: getDefaultPaatoskierros(),
    tila,
    paivittaja: "string",
    paivityspvm: null,
    voimassaalkupvm: "2018-01-01",
    voimassaloppupvm: "2018-12-31",
    meta: hakija,
    muutokset: muutokset
  }
}

function formatMuutosArray(muutokset) {
  if (!muutokset) {
    return []
  }

  return _.map(muutokset, muutos => _.assignIn({}, muutos, {
    tila:
      muutos.type === MUUTOS_TYPES.ADDITION ? MUUTOS_TILAT.LISAYS :
      muutos.type === MUUTOS_TYPES.REMOVAL ? MUUTOS_TILAT.POISTO :
      muutos.type === MUUTOS_TYPES.CHANGE ? MUUTOS_TILAT.MUUTOS :
      null
  }))
}

function getDefaultPaatoskierros() {
  const state = store.getState()

  const { paatoskierrokset } = state

  if (paatoskierrokset && paatoskierrokset.data) {
    const pkierrosObj = _.find(paatoskierrokset.data, pkierros => {
      if (pkierros.meta && pkierros.meta.nimi && pkierros.meta.nimi.fi) {
        if (pkierros.id === 19) {
          return pkierros
        }
      }
    })

    if (pkierrosObj) {
      return { uuid: pkierrosObj.uuid }
    }
  }

  return undefined
}

export function getJarjestajaData(state) {
  let username = "oiva-default"
  if (state.user && state.user.fetched) {
    username = state.user.user.username
  } else {
    username = sessionStorage.getItem('username')
  }

  if (state.lupa && state.lupa.fetched && state.paatoskierrokset && state.paatoskierrokset.fetched) {
    const { data } = state.lupa
    const {
      uuid,
      diaarinumero,
      jarjestajaYtunnus,
      jarjestajaOid
    } = data

    const now = dateformat(new Date(), "yyyy-mm-dd")

    return {
      diaarinumero,
      // hakupvm: now, // kun siirretään käsittelyyn
      jarjestajaOid,
      jarjestajaYtunnus,
      luoja: username,
      luontipvm: now,
      lupaUuid: uuid,
      paatoskierrosId: null,
      paivityspvm: now,
      tila: "LUONNOS",
      voimassaalkupvm: null,
      voimassaloppupvm: null,
      muutokset: [],
      meta: {}
    }
  }
}

export function getBaseJarjestajaData(state) {
  let username = "oiva-default"
  if (state.user && state.user.fetched) {
    username = state.user.user.username
  } else {
    username = sessionStorage.getItem('username')
  }

  if (state.lupa && state.lupa.fetched && state.paatoskierrokset && state.paatoskierrokset.fetched) {
    const { data } = state.lupa
    const {
      uuid,
      diaarinumero,
      jarjestajaYtunnus,
      jarjestajaOid
    } = data

    const now = dateformat(new Date(), "yyyy-mm-dd")

    return {
      diaarinumero,
      // hakupvm: now, // kun siirretään käsittelyyn
      jarjestajaOid,
      jarjestajaYtunnus,
      // luoja: username,
      // luontipvm: now,
      // lupaUuid: uuid,
      paatoskierrosId: null,
      // paivityspvm: now,
      // voimassaalkupvm: null,
      // voimassaloppupvm: null,
      meta: {}
    }
  }
}

function getHakija(meta) {
  if (!meta) {
    return
  }

  const { nimi, puhelin, email, hyvaksyjat, haettupvm } = meta
  return {
    nimi,
    puhelin,
    email,
    hyvaksyjat,
    haettupvm
  }
}

export function loadFormData(state, muutosdata, formValues) {
  console.log('loadFormData')
  console.log(state)
  console.log(muutosdata)

  const {
    voimassaalkupvm,
    voimassaloppupvm,
    tila,
    luoja,
    luontipvm,
    meta,
    lupaUuid,
    uuid,
    paatoskierros,
    muutokset
  } = muutosdata

  let hakija = getHakija(meta)
  if (formValues) {
    if (formValues.hakija) {
      hakija = formValues.hakija
    }
  }

  let initialData = getBaseJarjestajaData(state)

  initialData = {
    ...initialData,
    voimassaalkupvm,
    voimassaloppupvm,
    tila,
    luoja,
    luontipvm,
    hakija,
    lupaUuid,
    uuid,
    paatoskierros
  }

  // formatoi muutokset


  if (state.kohteet && state.kohteet.fetched) {
    const kohteet = state.kohteet.data

    // 1. Tutkinnot ja koulutukset
    const tutkinnotKohde = _.find(kohteet, kohde => {
      return kohde.tunniste === KOHTEET.TUTKINNOT
    })

    if (tutkinnotKohde) {
      initialData[KOHTEET.TUTKINNOT] = getMuutosArray(muutokset, tutkinnotKohde.uuid)
    }
  }

  console.log(initialData)

  return initialData
}

function getMuutosArray(muutokset, kohdeUuid) {
  if (!muutokset || !kohdeUuid) {
    return
  }

  let results = _.filter(muutokset, muutos => {
    if (muutos.kohde) {
      return muutos.kohde.uuid === kohdeUuid
    }
  })

  _.forEach(results, muutos => {
    const tyyppi =
      muutos.tila === MUUTOS_TILAT.LISAYS ? MUUTOS_TYPES.ADDITION :
      muutos.tila === MUUTOS_TILAT.POISTO ? MUUTOS_TYPES.REMOVAL :
      muutos.tila === MUUTOS_TILAT.MUUTOS ? MUUTOS_TYPES.CHANGE :
      null
    _.extend(muutos, { type: tyyppi })
  })

  return results
}

export function hasFormChanges(formValues) {
  if (formValues) {
    const { tutkinnotjakoulutukset, opetusjatutkintokielet, toimintaalueet, opiskelijavuodet, muutmuutokset } = formValues

    if (tutkinnotjakoulutukset && tutkinnotjakoulutukset.length > 0) {
      return true
    } else if (opetusjatutkintokielet && opetusjatutkintokielet.length > 0) {
      return true
    } else if (toimintaalueet && toimintaalueet.length > 0) {
      return true
    } else if (opiskelijavuodet && opiskelijavuodet.length > 0) {
      return true
    } else if (muutmuutokset && muutmuutokset.length > 0) {
      return true
    }
  }

  return false
}

export function getMaaraystyyppiByTunniste(tunniste) {
  const state = store.getState()

  if (state.maaraystyypit && state.maaraystyypit.fetched) {
    const maaraystyypit = state.maaraystyypit.data
    return _.find(maaraystyypit, maaraystyyppi => {
      return maaraystyyppi.tunniste.toLowerCase() === tunniste.toLowerCase()
    })
  }
}

export function getKohdeByTunniste(tunniste) {
  const state = store.getState()

  if (state.kohteet && state.kohteet.fetched) {
    const kohteet = state.kohteet.data
    return _.find(kohteet, kohde => {
      return kohde.tunniste.toLowerCase() === tunniste.toLowerCase()
    })
  }
}
