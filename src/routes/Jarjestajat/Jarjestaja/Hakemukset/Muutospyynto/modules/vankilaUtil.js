import _ from 'lodash'
import { parseLocalizedField } from "../../../../../../modules/helpers"
import store from '../../../../../../store'

export function getVankilaList(vankilat, locale) {
  let array = []

  vankilat.forEach(vankila => {
    const { koodiArvo, metadata } = vankila
    array.push({ ...vankila, label: parseLocalizedField(metadata, locale), value: koodiArvo })
  })

  return array
}

export function handleVankilaSelectChange(muutokset, fields, muutos, selectedValue) {
  let vankilaValue = null

  if (selectedValue !== null) {
    vankilaValue = selectedValue.koodiArvo
  }

  const { koodiarvo } = muutos

  const i = getVankilaEditIndex(muutokset, koodiarvo)

  if (i !== undefined) {
    let obj = fields.get(i)
    fields.remove(i)
    let vankila = getVankilaByKoodiArvo(vankilaValue)
    obj.meta.perusteluteksti_vankila.toteuttaminen = _.pickBy(vankila, (value, key) => {
    	return key === "koodiArvo" || key === "koodisto" || key === "versio" || key === "metadata"
    })
    fields.insert(i, obj)
  }

}

function getVankilaEditIndex(muutokset, koodiarvo) {
  let i = undefined

  _.forEach(muutokset, (muutos, idx) => {
    if (muutos.koodiarvo === koodiarvo) {
      i = idx
    }
  })

  return i
}

export function getVankilaByKoodiArvo(koodiarvo) {
  const state = store.getState()

  const { vankilat } = state

  if (vankilat && vankilat.fetched) {
    return _.find(vankilat.vankilaList, (vankila) => { 
    	return vankila.koodiArvo === koodiarvo
    })
  } else {
    return undefined
  }
}
