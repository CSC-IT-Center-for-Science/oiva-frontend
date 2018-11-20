import _ from 'lodash'
import store from '../../../../../../store'
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { KOHTEET, KOODISTOT, MAARAYSTYYPIT } from "../../../modules/constants"
import { getKohdeByTunniste, getMaaraystyyppiByTunniste } from "./muutospyyntoUtil"
import { MUUTOS_TYPES } from "./uusiHakemusFormConstants"

export function getKieliByKoodi(koodi) {
  const state = store.getState()

  const { kielet } = state

  if (kielet && kielet.data) {
    return _.find(kielet.data, (kieli) => { return kieli.koodiArvo === koodi })
  } else {
    return undefined
  }
}

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
    const { maaraykset } = state.lupa.data
    const obj = _.find(maaraykset, {id: maaraysId})

    if (obj && obj.koodiarvo) {
      return obj.koodiarvo
    }
  }
}

export function getTutkintoNimiByMaaraysId(maaraysId) {
  const state = store.getState()

  if (state.lupa && state.lupa.data && state.lupa.data.maaraykset) {
    const { maaraykset } = state.lupa.data
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

export function getEditIndex(values, koodiarvo, koodisto) {
  let i = undefined

  _.forEach(values, (value, idx) => {
    if (value.koodiarvo === koodiarvo && value.koodisto === koodisto) {
      i = idx
    }
  })

  return i
}

export function getChangeIndices(values, koodiarvo) {
  let indices = []

  _.forEach(values, (value, i) => {
    if (value.type === MUUTOS_TYPES.CHANGE && value.koodiarvo === koodiarvo) {
      indices.push(i)
    }
  })

  return indices
}

export function getOpiskelijavuosiIndex(values, koodiarvo) {
  let i = undefined

  _.forEach(values, (value, idx) => {
    if (value.koodiarvo === koodiarvo) {
      i = idx
    }
  })

  return i
}

export function handleSimpleCheckboxChange(event, editValues, fields, isInLupa, obj) {
  const { checked } = event.target
  const { koodiarvo, koodisto, kohde, maaraystyyppi } = obj

  if (checked) {
    if (isInLupa) {
      // Valtakunnallinen luvassa --> poistetaan se formista
      const i = getEditIndex(editValues, koodiarvo, koodisto)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // Valtakunnallinen ei luvassa --> lisätään muutos formiin
      fields.push({
        type: 'addition',
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null,
        isValtakunnallinen: true,
        koodiarvo: 'FI1',
        koodisto: 'nuts1',
        kohde,
        maaraystyyppi,
        metadata: {
          kuvaus: {
            FI: 'Tutkintoja ja koulutusta saa lisäksi järjestää Ahvenanmaan maakuntaa lukuun ottamatta myös muualla Suomessa.',
            SV: 'Examina och utbildning får därtill ordnas även på annat håll i Finland, med undantag för landskapet Åland.'
          }
        }
      })
    }
  } else {
    if (isInLupa) {
      // Valtakunnallinen luvassa --> lisätään muutos formiin
      fields.push({
        type: 'addition',
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null,
        isValtakunnallinen: false,
        koodiarvo: 'FI1',
        koodisto: 'nuts1',
        kohde,
        maaraystyyppi,
        metadata: {
          kuvaus: {
            FI: 'Tutkintoja ja koulutusta saa lisäksi järjestää Ahvenanmaan maakuntaa lukuun ottamatta myös muualla Suomessa.',
            SV: 'Examina och utbildning får därtill ordnas även på annat håll i Finland, med undantag för landskapet Åland.'
          }
        }
      })
    } else {
      // Valtakunnallinen ei luvassa --> poistetaan se formista
      const i = getEditIndex(editValues, koodiarvo, koodisto)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
  }
}

export function handleCheckboxChange(event, editValue, fields, isInLupa, currentObj) {
  const { koodiArvo, metadata, koodisto } = currentObj
  let { kohde, maaraystyyppi } = currentObj
  const { koodistoUri } = koodisto
  const nimi = parseLocalizedField(metadata, 'FI', 'nimi')
  const kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus')

  const { checked } = event.target

  if (!kohde) {
    console.log('koulutusUtil.handleCheckboxChange kohdetta ei löytynyt', currentObj)
    if (koodistoUri === KOODISTOT.KOULUTUS) {
      kohde = getKohdeByTunniste(KOHTEET.TUTKINNOT)
    } else if (koodistoUri === KOODISTOT.OPPILAITOKSENOPETUSKIELI) {
      kohde = getKohdeByTunniste(KOHTEET.KIELI)
    } else if (koodistoUri === KOODISTOT.OIVA_MUUT) {
      kohde = getKohdeByTunniste(KOHTEET.MUUT)
    }
  }

  if (!maaraystyyppi) {
    console.log('koulutusUtil.handleCheckboxChange määräystyyppiä ei löytynyt', currentObj)
    if (koodistoUri === KOODISTOT.KOULUTUS) {
      maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.OIKEUS)
    } else if (koodistoUri === KOODISTOT.OPPILAITOKSENOPETUSKIELI) {
      maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.VELVOITE)
    } else if (koodistoUri === KOODISTOT.OIVA_MUUT) {
      if (koodiArvo === "3") {
        maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.VELVOITE)
      } else {
        maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.OIKEUS)
      }
    }
  }

  if (checked) {
    if (isInLupa) {
      // Tutkinto oli luvassa --> poistetaan se formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // Tutkinto ei ollut luvassa --> lisätään se formiin
      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.ADDITION,
        meta: {
          perusteluteksti: null,
          perusteluteksti_oppisopimus: {
            "tarpeellisuus": null,
            "henkilosto": null,
            "osaaminen": null,
            "sidosryhma": null,
            "vuodet": {
              "arvo_1": {"vuosi": null, "maara": null},
              "arvo_2": {"vuosi": null, "maara": null},
              "arvo_3": {"vuosi": null, "maara": null}
            }
          },
          perusteluteksti_vaativa: {
            "tarpeellisuus": null,
            "henkilosto": null,
            "osaaminen": null,
            "sidosryhma": null,
            "pedagogiset": null,
            "suunnitelma": null,
            "vuodet": {
              "arvo_1": {"vuosi": null, "maara": null},
              "arvo_2": {"vuosi": null, "maara": null},
              "arvo_3": {"vuosi": null, "maara": null}
            }
          },
          perusteluteksti_vankila: {
            "tarpeellisuus": null,
            "henkilosto": null,
            "osaaminen": null,
            "sidosryhma": null,
            "pedagogiset": null,
            "toteuttaminen": null,
            "vuodet": {
              "arvo_1": {"vuosi": null, "maara": null},
              "arvo_2": {"vuosi": null, "maara": null},
              "arvo_3": {"vuosi": null, "maara": null}
            }
          },
          perusteluteksti_tyovoima: {
            "tarpeellisuus": null,
            "henkilosto": null,
            "osaaminen": null,
            "sidosryhma": null,
            "vuodet": {
              "arvo_1": {"vuosi": null, "maara": null},
              "arvo_2": {"vuosi": null, "maara": null},
              "arvo_3": {"vuosi": null, "maara": null}
            }
          },
          perusteluteksti_kuljetus_perus: {
            "tarpeellisuus": null,
            "voimassaoleva": null,
            "voimassaoleva_pvm": null,
            "suunnitelma": null,
            "toimipisteet": {
              "nimi": null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "henkilot": {
              "nimi":null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "kanta_linja_auto": null,
            "kanta_kuorma_auto": null,
            "kanta_peravaunu": null,
            "kanta_muut": null,
            "valineet_asetus": null,
            "valineet_muut": null
          },
          perusteluteksti_kuljetus_jatko: {
            "tarpeellisuus": null,
            "voimassaoleva": null,
            "voimassaoleva_pvm": null,
            "suunnitelma": null,
            "osaaminen":null,
            "toimipisteet": {
              "nimi": null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "henkilot": {
              "nimi":null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "kanta_linja_auto": null,
            "kanta_kuorma_auto": null,
            "kanta_peravaunu": null,
            "kanta_muut": null,
            "valineet_asetus": null,
            "valineet_muut": null
          },
          muutosperustelukoodiarvo: null
        }
      })
    }
  } else {
    if (isInLupa) {
      // Tutkinto oli luvassa --> lisätään muutos formiin
      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.REMOVAL,
        meta: {
          perusteluteksti: null,
          perusteluteksti_oppisopimus: {
            "tarpeellisuus": null,
            "henkilosto": null,
            "osaaminen": null,
            "sidosryhma": null,
            "vuodet": {
              "arvo_1": {"vuosi": null, "maara": null},
              "arvo_2": {"vuosi": null, "maara": null},
              "arvo_3": {"vuosi": null, "maara": null}
            }
          },
          perusteluteksti_vaativa: {
              "tarpeellisuus": null,
              "henkilosto": null,
              "osaaminen": null,
              "sidosryhma": null,
              "pedagogiset": null,
              "suunnitelma": null,
              "vuodet": {
                "arvo_1": {"vuosi": null, "maara": null},
                "arvo_2": {"vuosi": null, "maara": null},
                "arvo_3": {"vuosi": null, "maara": null}
              }
          },
          perusteluteksti_vankila: {
              "tarpeellisuus": null,
              "henkilosto": null,
              "osaaminen": null,
              "sidosryhma": null,
              "pedagogiset": null,
              "toteuttaminen": null,
              "vuodet": {
                "arvo_1": {"vuosi": null, "maara": null},
                "arvo_2": {"vuosi": null, "maara": null},
                "arvo_3": {"vuosi": null, "maara": null}
              }
          },
          perusteluteksti_tyovoima: {
              "tarpeellisuus": null,
              "henkilosto": null,
              "osaaminen": null,
              "sidosryhma": null,
              "vuodet": {
                "arvo_1": {"vuosi": null, "maara": null},
                "arvo_2": {"vuosi": null, "maara": null},
                "arvo_3": {"vuosi": null, "maara": null}
              }
          },
          perusteluteksti_kuljetus_perus: {
            "tarpeellisuus": null,
            "voimassaoleva": null,
            "voimassaoleva_pvm": null,
            "suunnitelma": null,
            "toimipisteet": {
              "nimi": null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "henkilot": {
              "nimi":null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "kanta_linja_auto": null,
            "kanta_kuorma_auto": null,
            "kanta_peravaunu": null,
            "kanta_muut": null,
            "valineet_asetus": null,
            "valineet_muut": null
          },
          perusteluteksti_kuljetus_jatko: {
            "tarpeellisuus": null,
            "voimassaoleva": null,
            "voimassaoleva_pvm": null,
            "suunnitelma": null,
            "osaaminen":null,
            "toimipisteet": {
              "nimi": null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "henkilot": {
              "nimi":null,
              "lupa": null,
              "voimassa_kuorma_auto": null,
              "voimassa_linja_auto": null,
              "luokka_C" : null,
              "luokka_CE": null,
              "luokka_D": null,
              "tutkinto_linja_auto": null,
              "tutkinto_yhdistelma": null,
              "tutkinto_puutavara": null,
              "tutkinto_kuljetuspalvelu": null,
              "tutkinto_kuljetusala": null
            },
            "kanta_linja_auto": null,
            "kanta_kuorma_auto": null,
            "kanta_peravaunu": null,
            "kanta_muut": null,
            "valineet_asetus": null,
            "valineet_muut": null
          },
          muutosperustelukoodiarvo: null
        }
      })
    } else {
      // Tutkinto ei ollut luvassa --> poistetaan muutos formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
  }
}

export function handleOsaamislaCheckboxChange(event, editValue, fields, isInLupa, currentObj, parentId) {
  const { koodiArvo, metadata, koodisto } = currentObj
  const { koodistoUri } = koodisto
  const nimi = parseLocalizedField(metadata, 'FI', 'nimi')
  const kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus')

  const { checked } = event.target

  // osaamisala spesific
  let kohde = getKohdeByTunniste(KOHTEET.TUTKINNOT)
  let maaraystyyppi = getMaaraystyyppiByTunniste(MAARAYSTYYPIT.RAJOITE)


  if (checked) {
    if (isInLupa) {
      // osaamisala oli luvassa --> poistetaan se formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // osaamisala ei ollut luvassa --> lisätään se formiin

      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        parentId: parentId,  // tutkinnon koodiarvo
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.ADDITION,
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    }
  } else {
    if (isInLupa) {
      // osaamisala oli luvassa --> lisätään muutos formiin
      fields.push({
        koodiarvo: koodiArvo,
        koodisto: koodistoUri,
        parentId: parentId,  // tutkinnon koodiarvo
        nimi,
        kuvaus,
        isInLupa,
        kohde,
        maaraystyyppi,
        type: MUUTOS_TYPES.REMOVAL,
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    } else {
      // osaamisala ei ollut luvassa --> poistetaan muutos formista
      const i = getEditIndex(editValue, koodiArvo, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
  }
}

export function handleTutkintoKieliCheckboxChange(event, editValue, fields, isInLupa, value, currentObj) {
  const { nimi, kohde, maaraystyyppi } = currentObj
  let { koodi } = currentObj
  const koodistoUri = "kieli"

  if (!koodi && currentObj.koodiarvo) {
    koodi = currentObj.koodiarvo
  }

  const { checked } = event.target

  if (checked) {
    if (isInLupa) {
      // Tutkinto oli luvassa --> poistetaan se formista
      const i = getEditIndex(editValue, koodi, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    } else {
      // Tutkinto ei ollut luvassa --> lisätään se formiin
      fields.push({
        koodiarvo: koodi,
        koodisto: koodistoUri,
        nimi,
        kohde,
        maaraystyyppi,
        value,
        kuvaus: null,
        isInLupa,
        type: MUUTOS_TYPES.ADDITION,
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    }
  } else {
    if (isInLupa) {
      // Tutkinto oli luvassa --> lisätään muutos formiin
      fields.push({
        koodiarvo:
        koodi,
        koodisto: koodistoUri,
        nimi,
        value,
        kohde,
        maaraystyyppi,
        kuvaus: null,
        isInLupa,
        type: MUUTOS_TYPES.REMOVAL,
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    } else {
      // Tutkinto ei ollut luvassa --> poistetaan muutos formista
      const i = getEditIndex(editValue, koodi, koodistoUri)
      if (i !== undefined) {
        fields.remove(i)
      }
    }
    // Tarkastetaan, että editvaluesiin ei jää muutos-tyyppisiä arvoja
    if (editValue) {
      const indices = getChangeIndices(editValue, koodi)
      if (indices.length > 0) {
        indices.forEach(i => {
          fields.remove(i)
        })
      }
    }
  }
}

export function handleTutkintokieliSelectChange(editValues, fields, isInLupa, tutkinto, selectedValue) {
  if (selectedValue === null) {
    return
  }

  const { koodi, maaraysId, nimi, kohde, maaraystyyppi } = tutkinto
  const { value, koodisto, label } = selectedValue
  const { koodistoUri } = koodisto

  if (isInLupa) {
    // Tarkastetaan löytyykö muutosta editValuesista
    if (editValues) {
      const i = getEditIndex(editValues, koodi, koodistoUri)
      if (i !== undefined) {
        let obj = fields.get(i)
        fields.remove(i)
        obj.value = selectedValue.value
        fields.insert(i, obj)
      } else {
        fields.push({
          koodiarvo: koodi,
          koodisto: koodistoUri,
          nimi,
          maaraysId,
          value,
          label,
          kohde,
          maaraystyyppi,
          kuvaus: null,
          isInLupa,
          type: MUUTOS_TYPES.CHANGE,
          meta: { perusteluteksti: null },
          muutosperustelukoodiarvo: null
        })
      }
    } else {
      fields.push({
        koodiarvo: koodi,
        koodisto: koodistoUri,
        nimi,
        maaraysId,
        value,
        label,
        kohde,
        maaraystyyppi,
        kuvaus: null,
        isInLupa,
        type: MUUTOS_TYPES.CHANGE,
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null
      })
    }
  } else {
    if (editValues) {
      const i = getEditIndex(editValues, koodi, koodistoUri)
      if (i !== undefined) {
        let obj = fields.get(i)
        fields.remove(i)
        obj.value = value
        obj.label = label
        obj.isAdded = true
        fields.insert(i, obj)
      }
    }
  }
}

export function getKieliList(kielet, locale) {
  let kieletExtended = []

  kielet.forEach(kieli => {
    const { koodiArvo, koodisto, metadata, kohde, maaraystyyppi } = kieli
    kieletExtended.push({ koodiArvo, koodisto, metadata, kohde, maaraystyyppi, label: parseLocalizedField(metadata, locale), value: koodiArvo })
  })

  return kieletExtended
}
