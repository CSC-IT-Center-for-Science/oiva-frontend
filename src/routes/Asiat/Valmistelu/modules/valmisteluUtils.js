import _ from 'lodash'
import dateformat from 'dateformat'
import store from '../../../../store'
import { parseLocalizedField } from "../../../../modules/helpers"
import { KOHTEET } from "../../../Jarjestajat/Jarjestaja/modules/constants"
import {
  MUUTOS_TILAT,
  MUUTOS_TYPES
} from "../../../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/uusiHakemusFormConstants"

export function getKoulutusAlat() {
  const state = store.getState()

  if (state.koulutusalat && state.koulutusalat.fetched) {
    return state.koulutusalat.data
  }
}

export function getTutkintoNimiByKoodiarvo(koodi) {
  const state = store.getState()

  if (state.koulutukset && state.koulutukset.koulutusdata) {
    const { koulutusdata } = state.koulutukset

    let nimi = undefined

    _.forEach(koulutusdata, ala => {
      _.forEach(ala.koulutukset, koulutus => {
        if (koulutus.koodiArvo === koodi) {
          nimi = parseLocalizedField(koulutus.metadata)
        }
      })
    })

    return nimi
  }
}

export function getTutkintoKoodiByMaaraysId(maaraysId) {
  const state = store.getState()

  if (state.lupa && state.lupa.data && state.lupa.data.maaraykset) {
    const {maaraykset} = state.lupa.data
    const obj = _.find(maaraykset, {id: maaraysId})

    if (obj && obj.koodiarvo) {
      return obj.koodiarvo
    }
  }
}

export function getTutkintoNimiByMaaraysId(maaraysId) {
  const state = store.getState()

  if (state.lupa && state.lupa.data && state.lupa.data.maaraykset) {
    const {maaraykset} = state.lupa.data
    const obj = _.find(maaraykset, {id: maaraysId})

    if (obj && obj.koodi && obj.koodi.metadata) {
      return parseLocalizedField(obj.koodi.metadata)
    }
  }
}

export function getMuutosperusteluObjectById(muutosperustelukoodiarvo) {
    const state = store.getState()

    if (state.muutosperustelut && state.muutosperustelut.data) {
        return _.find(state.muutosperustelut.data, mperustelu => {
            return String(mperustelu.koodiArvo) === String(muutosperustelukoodiarvo)
        })
    }
}

export function getPaatoskierrosByUuid(paatoskierrosUuid) {
  const state = store.getState()

  if (state.paatoskierrokset && state.paatoskierrokset.data) {
    return _.find(state.paatoskierrokset.data, paatoskierros => {
      return paatoskierros.uuid === paatoskierrosUuid
    })
  }
}

export function getJarjestajaData(state) {
  const fakeUser = "oiva-web" // TODO: oikea käyttäjä statesta

  if (state.lupa && state.lupa.data) {
    const {data} = state.lupa
    const {
      id,
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
      luoja: fakeUser,
      luontipvm: now,
      lupaId: id,
      paatoskierrosId: null,
      paivityspvm: now,
      tila: "LUONNOS",
      voimassaalkupvm: null,
      voimassaloppupvm: null,
      muutosperustelu: {
        arvo: "",
        koodiarvo: null,
        koodisto: "oivaperustelut",
        luoja: fakeUser,
        luontipvm: now,
        meta: {
          perusteluteksti: null
        }
      }
    }
  }
}

export function formatMuutospyynto(muutospyynto) {

  const {
    diaarinumero,
    jarjestajaOid,
    jarjestajaYtunnus,
    luoja,
    luontipvm,
    lupaId,
    tila,
    lisattavat,
    poistettavat,
    paatoskierros,
    muutosperustelu,
    muuperustelu
  } = muutospyynto

  return {
    diaarinumero,
    jarjestajaOid,
    jarjestajaYtunnus,
    luoja,
    luontipvm,
    lupaId,
    paatoskierrosUuid: paatoskierros,
    tila,
    paivittaja: "string",
    paivityspvm: null,
    voimassaalkupvm: "2018-01-01",
    voimassaloppupvm: "2018-12-31",
    muutosperustelu: formatMuutosperustelu(muutosperustelu, muuperustelu),
    muutokset: formatMuutokset(lisattavat, poistettavat)
  }
}

function formatMuutosperustelu(muutosperustelukoodiarvo, muuperustelu) {
    const perustelu = getMuutosperusteluObjectById(muutosperustelukoodiarvo)
    const { koodiArvo, koodisto, metadata } = perustelu
    const nimi = parseLocalizedField(metadata, 'FI', nimi)
    const kuvaus = parseLocalizedField(metadata, 'FI', kuvaus)

  return {
    arvo: "",
    koodiarvo: koodiArvo,
    koodisto: koodisto.koodistoUri,
    luoja: "asd",
    luontipvm: dateformat(new Date(), "yyyy-mm-dd"),
    meta: {
      perusteluteksti: nimi,
      kuvaus: kuvaus
    }
  }
}

function formatMuutokset(lisattavat, poistettavat) {
  let muutokset = []

  if (lisattavat) {
    _.forEach(lisattavat, koodiarvo => {
      let obj = getBaseObject()
      obj.koodiarvo = koodiarvo
      obj.tila = "LISAYS"
      muutokset.push(obj)
    })
  }

  if (poistettavat) {
    _.forEach(poistettavat, maaraysId => {
      let obj = getBaseObject()
      obj.koodiarvo = getTutkintoKoodiByMaaraysId(maaraysId)
      obj.maaraysId = maaraysId
      obj.tila = "POISTO"
      muutokset.push(obj)
    })
  }

  return muutokset
}

function getBaseObject() {
  return {
    kohdeId: 1, // koulutukset
    koodisto: "koulutus",
    luoja: "string",
    luontipvm: 0,
    maaraystyyppiId: 1, // oikeus
    meta: {
      perusteluteksti: [
        {
          fi: "Suomeksi"
        },
        {
          sv: "På Svenska"
        }
      ]
    }
  }
}

export function loadValmisteluData(state, muutosdata) {
  // console.log('loadValmisteluData')
  // console.log(state)
  // console.log(muutosdata)

  if (!muutosdata) {
    console.log('muutosdata ei saatavilla, poistutaan')
    return
  }

  let uusiData = {...muutosdata}

  const {muutokset} = muutosdata

  // formatoi muutokset

  if (state.kohteet && state.kohteet.fetched) {
    const kohteet = state.kohteet.data

    // 1. Tutkinnot ja koulutukset
    const tutkinnotKohde = _.find(kohteet, kohde => {
      return kohde.tunniste === KOHTEET.TUTKINNOT
    })

    if (tutkinnotKohde) {
      uusiData.tutkinnotjakoulutukset = getMuutosArray(muutokset, tutkinnotKohde.uuid)
    }
  }

  // delete muutosdata.muutokset

  // console.log(uusiData)

  return uusiData
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
    _.extend(muutos, {type: tyyppi})
  })

  return results
}

export function handleRadioChange() {

}
