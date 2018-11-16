// import _ from 'lodash'
import { parseLocalizedField } from "../../../../../../modules/helpers"
// import store from '../../../../../../store'

export function getVankilaList(vankilat, locale) {
  let array = []

  console.log("haen vankilalistaa")

  vankilat.forEach(vankila => {
    const { koodiArvo, metadata } = vankila
    array.push({ ...vankila, label: parseLocalizedField(metadata, locale), value: koodiArvo })
  })

  return array
}

// export function handleMuutosperusteluSelectChange(muutokset, fields, muutos, selectedValue) {
//   let muutosperusteluValue = null

//   if (selectedValue !== null) {
//     muutosperusteluValue = selectedValue.koodiArvo
//   }

//   const { koodiarvo } = muutos

//   const i = getMuutosperusteluEditIndex(muutokset, koodiarvo)

//   if (i !== undefined) {
//     let obj = fields.get(i)
//     fields.remove(i)
//     obj.muutosperustelukoodiarvo = muutosperusteluValue
//     fields.insert(i, obj)
//   }
// }

// function getMuutosperusteluEditIndex(muutokset, koodiarvo) {
//   let i = undefined

//   _.forEach(muutokset, (muutos, idx) => {
//     if (muutos.koodiarvo === koodiarvo) {
//       i = idx
//     }
//   })

//   return i
// }

// export function getMuutosperusteluByKoodiArvo(koodiarvo) {
//   const state = store.getState()

//   const { muutosperustelut } = state

//   if (muutosperustelut && muutosperustelut.fetched) {
//     return _.find(muutosperustelut.muutosperusteluList, (muutosperustelu) => { return muutosperustelu.koodiArvo === koodiarvo })
//   } else {
//     return undefined
//   }
// }
