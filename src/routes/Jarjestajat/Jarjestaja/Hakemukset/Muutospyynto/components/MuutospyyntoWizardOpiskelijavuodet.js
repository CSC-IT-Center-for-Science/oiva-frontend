import _ from "lodash";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { FieldArray, reduxForm, formValueSelector } from "redux-form";
import styled from "styled-components";

import { ContentContainer } from "../../../../../../modules/elements";
import { Kohdenumero, Otsikko, Row } from "./MuutospyyntoWizardComponents";
import { getOpiskelijavuosiIndex } from "../modules/koulutusUtil";
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants";
import {
  FIELD_ARRAY_NAMES,
  FORM_NAME_UUSI_HAKEMUS,
  MUUTOS_TYPES,
  OPISKELIJAVUODET_KATEGORIAT
} from "../modules/uusiHakemusFormConstants";
import {
  getKohdeByTunniste,
  getMaaraystyyppiByTunniste
} from "../modules/muutospyyntoUtil";
import { KOHTEET, MAARAYSTYYPIT } from "../../../modules/constants";

const Opiskelijavuosi = styled.div`
  display: flex;
`;
const Voimassaoleva = styled.div`
  flex: 1;
  margin-right: 10px;
`;
const HaettuMuutos = styled.div`
  flex: 1;
  margin-right: 10px;
`;
const Yhteensa = styled.div`
  flex: 1;
  margin-right: 10px;
`;

const Pakollinen = styled.h4`
  background-color: #ffc;
  padding: 3px;
`;

class MuutospyyntoWizardOpiskelijavuodet extends Component {
  componentDidUpdate() {
    const fixedHeaderHeight = 100;
    const marginaali = 10;
    const { opiskelijavuosimuutoksetValue, muutmuutoksetValue } = this.props;

    const pakollisetVuosikentat = [
      { koodiarvo: "2", ref: this.refs.opiskelijavuodetVaativatuki },
      { koodiarvo: "4", ref: this.refs.opiskelijavuodetSisaoppilaitos }
    ];

    pakollisetVuosikentat.some(kentta => {
      // Jos lupaan on lisätty vähimmäisvuodet vaativa tehtävä, kentän arvo on tyhjä
      // eikä kenttä ole näkyvissä, skrollaa kentän luo
      if (
        _.find(muutmuutoksetValue, obj => {
          return (
            obj.koodiarvo === kentta.koodiarvo &&
            obj.type === MUUTOS_TYPES.ADDITION
          );
        }) &&
        (!opiskelijavuosimuutoksetValue ||
          !_.find(opiskelijavuosimuutoksetValue, obj => {
            return obj.koodiarvo === kentta.koodiarvo;
          }) ||
          _.find(opiskelijavuosimuutoksetValue, obj => {
            return obj.koodiarvo === kentta.koodiarvo && !obj.arvo;
          }))
      ) {
        const elementti = ReactDOM.findDOMNode(kentta.ref);
        if (elementti) {
          // Skrollaa elementti ensin sivun yläreunaan ja siirrä sitten alaspäin,
          // jotta elementti ei jää kiinteän headerin taakse
          elementti.scrollIntoView();
          const scrolledY = window.scrollY;
          if (scrolledY) {
            window.scroll(0, scrolledY - fixedHeaderHeight - marginaali);
          }
        }
        // Skrollaa vain yhden kentän luo
        return true;
      }
      return false;
    });
  }

  render() {
    const {
      lupa,
      opiskelijavuosimuutoksetValue,
      muutmuutoksetValue
    } = this.props;
    const { kohteet } = lupa;
    const { headingNumber, heading, opiskelijavuodet } = kohteet[4];
    const { muutCombined } = kohteet[5];

    // Vahimmaisopiskelijavuosimäärä
    const obj = _.find(opiskelijavuodet, obj => {
      return obj.tyyppi === "Ammatillinen koulutus";
    });
    let vahimmaisArvoInitial = 0;
    if (obj) {
      vahimmaisArvoInitial = obj.arvo;
    }

    // Vaativa erityisopetus (2)

    // tarkistetaan onko voimassaolevassa luvassa tälle määräystä:
    const vaativaTukiVoimassa = _.find(muutCombined, obj => {
      return obj.koodiarvo === "2";
    });
    // tarkitetaan onko käyttäjä valinnut lisättäväksi lupaan kohdassa 5
    const vaativaTukiLisattava = _.find(muutmuutoksetValue, obj => {
      return obj.koodiarvo === "2";
    });
    // oletusarvo
    let vaativaArvoInitial = undefined;
    let showVaativa = false;

    if (vaativaTukiVoimassa) {
      showVaativa = true;
    }

    if (vaativaTukiLisattava) {
      vaativaTukiLisattava.type === MUUTOS_TYPES.ADDITION
        ? (showVaativa = true)
        : (showVaativa = false);
    }

    // Sisäoppilaitos (4)

    // tarkistetaan onko voimassaolevassa luvassa tälle määräystä:
    const sisaoppilaitosVoimassa = _.find(muutCombined, obj => {
      return obj.koodiarvo === "4";
    });

    // tarkistetaan käyttäjä valinnut lisättäväksi lupaan kohdassa 5:
    const sisaoppilaitosLisattava = _.find(muutmuutoksetValue, obj => {
      return obj.koodiarvo === "4";
    });

    // oletusarvo
    let sisaoppilaitosArvoInitial = undefined;
    let showSisaoppilaitos = false;

    if (sisaoppilaitosVoimassa) {
      showSisaoppilaitos = true;
    }

    if (sisaoppilaitosLisattava) {
      sisaoppilaitosLisattava.type === MUUTOS_TYPES.ADDITION
        ? (showSisaoppilaitos = true)
        : (showSisaoppilaitos = false);
    }

    let haettuVahimmaismaaraObj = _.find(
      opiskelijavuosimuutoksetValue,
      value => {
        return value.kategoria === "vahimmaisopiskelijavuodet";
      }
    );
    let muutos = 0;

    if (haettuVahimmaismaaraObj) {
      muutos = haettuVahimmaismaaraObj.arvo - vahimmaisArvoInitial;
      if (muutos > 0) muutos = "+" + muutos;
    }

    let haettuVaativaObj = _.find(opiskelijavuosimuutoksetValue, value => {
      return value.kategoria === "vaativa";
    });
    let muutosVaativa = 0;

    if (haettuVaativaObj) {
      muutosVaativa =
        Number.parseInt(haettuVaativaObj.arvo, 10) -
        (vaativaArvoInitial ? vaativaArvoInitial : 0);
      if (muutosVaativa > 0) muutosVaativa = "+" + muutosVaativa;
    }

    let haettuSisaoppilaitosObj = _.find(
      opiskelijavuosimuutoksetValue,
      value => {
        return value.kategoria === "sisaoppilaitos";
      }
    );
    let muutosSisaoppilaitos = 0;

    if (haettuSisaoppilaitosObj) {
      muutosSisaoppilaitos =
        Number.parseInt(haettuSisaoppilaitosObj.arvo, 10) -
        (sisaoppilaitosArvoInitial ? sisaoppilaitosArvoInitial : 0);
      if (muutosSisaoppilaitos > 0)
        muutosSisaoppilaitos = "+" + muutosSisaoppilaitos;
    }

    return (
      <ContentContainer>
        <Kohdenumero>{headingNumber}.</Kohdenumero>
        <Otsikko>{heading}</Otsikko>
        <Row>
          <h4>
            {MUUTOS_WIZARD_TEKSTIT.MUUTOS_OPISKELIJAVUODET.VAHIMMAISMAARA.FI}
          </h4>
          <Opiskelijavuosi>
            <Voimassaoleva>NYKYINEN</Voimassaoleva>
            <HaettuMuutos>HAETTAVA</HaettuMuutos>
            <Yhteensa>MUUTOS</Yhteensa>
          </Opiskelijavuosi>
          <Opiskelijavuosi>
            <Voimassaoleva>{vahimmaisArvoInitial}</Voimassaoleva>
            <HaettuMuutos>
              <FieldArray
                name={FIELD_ARRAY_NAMES.OPISKELIJAVUODET}
                initialValue={""}
                editValues={opiskelijavuosimuutoksetValue}
                kategoria={
                  OPISKELIJAVUODET_KATEGORIAT.VAHIMMAISOPISKELIJAVUODET
                }
                koodisto="koulutussektori"
                koodiarvo="3"
                tyyppi={MUUTOS_TYPES.CHANGE}
                component={this.renderOpiskelijavuodet}
              />
            </HaettuMuutos>
            <Yhteensa>{muutos}</Yhteensa>
          </Opiskelijavuosi>
        </Row>

        {showVaativa ? (
          <Row>
            <Pakollinen ref="opiskelijavuodetVaativatuki">
              {MUUTOS_WIZARD_TEKSTIT.MUUTOS_OPISKELIJAVUODET.VAATIVA_TUKI.FI}
            </Pakollinen>
            <Opiskelijavuosi>
              <Voimassaoleva>NYKYINEN</Voimassaoleva>
              <HaettuMuutos>HAETTAVA</HaettuMuutos>
              <Yhteensa>MUUTOS</Yhteensa>
            </Opiskelijavuosi>
            <Opiskelijavuosi>
              <Voimassaoleva>{vaativaArvoInitial}</Voimassaoleva>
              <HaettuMuutos>
                <FieldArray
                  name={FIELD_ARRAY_NAMES.OPISKELIJAVUODET}
                  initialValue={""}
                  editValues={opiskelijavuosimuutoksetValue}
                  kategoria={OPISKELIJAVUODET_KATEGORIAT.VAATIVA}
                  koodisto="oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                  koodiarvo="2"
                  tyyppi={
                    vaativaArvoInitial !== undefined
                      ? MUUTOS_TYPES.CHANGE
                      : MUUTOS_TYPES.ADDITION
                  }
                  component={this.renderOpiskelijavuodet}
                />
              </HaettuMuutos>
              <Yhteensa>{muutosVaativa}</Yhteensa>
            </Opiskelijavuosi>
          </Row>
        ) : null}

        {showSisaoppilaitos ? (
          <Row>
            <Pakollinen ref="opiskelijavuodetSisaoppilaitos">
              {MUUTOS_WIZARD_TEKSTIT.MUUTOS_OPISKELIJAVUODET.SISAOPPILAITOS.FI}
            </Pakollinen>
            <Opiskelijavuosi>
              <Voimassaoleva>NYKYINEN</Voimassaoleva>
              <HaettuMuutos>HAETTAVA</HaettuMuutos>
              <Yhteensa>MUUTOS</Yhteensa>
            </Opiskelijavuosi>
            <Opiskelijavuosi>
              <Voimassaoleva>{sisaoppilaitosArvoInitial}</Voimassaoleva>
              <HaettuMuutos>
                <FieldArray
                  name={FIELD_ARRAY_NAMES.OPISKELIJAVUODET}
                  initialValue={""}
                  editValues={opiskelijavuosimuutoksetValue}
                  kategoria={OPISKELIJAVUODET_KATEGORIAT.SISAOPPILAITOS}
                  koodisto="oivamuutoikeudetvelvollisuudetehdotjatehtavat"
                  koodiarvo="4"
                  tyyppi={
                    sisaoppilaitosArvoInitial !== undefined
                      ? MUUTOS_TYPES.CHANGE
                      : MUUTOS_TYPES.ADDITION
                  }
                  component={this.renderOpiskelijavuodet}
                />
              </HaettuMuutos>
              <Yhteensa>{muutosSisaoppilaitos}</Yhteensa>
            </Opiskelijavuosi>
          </Row>
        ) : null}
      </ContentContainer>
    );
  }

  renderOpiskelijavuodet(props) {
    const {
      initialValue,
      editValues,
      fields,
      kategoria,
      koodiarvo,
      koodisto,
      tyyppi
    } = props;

    let arvo = initialValue;

    if (editValues) {
      // aseta uusi arvo
      let obj = _.find(editValues, value => {
        return value.kategoria === kategoria;
      });
      if (obj) {
        arvo = obj.arvo;
      }
    }

    const kohde = getKohdeByTunniste(KOHTEET.OPISKELIJAVUODET);
    const tunniste =
      kategoria === OPISKELIJAVUODET_KATEGORIAT.VAHIMMAISOPISKELIJAVUODET
        ? MAARAYSTYYPIT.OIKEUS
        : kategoria === OPISKELIJAVUODET_KATEGORIAT.SISAOPPILAITOS ||
          OPISKELIJAVUODET_KATEGORIAT.VAATIVA
        ? MAARAYSTYYPIT.RAJOITE
        : MAARAYSTYYPIT.OIKEUS;
    const maaraystyyppi = getMaaraystyyppiByTunniste(tunniste);

    return (
      <input
        type="number"
        value={arvo}
        onChange={e => {
          const { value } = e.target;
          if (editValues) {
            const i = getOpiskelijavuosiIndex(editValues, koodiarvo);
            if (i !== undefined) {
              if (
                (value === "" && initialValue === undefined) ||
                value === initialValue
              ) {
                fields.remove(i);
              } else {
                const obj = {
                  type: tyyppi,
                  kategoria,
                  koodiarvo,
                  koodisto,
                  kohde,
                  maaraystyyppi,
                  arvo: value,
                  meta: { perusteluteksti: null, muutosperustelukoodiarvo: [] }
                };
                fields.remove(i);
                fields.insert(i, obj);
              }
            } else {
              fields.push({
                type: tyyppi,
                kategoria,
                koodiarvo,
                koodisto,
                kohde,
                maaraystyyppi,
                arvo: value,
                meta: { perusteluteksti: null, muutosperustelukoodiarvo: [] }
              });
            }
          } else {
            fields.push({
              type: tyyppi,
              kategoria,
              koodiarvo,
              koodisto,
              kohde,
              maaraystyyppi,
              arvo: value,
              meta: { perusteluteksti: null, muutosperustelukoodiarvo: [] }
            });
          }
        }}
      />
    );
  }
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS);

MuutospyyntoWizardOpiskelijavuodet = connect(state => {
  const opiskelijavuosimuutoksetValue = selector(
    state,
    FIELD_ARRAY_NAMES.OPISKELIJAVUODET
  );
  const muutmuutoksetValue = selector(state, FIELD_ARRAY_NAMES.MUUT);

  return {
    opiskelijavuosimuutoksetValue,
    muutmuutoksetValue
  };
})(MuutospyyntoWizardOpiskelijavuodet);

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
  //validate
})(MuutospyyntoWizardOpiskelijavuodet);
