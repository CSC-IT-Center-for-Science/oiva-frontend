import _ from 'lodash'
import React, { Component } from "react"
import { COLORS } from "../../../../../../modules/styles"
import arrow from 'static/images/koulutusala-arrow.svg'
import {
  Wrapper,
  Heading,
  Arrow,
  Checkbox,
  RadioCheckbox,
  Span,
  SpanMuutos,
  KoulutusalaListWrapper,
  TutkintoWrapper,
  Koodi,
  Nimi,
  Kuvaus
} from './MuutospyyntoWizardComponents'
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { handleCheckboxChange } from "../modules/koulutusUtil"
import { MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"
import { HAKEMUS_TEKSTIT } from "../../../modules/constants"

class KoulutusList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
    }
  }

  toggleTutkintoList() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  removeChanges(muutokset, editValues, fields, koodisto) {

    let removals = []

    muutokset.forEach(muutos => {
      editValues.forEach((value, index) => {
        if (muutos.koodiarvo === value.koodiarvo && koodisto === muutos.koodisto && koodisto === value.koodisto) {
          fields.remove(this.getIndex(editValues, index, koodisto))
          removals.push(editValues[index])
        }
      })
    })

    removals.forEach(removal => {
      _.remove(editValues, value => {
        return value.koodiarvo === removal.koodiarvo && removal.koodisto === koodisto
      })
    })
  }

  getIndex(values, koodiarvo, koodisto) {
    let i = undefined

    _.forEach(values, (value, idx) => {
      if (value.koodiarvo === koodiarvo && value.koodisto === koodisto) {
        i = idx
      }
    })

    return i
  }

  render() {
    const { nimi, koulutukset, muutMaaraykset, editValues, koodisto } = this.props
    let { fields } = this.props
    let muutokset = []

    if (editValues) {
      _.forEach(editValues, value => {
        _.forEach(koulutukset, koulutus => {

          if (koulutus.koodiArvo === value.koodiarvo && koodisto === value.koodisto) {
            muutokset.push(value)
          }
        })
      })
    }

    return (
      <Wrapper>
        <Heading onClick={this.toggleTutkintoList.bind(this)}>
          <Arrow src={arrow} alt="Koulutusala" rotated={!this.state.isHidden} />
          <Span>{nimi}</Span>
          {/* TODO: Muutosten poiston korjaus */}
          {/*{muutokset.length > 0*/}
            {/*? <SpanMuutos>Muutokset:&nbsp;<Span color={COLORS.OIVA_PURPLE}>{muutokset.length}</Span><Span onClick={event => {event.stopPropagation();this.removeChanges(muutokset, editValues, fields, koodisto);}}>Poista muutokset</Span></SpanMuutos>*/}
            {/*: null*/}
          {/*}*/}
        </Heading>
        {!this.state.isHidden &&
        <KoulutusalaListWrapper>
          { (koodisto === 'oivatyovoimakoulutus' ||  koodisto === 'kuljettajakoulutus') &&
            <p>{HAKEMUS_TEKSTIT.VAINYKSIVALINTA.FI}:</p>
          }
          {_.map(koulutukset, (koulutus, i) => {

            const { koodiArvo, metadata } = koulutus
            const { koodistoUri } = koulutus.koodisto
            const nimi = parseLocalizedField(metadata, 'FI', 'nimi')
            const kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus')
            const identifier = `input-${koodistoUri}-${koodiArvo}`

            let isInLupa = false
            let isAdded = false
            let isRemoved = false
            let isChecked = false
            let customClassName = ""

            muutMaaraykset.forEach(muuMaarays => {
              if (!isRemoved && (muuMaarays.koodisto === koodistoUri && muuMaarays.koodiarvo === koodiArvo)) {
                isInLupa = true
              }
            })

            if (editValues) {
              editValues.forEach(val => {
                if (val.koodiarvo === koodiArvo && val.koodisto === koodistoUri) {
                  val.type === MUUTOS_TYPES.ADDITION ? isAdded = true : null
                  val.type === MUUTOS_TYPES.REMOVAL ? isRemoved = true : null
                }
              })
            }

            isInLupa ? customClassName = "is-in-lupa" : null
            isAdded ? customClassName = "is-added" : null
            isRemoved ? customClassName = "is-removed" : null

            if ((isInLupa && !isRemoved && fields) || isAdded) {
              isChecked = true
            }

            return (
              <div key={i}>
                { koodistoUri === 'oivatyovoimakoulutus' ||  koodistoUri === 'kuljettajakoulutus' ?
                  <TutkintoWrapper className={ koodistoUri !== 'kuljettajakoulutus' ? 'customClassName' : 'customClassName longtext'}>
                    <RadioCheckbox>
                      <input
                        type="checkbox"
                        id={identifier}
                        checked={ isChecked }
                        onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
                      />
                      <label htmlFor={identifier}></label>
                    </RadioCheckbox>
                    <Kuvaus>{kuvaus}</Kuvaus> 
                  </TutkintoWrapper>
                :
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
                    {nimi}
                  </TutkintoWrapper>                  
                }
              </div>
            )
          })}
        </KoulutusalaListWrapper>
        }
      </Wrapper>
    )
  }
}

export default KoulutusList
