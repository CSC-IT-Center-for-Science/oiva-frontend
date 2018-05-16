import _ from 'lodash'

import store from '../../../../../../store'
import { parseLocalizedField } from "../../../../../../modules/helpers"

export function getToimialueByKoodiArvo(koodiarvo) {
  if (!koodiarvo) {
    return undefined
  }

  const state = store.getState()

  if (koodiarvo.length === 2) {
    // Kyseessä maakunta
    if (state.maakunnat && state.maakunnat.fetched) {
      const { maakuntaList } = state.maakunnat
      return _.find(maakuntaList, maakunta => {
        return maakunta.koodiArvo === koodiarvo
      })
    }
  } else if (koodiarvo.length === 3) {
    // Kyseessä kunta
    if (state.kunnat && state.kunnat.fetched) {
      const { kuntaList } = state.kunnat
      return _.find(kuntaList, kunta => {
        return kunta.koodiArvo === koodiarvo
      })
    }
  } else {
    return undefined
  }
}

export function getToimialueList(toimialueet, locale, tyyppi) {
  let array = []

  toimialueet.forEach(toimialue => {
    const { koodiArvo, metadata } = toimialue
    array.push({ ...toimialue, label: parseLocalizedField(metadata, locale), value: koodiArvo, tyyppi })
  })

  return array
}

export function handleToimialueSelectChange(editValues, fields, initialValues, values) {
  if (!hasToimialueChanged(initialValues, values)) {
    return
  }

  // käsitellään poistot
  const removals = getToimialueRemovals(initialValues, values)

  if (removals.length > 0) {
    removals.forEach(removal => {
      const toimialue = getToimialueByKoodiArvo(removal)
      fields.push({
        ...toimialue,
        type: "removal",
        perustelu: null
      })
    })
  }

  // käsitellään lisäykset
  values.forEach(value => {
    // Tarkastetaan onko arvo initial valuesissa
    const { koodiArvo } = value
    if (!_.includes(initialValues, koodiArvo)) {
      // Tarkastetaan onko value editvaluesissa
      if (editValues) {
        const obj = _.find(editValues, editValue => {
          return editValue.koodiArvo === koodiArvo
        })

        if (!obj) {
          // Arvoa ei löytynyt editvaluesista --> lisatään se
          fields.push({
            ...value,
            type: "addition",
            perustelu: null
          })
        }
      } else {
        // Ei editvaluesia --> luodaan arvo
        fields.push({
          ...value,
          type: "addition",
          perustelu: null
        })
      }
    }
  })

  // Käydään läpi editvaluesit ja poistetaan sieltä alkiot, jotka eivät ole enää valuesissa
  if (editValues) {
    editValues.forEach(editValue => {
      const { koodiArvo } = editValue
      const obj = _.find(values, value => {
        return value.koodiArvo === koodiArvo
      })

      if (!obj) {
        // editvaluea ei löytynyt valuesista --> poistetaan se
        const i = getIndex(editValues, koodiArvo)
        if (i !== undefined) {
          fields.remove(i)
        }
      }
    })
  }
}

function hasToimialueChanged(initialValues, values) {

  if (initialValues.length !== values.length) {
    return true
  }

  let hasChanged = false

  values.forEach(val => {
    const isInInitialValues =_.includes(initialValues, val.koodiArvo)
    if (!isInInitialValues) {
      hasChanged = true
    }
  })

  return hasChanged
}

function getToimialueRemovals(initialValues, values) {
  let removals = []
  initialValues.forEach(ival => {
    const obj = _.find(values, (val) => {
      return val.koodiArvo === ival
    })
    if (!obj) {
      removals.push(ival)
    }
  })
  return removals
}

function getIndex(editValues, koodiarvo) {
  let i = undefined

  _.forEach(editValues, (value, idx) => {
    if (value.koodiArvo === koodiarvo) {
      i = idx
    }
  })

  return i
}
