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
    const { nimi, koulutukset, maaraykset, editValues, kielet, kieliList, tutkinnotjakielet } = this.props
    const alaKoodiArvo = this.props.koodiarvo
    let { fields } = this.props
    let muutokset = []

    if (editValues) {
      _.forEach(editValues, value => {
        _.forEach(koulutukset, koulutus => {
          if (koulutus.koodiArvo === value.koodiarvo) {
            muutokset.push(value)
          }
        })
      })
    }

    const current = _.find(maaraykset, ala => { return ala.koodi === alaKoodiArvo })
    let alat = undefined
    if (current) {
      alat = current.koulutusalat
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
          {_.map(maaraykset, (tutkinto, i) => {
            const { koodi, nimi, maaraysId } = tutkinto
            const identifier = `input-tutkintokieli-2-${koodi}`

            const koodiarvo = koodi

            let isInLupa = false
            let isAdded = false
            let isRemoved = false
            let isChanged = false
            let isChecked = false
            let customClassName = ""
            let value = ""
            let valueKoodi = ""

            tutkinnotjakielet.forEach(tutkintokieli => {
              if (tutkintokieli.tutkintokoodi === koodi) {
                isInLupa = true
                valueKoodi = tutkintokieli.koodi
              }
            })

            if (editValues) {
              editValues.forEach(val => {
                if (val.koodiarvo === koodi) {
                  if (val.type === "addition") {
                    valueKoodi = val.value
                  }

                  val.type === "addition" ? isAdded = true : val.type === "removal" ? isRemoved = true : val.type === "change" ? isChanged = true : null
                }
              })
            }

            isInLupa ? customClassName = "is-in-lupa" : null
            isAdded ? customClassName = "is-added" : null
            isRemoved ? customClassName = "is-removed" : null
            isChanged ? customClassName = "is-changed" : null

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
                <Koodi>{koodiarvo}</Koodi>
                <Nimi>{nimi}</Nimi>
                <KieliSelect
                  identifier={identifier}
                  value={value}
                  kielet={kieliList}
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
