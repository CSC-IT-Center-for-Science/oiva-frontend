import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'
import validate from '../modules/validateValmistelu'
import { COLORS } from "../../../../modules/styles"
import { WizButton } from "./ValmisteluWizard"
import TutkintoList from './ValmisteluTutkinnotList'
import { parseLocalizedField } from "../../../../modules/helpers"
import { ContentContainer } from "../../../../modules/elements"
import {
    getTutkintoKoodiByMaaraysId,
    getTutkintoNimiByKoodiarvo,
    getTutkintoNimiByMaaraysId
} from "../modules/valmisteluUtils"
import {
    Kohdenumero,
    Otsikko,
    BottomWrapper,
    Row,
    Kohde
} from './ValmisteluComponents'

class MuutospyyntoWizardTutkinnot extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        if (!this.props.koulutusalat.fetched && !this.props.koulutusalat.hasErrored) {
            this.props.fetchKoulutusalat()
                .then(() => {
                    if (this.props.koulutusalat.fetched && !this.props.koulutusalat.hasErrored) {
                        this.props.fetchKoulutuksetAll()
                    }
                })
        }
    }

    render() {
        const { handleSubmit, lupa, tutkintomuutoksetValue, onCancel, previousPage } = this.props
        const { kohteet } = lupa
        const koulutusdata = this.props.koulutukset.koulutusdata
        const tutkintomuutoksetBool = tutkintomuutoksetValue === undefined || tutkintomuutoksetValue.length === 0

        let isDisabled = true
        let hasAdditions = false
        let hasRemovals = false

        if (!tutkintomuutoksetBool) {
            isDisabled = false

            tutkintomuutoksetValue.forEach(muutos => {
                if (muutos.type === "addition") {
                    hasAdditions = true
                } else if (muutos.type === "removal") {
                    hasRemovals = true
                }
            })
        }

        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <Row>
                        <FieldArray
                            name="tutkintomuutokset"
                            kohde={kohteet[1]}
                            lupa={lupa}
                            data={koulutusdata}
                            editValue={tutkintomuutoksetValue}
                            component={this.renderTutkinnot}
                        />
                    </Row>

                    <Row marginLeft="30px">
                        <h3>Lisätyt tutkinnot</h3>
                        {hasAdditions
                            ? tutkintomuutoksetValue.map(muutos => {
                                if (muutos.type === "addition") {
                                    return <div key={muutos.koodiarvo}>{JSON.stringify(muutos)} {getTutkintoNimiByKoodiarvo(muutos.koodiarvo)}</div>
                                } else {
                                    return null
                                }
                            })
                            : 'Ei lisättäviä tutkintoja'
                        }
                    </Row>

                    <Row marginLeft="30px">
                        <h3>Poistettavat tutkinnot</h3>
                        <div>
                            {hasRemovals
                                ? tutkintomuutoksetValue.map(muutos => {
                                    if (muutos.type === "removal") {
                                        return <div key={muutos.koodiarvo}>{JSON.stringify(muutos)} {getTutkintoNimiByKoodiarvo(muutos.koodiarvo)}</div>
                                    } else {
                                        return null
                                    }
                                })
                                : 'Ei poistettavia tutkintoja'
                            }
                        </div>
                    </Row>

                    <BottomWrapper>
                        <WizButton type="button" onClick={previousPage}>
                            Edellinen
                        </WizButton>
                        <WizButton type="submit" disabled={isDisabled}>Seuraava</WizButton>
                        <WizButton bgColor={COLORS.OIVA_RED} onClick={(e) => onCancel(e)}>Peruuta</WizButton>
                    </BottomWrapper>
                </form>
            </div>
        )
    }

    renderTutkinnot(props) {

        let { fields, data } = props
        const { kohde, lupa, editValue } = props
        const { headingNumber, heading, maaraykset, muutMaaraykset } = kohde

        data = _.sortBy(data, d => {
            return d.koodiArvo
        })

        return (
            <Kohde>
                <ContentContainer>
                    <Kohdenumero>{headingNumber}.</Kohdenumero>
                    <Otsikko>{heading}</Otsikko>
                    <Row>
                        {_.map(data, (koulutusala, i) => {
                            const koodiarvo = koulutusala.koodiarvo || koulutusala.koodiArvo
                            const { metadata, koulutukset } = koulutusala
                            const nimi = parseLocalizedField(metadata)
                            return (
                                <TutkintoList
                                    key={i}
                                    koodiarvo={koodiarvo}
                                    nimi={nimi}
                                    koulutukset={koulutukset}
                                    maaraykset={maaraykset}
                                    editValues={editValue}
                                    fields={fields}
                                    showHelp={this.props.showHelp}
                                />
                            )
                        })}
                    </Row>
                </ContentContainer>
            </Kohde>
        )
    }
}

const selector = formValueSelector('uusiHakemus')

MuutospyyntoWizardTutkinnot = connect(state => {
    const tutkintomuutoksetValue = selector(state, 'tutkintomuutokset')

    return {
        tutkintomuutoksetValue,
        koulutusalat: state.koulutusalat,
        koulutukset: state.koulutukset
    }
})(MuutospyyntoWizardTutkinnot)

export default reduxForm({
    form: 'uusiHakemus',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(MuutospyyntoWizardTutkinnot)
