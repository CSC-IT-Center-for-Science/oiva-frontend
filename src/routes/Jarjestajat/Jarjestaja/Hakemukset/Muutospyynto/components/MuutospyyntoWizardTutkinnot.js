import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form'
import styled from 'styled-components'

import arrow from 'static/images/koulutusala-arrow.svg'
import validate from '../modules/validateWizard'
import { COLORS } from "../../../../../../modules/styles"
import { WizButton } from "./MuutospyyntoWizard"
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { ContentContainer } from "../../../../../../modules/elements"
import { Wrapper, Heading, Arrow, Span, KoulutusalaListWrapper, KoulutusTyyppiWrapper } from "./MuutospyyntoWizardComponents"
import { TutkintoWrapper, Koodi, Nimi } from "./MuutospyyntoWizardComponents"

//
// Yleiset tyylikomponentit
//
const Kohde = styled.div`
  margin-left: 30px;
  position: relative;
  //border-bottom: 1px solid ${COLORS.BORDER_GRAY};
  padding: 0 0 26px;
  
  &:last-child {
    border-bottom: none;
  }
`

const Kohdenumero = styled.span`
  font-size: 20px;
  position: absolute;
  left: -30px;
`

const Otsikko = styled.h3`
  text-transform: uppercase;
  font-size: 20px;
`

const ControlsWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const BottomWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

//
// Tutkintojen lisäämisen tyylikomponentit
//
const AddWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 3;
`

const AddContent = styled.div`
  position: relative;
  margin: 30px;
  background-color: ${COLORS.WHITE};
`

class MuutospyyntoWizardTutkinnot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isRemoving: false,
      isAdding: false
    }

    this.renderRemoveTutkinnot = this.renderRemoveTutkinnot.bind(this)
    this.toggleIsRemoving = this.toggleIsRemoving.bind(this)
    this.toggleIsAdding = this.toggleIsAdding.bind(this)
    this.renderAddKoulutuksia = this.renderAddKoulutuksia.bind(this)
  }

  componentWillMount() {
    if (!this.props.koulutusalat.fetched && !this.props.koulutusalat.hasErrored) {
      this.props.fetchKoulutusalat()
        .then(() => {
          if (this.props.koulutusalat.fetched && !this.props.koulutusalat.hasErrored) {
            this.props.koulutusalat.data.forEach(ala => {
              if (ala.koodiArvo !== '00') {
                this.props.fetchKoulutukset(ala.koodiArvo, ala.metadata)
              } else if (ala.koodiArvo !== '99') {
                this.props.fetchKoulutukset(ala.koodiArvo, ala.metadata)
              }
            })
          }
        })
    }
  }

  toggleIsRemoving(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({ isRemoving: !this.state.isRemoving })
  }

  toggleIsAdding(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({ isAdding: !this.state.isAdding })
  }

  render() {
    const { handleSubmit, lupa, poistettavatValue, lisattavatValue } = this.props
    const { isRemoving, isAdding } = this.state
    const { kohteet } = lupa
    const data = this.props.koulutukset.treedata

    const removeBool = poistettavatValue === undefined || poistettavatValue.length === 0
    const addBool = lisattavatValue === undefined || lisattavatValue.length === 0

    let isDisabled = true

    if ((removeBool === false) ||(addBool === false)) {
      isDisabled = false
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <FieldArray
            name="poistettavat"
            kohde={kohteet[1]}
            isRemoving={isRemoving}
            poistettavatValue={poistettavatValue}
            component={this.renderRemoveTutkinnot}
          />

          {isAdding
            ?
            <FieldArray
              name="lisattavat"
              data={data}
              isAdding={isAdding}
              lisattavatValue={lisattavatValue}
              component={this.renderAddKoulutuksia}
            />
            : null
          }

          <BottomWrapper>
              {/*{isRemoving*/}
                {/*?*/}
                  {/*<div>*/}
                    {/*<WizButton disabled={poistettavatValue === undefined || poistettavatValue.length === 0} bgColor={COLORS.OIVA_GREEN}>Poista valitut</WizButton>*/}
                    {/*<WizButton bgColor={COLORS.OIVA_RED} onClick={this.toggleIsRemoving}>Peruuta</WizButton>*/}
                  {/*</div>*/}
                {/*:*/}
                  {/*<div>*/}
                    {/*<WizButton onClick={this.toggleIsAdding}>*/}
                      {/*Lisää tutkintoja*/}
                    {/*</WizButton>*/}
                    {/*<WizButton bgColor={COLORS.OIVA_RED} onClick={this.toggleIsRemoving}>*/}
                      {/*Poista tutkintoja*/}
                    {/*</WizButton>*/}
                  {/*</div>*/}
              {/*}*/}
              <WizButton type="submit" disabled={isDisabled || isRemoving}>Seuraava</WizButton>
          </BottomWrapper>
        </form>
      </div>
    )
  }

  renderRemoveTutkinnot(props) {
    let { fields } = props
    const { isRemoving, poistettavatValue, kohde } = props
    const { kohdeid, heading, maaraykset, muutMaaraykset } = kohde

    return (
      <Kohde>
        <Kohdenumero>{kohdeid}.</Kohdenumero>
        <Otsikko>{heading}</Otsikko>

        {isRemoving
          ?
            <ControlsWrapper>
              <WizButton
                disabled={poistettavatValue === undefined || poistettavatValue.length === 0}
                bgColor={COLORS.OIVA_GREEN}
                onClick={this.toggleIsRemoving}
              >
                Poista valitut
              </WizButton>
              <WizButton bgColor={COLORS.OIVA_RED} onClick={(e) => {
                e.preventDefault()
                fields.removeAll()
                this.toggleIsRemoving()
              }}
              >
                Peruuta
              </WizButton>
            </ControlsWrapper>
          :
          <ControlsWrapper>
            <WizButton onClick={this.toggleIsAdding}>Lisää tutkintoja</WizButton>
            <WizButton bgColor={COLORS.OIVA_RED} onClick={this.toggleIsRemoving}>Poista tutkintoja</WizButton>
          </ControlsWrapper>
        }

        {maaraykset.map(({ koodi, nimi, koulutusalat }) => {
          return (
            <KoulutusAlaList
              key={koodi}
              koodi={koodi}
              nimi={nimi}
              koulutusalat={koulutusalat}
              fields={fields}
              isRemoving={isRemoving}
              poistettavatValue={poistettavatValue}
            />
          )
        })}
      </Kohde>
    )
  }

  renderAddKoulutuksia(props) {
    const { data, lisattavatValue } = props
    let { fields } = props

    return (
      <AddWrapper>
        <ContentContainer>
          <AddContent>
            <WizButton disabled={lisattavatValue === undefined || lisattavatValue.length === 0} onClick={this.toggleIsAdding}>Lisää valitut</WizButton>
            <WizButton
              bgColor={COLORS.OIVA_RED}
              onClick={(e) => {
                e.preventDefault()
                fields.removeAll()
                this.toggleIsAdding()
              }}
            >
              Peruuta
            </WizButton>

            <div>
              {_.map(data, koulutusala => {
                const { koodiarvo, metadata, koulutukset } = koulutusala
                const nimi = parseLocalizedField(metadata)
                return (
                  <div key={koodiarvo}>
                    <div>{koodiarvo}&nbsp;{nimi}</div>
                    {_.map(koulutukset, (koulutus, indeksi) => {
                      const { koodiarvo, nimi } = koulutus
                      return (
                        <div key={indeksi}>
                          <input type="checkbox" onChange={(event) => {
                            const { checked } = event.target
                            if (checked) {
                              fields.push(koodiarvo)
                            } else {
                              let i = undefined
                              _.forEach(lisattavatValue, (value, idx) => {
                                if (value === koodiarvo) {
                                  i = idx
                                }
                              })
                              fields.remove(i)
                            }
                          }}/>
                          {koodiarvo}&nbsp;{nimi}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </AddContent>
        </ContentContainer>
      </AddWrapper>
    )
  }
}

class KoulutusAlaList extends Component {
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

  getTutkintoCount(koulutusalat) {
    let count = 0

    _.forEach(koulutusalat, (ala) => {
      count += ala.tutkinnot.length
    })

    return count
  }

  render() {
    const { koodi, nimi, koulutusalat, isRemoving, fields, poistettavatValue } = this.props

    console.log(this.props)

    return (
      <Wrapper>
        <Heading onClick={this.toggleTutkintoList.bind(this)}>
          <Arrow src={arrow} alt="Koulutusala" rotated={!this.state.isHidden} />
          <Span>{koodi}</Span>
          <Span>{nimi}</Span>
          <Span>{`( ${this.getTutkintoCount(koulutusalat)} kpl )`}</Span>
        </Heading>
        {!this.state.isHidden &&
        <KoulutusalaListWrapper>
          {_.map(koulutusalat, (ala, i) => <KoulutuksetList isRemoving={isRemoving} fields={fields} poistettavatValue={poistettavatValue} {...ala} key={i} /> )}
        </KoulutusalaListWrapper>
        }
      </Wrapper>
    )
  }
}



const KoulutuksetList = (props) => {
  const { tutkinnot, nimi, koodi, isRemoving, poistettavatValue } = props
  let { fields } = props

  return (
    <KoulutusTyyppiWrapper key={koodi}>
      {nimi}
      {tutkinnot.map(({ koodi, nimi, maaraysId }) => {
        return (
          <TutkintoWrapper key={koodi}>
            {isRemoving
              ?
              <input type="checkbox" onChange={(event) => {
                const { checked } = event.target
                if (checked) {
                  fields.push(maaraysId)
                } else {
                  let i = undefined
                  _.forEach(poistettavatValue, (value, idx) => {
                    if (value === maaraysId) {
                      i = idx
                    }
                  })
                  fields.remove(i)
                }
              }}/>
              : null
            }
            <Koodi>{koodi}</Koodi>
            <Nimi>{nimi}</Nimi>
          </TutkintoWrapper>
        )
      })}
    </KoulutusTyyppiWrapper>
  )
}

const selector = formValueSelector('uusi-hakemus')

MuutospyyntoWizardTutkinnot = connect(state => {
  const poistettavatValue = selector(state, 'poistettavat')
  const lisattavatValue = selector(state, 'lisattavat')

  return {
    poistettavatValue,
    lisattavatValue,
    koulutusalat: state.koulutusalat,
    koulutukset: state.koulutukset
  }
})(MuutospyyntoWizardTutkinnot)

export default reduxForm({
  form: 'uusi-hakemus',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(MuutospyyntoWizardTutkinnot)
