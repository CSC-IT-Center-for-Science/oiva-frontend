/* Samat utilit käsittelevät sekä tutkintojen että opiskelijavuosien perusteluja */

import _ from 'lodash'
import { parseLocalizedField } from "../../../../../../modules/helpers"
import store from '../../../../../../store'

export function getMuutosperusteluList(muutosperustelut, locale) {
  let array = []

  muutosperustelut.forEach(muutosperustelu => {
    const { koodiArvo, metadata } = muutosperustelu
    array.push({ ...muutosperustelu, label: parseLocalizedField(metadata, locale), value: koodiArvo })
  })

  return array
}

export function handleMuutosperusteluSelectChange(muutokset, fields, muutos, selectedValue) {
  let muutosperusteluValue = null

  console.log(selectedValue);

  if (selectedValue !== null) {
    muutosperusteluValue = selectedValue.koodiArvo
  }

  const { koodiarvo } = muutos

  const i = getMuutosperusteluEditIndex(muutokset, koodiarvo)

  if (i !== undefined) {
    let obj = fields.get(i)
    fields.remove(i)
    obj.muutosperustelukoodiarvo = muutosperusteluValue
    fields.insert(i, obj)
  }
}

export function getMuutosperusteluEditIndex(muutokset, koodiarvo) {
  let i = undefined

  _.forEach(muutokset, (muutos, idx) => {
    if (muutos.koodiarvo === koodiarvo) {
      i = idx
    }
  })

  return i
}

export function getMuutosperusteluByKoodiArvo(koodiarvo) {
  const state = store.getState()

  const { muutosperustelut } = state

  if (muutosperustelut && muutosperustelut.fetched) {
    return _.find(muutosperustelut.muutosperusteluList, (muutosperustelu) => { return muutosperustelu.koodiArvo === koodiarvo })
  } else {
    return undefined
  }
}

export function getMuutosperusteluOpiskelijavuodetByKoodiArvo(koodiarvo) {
  const state = store.getState()

  const { muutosperustelutOpiskelijavuodet } = state

  if (muutosperustelutOpiskelijavuodet && muutosperustelutOpiskelijavuodet.fetched) {
    return _.find(muutosperustelutOpiskelijavuodet.muutosperusteluList, (muutosperustelu) => { return muutosperustelu.koodiArvo === koodiarvo })
  } else {
    return undefined
  }
}
