import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector, FieldArray, Field } from 'redux-form'
import Modal from 'react-modal'

import validate from '../modules/validateValmistelu'
import { WizardBottom, Container, SubtleButton, Button, FormGroup, Label, FormField, SelectStyle, TextareaLabel  } from "./ValmisteluComponents"
import { VALMISTELU_WIZARD_TEKSTIT, FIELD_ARRAY_NAMES } from "../../modules/constants"
import { modalStyles, ModalButton, ModalText, Content } from "./ModalComponents"
import DatePicker from "../../../../modules/DatePicker"


Modal.setAppElement('#root')

class ValmisteluWizardTiedot extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isSendModalOpen: false
        }

        this.openSendModal = this.openSendModal.bind(this)
        this.afterOpenSendModal = this.afterOpenSendModal.bind(this)
        this.closeSendModal = this.closeSendModal.bind(this)
        this.renderHakijanTiedot = this.renderHakijanTiedot.bind(this)
        this.renderField = this.renderField.bind(this)
        this.renderDatePicker = this.renderDatePicker.bind(this)
    }

    openSendModal(e) {
        e.preventDefault()
        this.setState({ isSendModalOpen: true })
    }

    afterOpenSendModal() {
    }

    closeSendModal() {
        this.setState({ isSendModalOpen: false })
    }

    render() {
        const {
            onSubmit,
            formValues,
            lupa,
        } = this.props

        let jarjestaja = undefined
        if (lupa && lupa.fetched) {
            jarjestaja = lupa.data.jarjestaja
        }

        setTimeout(() => console.log('yhteenveto ', formValues), 400)

        return (
            <div>
                <h2>{VALMISTELU_WIZARD_TEKSTIT.TIEDOT.HEADING.FI}</h2>

                <form onSubmit={onSubmit}>

                    <FieldArray
                        name={FIELD_ARRAY_NAMES.HAKIJAN_TIEDOT}
                        component={this.renderHakijanTiedot}
                    />

                    <WizardBottom>
                        <Container maxWidth="1085px" padding="15px">
                            <Button type="submit" className="next button-right">Seuraava</Button>

                            <div>
                                <SubtleButton disabled>Tallenna luonnos</SubtleButton>
                            </div>
                            <Button  onClick={this.openSendModal} type="submit" className="next button-right">Lähetä allekirjoitettavaksi</Button>
                        </Container>
                    </WizardBottom>

                    <Modal
                        isOpen={this.state.isSendModalOpen}
                        onAfterOpen={this.afterOpenSendModal}
                        onRequestClose={this.closeSendModal}
                        contentLabel="Lähetä allekirjoitettavaksi"
                        style={modalStyles}
                    >
                        <Content>
                            <ModalText>Oletko varma, että haluat lähettää päätöksen allekirjoitettavaksi?</ModalText>
                        </Content>
                        <div>
                            <ModalButton primary onClick={onSubmit}>Kyllä</ModalButton>
                            <ModalButton onClick={this.closeSendModal}>Ei</ModalButton>
                        </div>
                    </Modal>
                </form>
            </div>
        )
    }

    renderHakijanTiedot() {
        return (
            <div>
                <Field
                    name="paatos.diaarinumero"
                    type="text"
                    label="Diaarinumero"
                    component={this.renderField}
                />
                <Field
                    name="paatos.paatospvm"
                    type="text"
                    label="Päätöksen päivämäärä"
                    component={this.renderDatePicker}
                />
                <Field
                    name="paatos.esittelija"
                    type="text"
                    label="Esittelijän nimi"
                    component={this.renderField}
                />
                <Field
                    name="paatos.esittelija_titteli"
                    type="text"
                    label="Esittelijän titteli"
                    component={this.renderField}
                />
                <Field
                    name="paatos.ministeri"
                    type="text"
                    label="Ministerin nimi"
                    component={this.renderField}
                />
                <Field
                    name="paatos.ministeri_titteli"
                    type="text"
                    label="Ministerin titteli"
                    component={this.renderField}
                />
                <Field
                    name="paatos.paatoskirje_id"
                    type="select"
                    label="Päätöskirjeen pohja"
                    component={this.renderSelect}
                />
                <Field
                    name="paatos.paatoskirje"
                    type="text"
                    label="Päätöskirjeen teksti"
                    component={this.renderTextArea}
                />
            </div>
        )
    }

    renderField({ input, label, type, meta: { touched, error } }) {
        return (
            <FormGroup>
                <Label>{label}</Label>
                <FormField>
                    <input {...input} type={type} />
                    {touched && error && <span>{error}</span>}
                </FormField>
            </FormGroup>
        )
    }

    renderSelect({ input, label, type, meta: { touched, error } }) {
        return (
            <FormGroup>
                <Label>{label}</Label>
                <FormField>
                    <SelectStyle>
                        <select disabled><option>valitse</option></select>
                    </SelectStyle>
                </FormField>
            </FormGroup>
        )
    }

    renderTextArea({label}){
        return (
            <FormGroup>
                <TextareaLabel>{label}</TextareaLabel>
                <FormField>
                    <textarea
                    rows="10"
                    //defaultValue={paatos !== null ? perustelu : undefined}
                    />
                </FormField>
            </FormGroup>
        )
    }

    renderDatePicker(props) {
        const { input, label } = props
        return (
            <FormGroup>
                <Label>{label}</Label>
                <FormField>
                    <DatePicker customInput={input} handleChange={input.onChange} />
                </FormField>
            </FormGroup>
        )
    }
}

const selector = formValueSelector('uusiPaatos')

ValmisteluWizardTiedot = reduxForm({
    form: 'uusiPaatos',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(ValmisteluWizardTiedot)

export default connect(state => {
    const paatoskierros = selector(state, 'paatoskierros')
    const tutkinnotjakoulutuksetValue = selector(state, FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET)
    const opetusjatutkintokieletValue = selector(state, FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET)
    const toimialueValue = selector(state, FIELD_ARRAY_NAMES.TOIMINTA_ALUEET)
    const opiskelijavuosiValue = selector(state, FIELD_ARRAY_NAMES.OPISKELIJAVUODET)
    const muutmuutoksetValue = selector(state, FIELD_ARRAY_NAMES.MUUT)

    let formVals = undefined
    if (state.form && state.form.uusiPaatos && state.form.uusiPaatos.values) {
        formVals = state.form.uusiPaatos.values
    }

    return {
        formValues: formVals,
        paatoskierros,
        tutkinnotjakoulutuksetValue,
        opetusjatutkintokieletValue,
        toimialueValue,
        opiskelijavuosiValue,
        muutmuutoksetValue,
        lupa: state.lupa,
        muutosperustelut: state.muutosperustelut,
        paatoskierrokset: state.paatoskierrokset
    }
})(ValmisteluWizardTiedot)
