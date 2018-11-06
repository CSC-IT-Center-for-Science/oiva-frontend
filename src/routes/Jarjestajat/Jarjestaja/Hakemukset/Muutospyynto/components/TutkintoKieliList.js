import _ from 'lodash'
import React, { Component } from "react"
import KieliSelect from './KieliSelect'
import { COLORS } from "../../../../../../modules/styles"
import arrow from 'static/images/koulutusala-arrow.svg'
import {
  Wrapper,
  Heading,
  Arrow,
  Checkbox,
  Span,
  SpanMuutos,
  KoulutusalaListWrapper,
  TutkintoWrapper,
  Koodi,
  Nimi
} from './MuutospyyntoWizardComponents'
import { handleTutkintoKieliCheckboxChange } from "../modules/koulutusUtil"
import { MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"

class TutkintoKieliList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true
    }
  }

  toggleTutkintoList() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  removeChanges(muutokset, editValues, fields, alaKoodiArvo) {
    let removals = []
    muutokset.forEach(muutos => {
      editValues.forEach((value, index) => {
        if (value.koodiArvo === muutos.koodiArvo) {
          fields.remove(this.getIndex(editValues, index))
          removals.push(editValues[index])
        }
      })
    })
    removals.forEach(removal => {
      _.remove(editValues, value => {
        return value.koodiarvo === removal.koodiarvo && removal.ala === alaKoodiArvo
      })
    })
  }

  getIndex(values, koodiarvo) {
    let i = undefined

    _.forEach(values, (value, idx) => {
      if (value.koodiarvo === koodiarvo) {
        i = idx
      }
    })

    return i
  }

  render() {
    const { nimi, editValues, kieliList, tutkinnotjakielet, tutkinnotJaKoulutuksetValue } = this.props
    const alaKoodiArvo = this.props.koodiarvo
    let { fields, maaraykset, koulutukset } = this.props
    let muutokset = []

    // Sort languages: promote some common languages, sort others alphabetically
    const kieliListOrdered = kieliList.sort((a, b) => {
      if (a.koodiArvo === 'FI') return -1;
      if (b.koodiArvo === 'FI') return 1;
      if (a.koodiArvo === 'SV') return -1;
      if (b.koodiArvo === 'SV') return 1;
      if (a.koodiArvo === 'EN') return -1;
      if (b.koodiArvo === 'EN') return 1;
      if (a.koodiArvo === 'RU') return -1;
      if (b.koodiArvo === 'RU') return 1;
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });

    koulutukset = _.sortBy(koulutukset, k => {
      return k.koodiArvo
    })

    if (editValues) {
      _.forEach(editValues, value => {
        _.forEach(maaraykset, koulutus => {
          if (koulutus.koodiArvo === value.koodiarvo) {
            muutokset.push(value)
          }
        })
      })
    }

    return (
      <Wrapper>
        <Heading onClick={this.toggleTutkintoList.bind(this)}>
          <Arrow src={arrow} alt="Koulutusala" rotated={!this.state.isHidden} />
          <Span>{alaKoodiArvo}</Span>
          <Span>{nimi}</Span>
          {muutokset.length > 0
            ? <SpanMuutos>Muutokset:&nbsp;<Span color={COLORS.OIVA_PURPLE}>{muutokset.length}</Span><Span onClick={event => {event.stopPropagation();this.removeChanges(muutokset, editValues, fields, alaKoodiArvo);}}>Poista muutokset</Span></SpanMuutos>
            : null
          }
        </Heading>
        {!this.state.isHidden &&
        <KoulutusalaListWrapper>
          {_.map(koulutukset, (koulutus, i) => {

            const identifier = `input-tutkintokieli-2-${koulutus.koodiArvo}`
            const nimiObjekti = _.filter(koulutus.metadata, (m) => { return m.kieli === "FI" })
            const koulutuksenNimi = nimiObjekti[0].nimi

            let isInLupa = false
            let isAdded = false
            let isRemoved = false
            let isChanged = false
            let isChecked = false
            let valueKoodi = ""
            let value = ""

            tutkinnotjakielet.forEach(tutkintokieli => {
              if (tutkintokieli.tutkintokoodi === koulutus.koodiArvo) {
                isInLupa = true
                valueKoodi = tutkintokieli.koodi
              }
            })

            if (editValues) {
              editValues.forEach(val => {
                if (val.koodiarvo === koulutus.koodiArvo) {
                  switch(val.type) {
                    case MUUTOS_TYPES.ADDITION:
                      valueKoodi = val.value
                      isAdded = true
                      break

                    case MUUTOS_TYPES.REMOVAL:
                      isRemoved = true
                      break

                    case MUUTOS_TYPES.CHANGE:
                      isChanged = true
                      break

                    default:
                      break
                  }
                }
              })
            }

            let customClassName = isInLupa ? "is-in-lupa" : isAdded ? "is-added" : isRemoved ? "is-removed" : isChanged ? "is-changed" : null

            if ((isInLupa && !isRemoved)) {
              isChecked = true
              value = valueKoodi
            }

            if (isAdded) {
              isChecked = true
              value = valueKoodi
            }

            if (isInLupa && isRemoved) {
              value = ''
            }

            // Koulutus näytetään luvassa, jos se on (a) luvassa eikä sitä ole poistettu kohdassa 1 tai (b) lisätty kohdassa 1
            let tutkinto = _.find(maaraykset, (m) => { return m.koodi === koulutus.koodiArvo })
            if (!tutkinto) { tutkinto = _.find(tutkinnotJaKoulutuksetValue, (t) => { return t.koodiarvo === koulutus.koodiArvo && t.type === MUUTOS_TYPES.ADDITION}) }
            if (!tutkinto || _.find(tutkinnotJaKoulutuksetValue, (t) => { return t.koodiarvo === koulutus.koodiArvo && t.type === MUUTOS_TYPES.REMOVAL})) { return false }

            return (
              <TutkintoWrapper key={i} className={customClassName}>
                <Checkbox>
                  <input
                    type="checkbox"
                    id={identifier}
                    checked={isChecked}
                    onChange={(e) => { handleTutkintoKieliCheckboxChange(e, editValues, fields, isInLupa, value, tutkinto) }}
                  />
                  <label htmlFor={identifier}></label>
                </Checkbox>
                <Koodi>{koulutus.koodiArvo}</Koodi>
                <Nimi>{koulutuksenNimi}</Nimi>
                <KieliSelect
                  identifier={identifier}
                  value={value}
                  kielet={kieliListOrdered}
                  disabled={!isChecked}
                  editValues={editValues}
                  fields={fields}
                  isInLupa={isInLupa}
                  tutkinto={tutkinto}
                  customClass={customClassName}
                />
              </TutkintoWrapper>
            )
          })}
        </KoulutusalaListWrapper>
        }
      </Wrapper>
    )
  }
}

export default TutkintoKieliList
