import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm, formValueSelector } from "redux-form";
import Select from "react-select";

import Loading from "../../../../../../modules/Loading";
import { ContentContainer } from "../../../../../../modules/elements";

import { KOHTEET, MAARAYSTYYPIT } from "../../../modules/constants";

import { handleSimpleCheckboxChange } from "../modules/koulutusUtil";
import {
  getKohdeByTunniste,
  getMaaraystyyppiByTunniste
} from "../modules/muutospyyntoUtil";
import { getToimialueByKoodiArvo, onVoimassa } from "../modules/toimialueUtil";
import {
  FIELD_ARRAY_NAMES,
  FORM_NAME_UUSI_HAKEMUS,
  HAKEMUS_OHJEET,
  HAKEMUS_VIESTI,
  HAKEMUS_VIRHE,
  MUUTOS_TYPES,
  HAKEMUS_OTSIKOT
} from "../modules/uusiHakemusFormConstants";

import {
  Kohdenumero,
  Otsikko,
  Row,
  CheckboxRowContainer,
  Checkbox,
  Nimi
} from "./MuutospyyntoWizardComponents";

class MuutospyyntoWizardToimialue extends Component {
  componentWillMount() {
    const { maakuntakunnat } = this.props;
    if (maakuntakunnat && !maakuntakunnat.fetched) {
      this.props.fetchMaakuntakunnat();
    }
  }

  render() {
    const {
      lupa,
      valtakunnallinenmuutoksetValue,
      toimialuemuutoksetValue,
      maakuntakunnat
    } = this.props;
    const { kohteet } = lupa;
    const { headingNumber, heading } = kohteet[3];
    const maakuntaMaaraykset = kohteet[3].maakunnat;
    const kuntaMaaraykset = kohteet[3].kunnat;
    const valtakunnallinen = kohteet[3].valtakunnallinen || false;

    if (maakuntakunnat.fetched) {
      return (
        <ContentContainer>
          <Kohdenumero>{headingNumber}.</Kohdenumero>
          <Otsikko>{heading}</Otsikko>
          <Row>
            <p>{HAKEMUS_OHJEET.TOIMINTAALUE.FI}</p>
          </Row>
          <Row>
            <FieldArray
              name={FIELD_ARRAY_NAMES.TOIMINTA_ALUEET}
              maakunnatLuvassa={maakuntaMaaraykset}
              kunnatLuvassa={kuntaMaaraykset}
              toimialuemuutokset={toimialuemuutoksetValue}
              maakuntakunnatList={maakuntakunnat.maakuntakunnatList}
              component={this.renderToimialueMuutokset}
            />
          </Row>
          <Row>
            <FieldArray
              name="valtakunnallinen"
              editValues={valtakunnallinenmuutoksetValue}
              valtakunnallinen={valtakunnallinen}
              component={this.renderValtakunnallinen}
            />
          </Row>
        </ContentContainer>
      );
    } else if (maakuntakunnat.hasErrored) {
      return <h2>{HAKEMUS_VIRHE.TOIMINTAALUE.FI}</h2>;
    } else if (maakuntakunnat.isFetching) {
      return <Loading />;
    } else {
      return null;
    }
  }

  renderToimialueMuutokset(props) {
    const {
      maakunnatLuvassa,
      kunnatLuvassa,
      maakuntakunnatList,
      toimialuemuutokset,
      fields
    } = props;
    let opts = []; // kaikki olemassa olevat alueet
    let initialValue = []; // luvassa olevat alueet
    let valitutMaakunnat = {}; // luvassa olevat ja lisätyt maakunnat
    let valitutKunnat = {}; // luvassa olevat ja lisätyt kunnat
    let valittuinaNaytettavatAlueet = []; // luvassa olevat ei-poistetut ja lisätyt alueet

    // opts = olemassa olevat maakunnat ja kunnat (ei lopettaneita)
    _(maakuntakunnatList)
      .filter(onVoimassa)
      .forEach(maakunta => {
        opts.push(maakunta);
        _(maakunta.kunta)
          .filter(onVoimassa)
          .forEach(kunta => {
            opts.push(kunta);
          });
      });

    // initialValues = luvassa olevat alueet
    maakunnatLuvassa.forEach(maakunta => {
      initialValue.push(maakunta.koodiarvo);
    });
    kunnatLuvassa.forEach(kunta => {
      initialValue.push(kunta.koodiarvo);
    });

    // valitutMaakunnat, valitutKunnat = luvassa olevat ja lisätyt alueet
    initialValue.forEach(value => {
      const { label, tyyppi, voimassaoloLoppuPvm } = getToimialueByKoodiArvo(
        value
      );
      const alue = { label, voimassaoloLoppuPvm, onLuvassa: true };
      if (tyyppi === "maakunta") {
        valitutMaakunnat[value] = alue;
      } else if (tyyppi === "kunta") {
        valitutKunnat[value] = alue;
      }
    });
    if (toimialuemuutokset) {
      toimialuemuutokset.forEach(value => {
        const type = value.type;
        const { label, tyyppi, voimassaoloLoppuPvm } = getToimialueByKoodiArvo(
          value.koodiArvo
        );
        if (tyyppi === "maakunta") {
          valitutMaakunnat[value.koodiArvo] = {
            ...valitutMaakunnat[value.koodiArvo],
            label,
            type,
            voimassaoloLoppuPvm
          };
        } else if (tyyppi === "kunta") {
          valitutKunnat[value.koodiArvo] = {
            ...valitutKunnat[value.koodiArvo],
            label,
            type,
            voimassaoloLoppuPvm
          };
        }
      });
    }
    valitutMaakunnat = _.values(valitutMaakunnat);
    valitutKunnat = _.values(valitutKunnat);

    // valittuinaNaytettavatAlueet = select-komponentin alkuarvo, luvassa olevat ei-poistetut ja lisätyt alueet
    if (!toimialuemuutokset) {
      valittuinaNaytettavatAlueet = initialValue;
    } else {
      const poistettavatAlueet = _.map(
        _.filter(toimialuemuutokset, muutos => {
          return muutos.type === MUUTOS_TYPES.REMOVAL;
        }),
        alue => {
          return alue.koodiArvo;
        }
      );
      const lisattavatAlueet = _.map(
        _.filter(toimialuemuutokset, muutos => {
          return muutos.type === MUUTOS_TYPES.ADDITION;
        }),
        alue => {
          return alue.koodiArvo;
        }
      );
      valittuinaNaytettavatAlueet = _.difference(
        initialValue,
        poistettavatAlueet
      ).concat(lisattavatAlueet);
    }

    return (
      <div>
        <p>{HAKEMUS_OHJEET.TOIMINTAALUE_VALINTA.FI}</p>
        <ToimialueSelect
          options={opts}
          value={valittuinaNaytettavatAlueet}
          initialValue={initialValue}
          fields={fields}
        />

        {initialValue && initialValue.length === 0 && (
          <h4>{HAKEMUS_VIESTI.TOIMINTAALUE_EI_MAARITETTY.FI}</h4>
        )}

        {valitutMaakunnat.length > 0 && (
          <div>
            <h4>Maakunnat</h4>
            {valitutMaakunnat.map(alue => {
              const { label, type } = alue;
              const customClass =
                type === MUUTOS_TYPES.REMOVAL || !onVoimassa(alue)
                  ? "is-removed"
                  : type === MUUTOS_TYPES.ADDITION
                  ? "is-added"
                  : "is-in-lupa";
              return (
                <div key={label} className={customClass}>
                  {label}
                </div>
              );
            })}
          </div>
        )}

        {valitutKunnat.length > 0 && (
          <div>
            <h4>Kunnat</h4>
            {valitutKunnat.map(alue => {
              const { label, type } = alue;
              const customClass =
                type === MUUTOS_TYPES.REMOVAL || !onVoimassa(alue)
                  ? "is-removed"
                  : type === MUUTOS_TYPES.ADDITION
                  ? "is-added"
                  : "is-in-lupa";
              return (
                <div key={label} className={customClass}>
                  {label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  renderValtakunnallinen(props) {
    const { editValues, fields } = props;
    let { valtakunnallinen } = props;

    let isInLupa = false;
    let isChecked = false;

    if (valtakunnallinen) {
      isChecked = true;
      isInLupa = true;
    } else {
      valtakunnallinen = { koodisto: "nuts1", koodiarvo: "FI1" };

      if (editValues) {
        const found = _.find(editValues, value => {
          return value.koodiarvo === "FI1";
        });
        if (found) {
          isChecked = true;
        }
      }
    }

    return (
      <div>
        <p>{HAKEMUS_OHJEET.VALTAKUNNALLINEN.FI}</p>
        <CheckboxRowContainer>
          <Checkbox>
            <input
              name="valtakunnallinencheckbox"
              id="valtakunnallinencheckbox"
              type="checkbox"
              checked={isChecked}
              onChange={e => {
                handleSimpleCheckboxChange(
                  e,
                  editValues,
                  fields,
                  isInLupa,
                  valtakunnallinen
                );
              }}
            />
            <label htmlFor="valtakunnallinencheckbox" />
          </Checkbox>
          <Nimi>{HAKEMUS_OTSIKOT.VALTAKUNNALLINEN.FI}</Nimi>
        </CheckboxRowContainer>
      </div>
    );
  }
}

class ToimialueSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      kohde: getKohdeByTunniste(KOHTEET.TOIMIALUE),
      maaraystyyppi: getMaaraystyyppiByTunniste(MAARAYSTYYPIT.VELVOITE)
    };
  }

  // Ainoa funktio, joka saa muuttaa toimialue-fieldarrayn arvoja. Ylikirjoittaa kaiken.
  handleSelectChange(value) {
    this.setState({ value });
    const { fields, initialValue } = this.props;
    const { kohde, maaraystyyppi } = this.state;

    const luvassaEiValittu = _.filter(initialValue, iVal => {
      if (
        _.find(value, val => {
          return val.koodiArvo === iVal;
        })
      ) {
        return false;
      } else {
        return true;
      }
    });
    const eiLuvassaValittu = _.filter(value, val => {
      if (
        _.find(initialValue, iVal => {
          return iVal === val.koodiArvo;
        })
      ) {
        return false;
      } else {
        return true;
      }
    });

    fields.removeAll();

    _.forEach(luvassaEiValittu, poisto => {
      const toimialue = getToimialueByKoodiArvo(poisto);
      if (onVoimassa(toimialue)) {
        fields.push({
          ...toimialue,
          type: MUUTOS_TYPES.REMOVAL,
          meta: { perusteluteksti: null },
          muutosperustelukoodiarvo: null,
          kohde,
          maaraystyyppi
        });
      }
    });

    _.forEach(eiLuvassaValittu, lisays => {
      fields.push({
        ...lisays,
        type: MUUTOS_TYPES.ADDITION,
        meta: { perusteluteksti: null },
        muutosperustelukoodiarvo: null,
        kohde,
        maaraystyyppi
      });
    });
  }

  render() {
    const { value } = this.state;
    const { options, toimialuemuutokset } = this.props;

    return (
      <Select
        name="toimialue"
        multi
        options={options}
        toimialuemuutokset={toimialuemuutokset}
        value={value}
        onChange={this.handleSelectChange.bind(this)}
      />
    );
  }
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS);

MuutospyyntoWizardToimialue = connect(state => {
  const toimialuemuutoksetValue = selector(
    state,
    FIELD_ARRAY_NAMES.TOIMINTA_ALUEET
  );
  const valtakunnallinenmuutoksetValue = selector(state, "valtakunnallinen");

  return {
    valtakunnallinenmuutoksetValue,
    toimialuemuutoksetValue
  };
})(MuutospyyntoWizardToimialue);

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(MuutospyyntoWizardToimialue);
