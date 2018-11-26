import _ from 'lodash'
import { parseLocalizedField } from "../../../../../../modules/helpers"
import store from '../../../../../../store'

export function getELYkeskusList(ELYkeskukset, locale) {
  let array = []

  ELYkeskukset.forEach(ELYkeskus => {
    const { koodiArvo, metadata } = ELYkeskus
    array.push({ ...ELYkeskus, label: parseLocalizedField(metadata, locale), value: koodiArvo })
  })

  return array
}

export function handleELYkeskusSelectChange(muutokset, fields, muutos, selectedValue) {
  let ELYkeskusValue = null

  if (selectedValue !== null) {
    ELYkeskusValue = selectedValue.koodiArvo
  }

  const { koodiarvo } = muutos

  const i = getELYkeskusEditIndex(muutokset, koodiarvo)

  if (i !== undefined) {
    let obj = fields.get(i)
    fields.remove(i)
    let ELYkeskus = getELYkeskusByKoodiArvo(ELYkeskusValue)
    obj.meta.perusteluteksti_tyovoima.yhteistyo = _.pickBy(ELYkeskus, (value, key) => {
    	return key === "koodiArvo" || key === "koodisto" || key === "versio" || key === "metadata"
    })
    fields.insert(i, obj)
  }

}

function getELYkeskusEditIndex(muutokset, koodiarvo) {
  let i = undefined

  _.forEach(muutokset, (muutos, idx) => {
    if (muutos.koodiarvo === koodiarvo) {
      i = idx
    }
  })

  return i
}

export function getELYkeskusByKoodiArvo(koodiarvo) {
  const state = store.getState()

  const { ELYkeskukset } = state

  if (ELYkeskukset && ELYkeskukset.fetched) {
    return _.find(ELYkeskukset.ELYkeskusList, (ELYkeskus) => { 
    	return ELYkeskus.koodiArvo === koodiarvo
    })
  } else {
    return undefined
  }
}
