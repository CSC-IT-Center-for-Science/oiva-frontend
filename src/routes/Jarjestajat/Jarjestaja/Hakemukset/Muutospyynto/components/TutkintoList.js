import _ from 'lodash'
import React, { Component } from "react"
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
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { handleCheckboxChange } from "../modules/koulutusUtil"
import { MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"

class TutkintoList extends Component {
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
    const { nimi, maaraykset } = this.props
    const alaKoodiArvo = this.props.koodiarvo
    const { editValues } = this.props
    let { fields, koulutukset } = this.props
    let muutokset = []

    koulutukset = _.sortBy(koulutukset, k => {
      return k.koodiArvo
    })

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
          {_.map(koulutukset, (koulutus, i) => {
            const koodiarvo = koulutus.koodiarvo || koulutus.koodiArvo
            const identifier = `input-${koodiarvo}`
            const { nimi, metadata } = koulutus
            let nimiText = ""

            if (!nimi && metadata) {
              nimiText = parseLocalizedField(metadata)
            } else {
              nimiText = nimi
            }

            let isInLupa = false
            let isAdded = false
            let isRemoved = false

            if (alat) {
              _.forEach(alat, ({ koulutukset }) => {
                koulutukset.forEach(({ koodi }) => {
                  if (koodi === koodiarvo) {
                    isInLupa = true
                  }

                  if (editValues) {
                    editValues.forEach(val => {
                      if (val.koodiarvo === koodiarvo) {
                        val.type === MUUTOS_TYPES.ADDITION ? isAdded = true : null
                        val.type === MUUTOS_TYPES.REMOVAL ? isRemoved = true : null
                      }
                    })
                  }
                })
              })
            } else {
              // Tarkastetaan myös tilanne, jossa koulutusalalla ei ollut yhtään tutkintoa luvassa, mutta alalle on lisätty tutkintoja
              if (editValues) {
                editValues.forEach(val => {
                  if (val.koodiarvo === koodiarvo) {
                    val.type === MUUTOS_TYPES.ADDITION ? isAdded = true : null
                    val.type === MUUTOS_TYPES.REMOVAL ? isRemoved = true : null
                  }
                })
              }
            }

            let customClassName = ""
            isInLupa ? customClassName = "is-in-lupa" : null
            isAdded ? customClassName = "is-added" : null
            isRemoved ? customClassName = "is-removed" : null

            let isChecked = false
            if ((isInLupa && !isRemoved) || isAdded) {
              isChecked = true
            }

            return (
              <TutkintoWrapper key={i} className={customClassName}>
                <Checkbox>
                  <input
                    type="checkbox"
                    id={identifier}
                    checked={isChecked}
                    onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
                  />
                  <label htmlFor={identifier}></label>
                </Checkbox>
                <Koodi>{koodiarvo}</Koodi>
                <Nimi>{nimiText}</Nimi>
              </TutkintoWrapper>
            )
          })}
        </KoulutusalaListWrapper>
        }
      </Wrapper>
    )
  }
}

export default TutkintoList
