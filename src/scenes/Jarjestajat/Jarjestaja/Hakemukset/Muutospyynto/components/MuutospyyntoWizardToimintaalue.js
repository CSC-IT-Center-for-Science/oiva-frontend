import _ from "lodash";
import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { injectIntl } from "react-intl";

import { fetchKunnat } from "../../../../../../services/kunnat/actions"
import { KunnatContext } from "context/kunnatContext";
import { fetchMaakunnat } from "../../../../../../services/maakunnat/actions"
import { MaakunnatContext } from "context/maakunnatContext"

import { fetchMaakuntakunnat } from "../../../../../../services/maakuntakunnat/actions"
import { MaakuntakunnatContext } from "context/maakuntakunnatContext"

import wizardMessages from "../../../../../../i18n/definitions/wizard";
import Section from "components/03-templates/Section";

import Loading from "../../../../../../modules/Loading";
import { ContentContainer } from "../../../../../../modules/elements";
import {
  Kohdenumero,
  Otsikko,
  Row,
  CheckboxRowContainer,
  Checkbox,
  Nimi
} from "./MuutospyyntoWizardComponents";
import {
  getToimialueByKoodiArvo,
  handleToimialueSelectChange
} from "services/toimialueet/toimialueUtil";
import { handleSimpleCheckboxChange } from "../../../../../../services/koulutukset/koulutusUtil";
import {
  FIELD_ARRAY_NAMES,
  FORM_NAME_UUSI_HAKEMUS,
  MUUTOS_TYPES
} from "../modules/uusiHakemusFormConstants";

const MuutospyyntoWizardToimintaalue = React.memo(props => {
  const heading = props.intl.formatMessage(wizardMessages.header_section3);
  const { state: kunnat, dispatch: kunnatDispatch } = useContext(KunnatContext);
  const { state: maakunnat, dispatch: maakunnatDispatch } = useContext(MaakunnatContext);
  const { state: maakuntakunnat, dispatch: maakuntakunnatDispatch } = useContext(MaakuntakunnatContext);
  const [kuntaMaaraykset, setKuntamaaraykset] = useState([]);
  const [maakuntaMaaraykset, setMaakuntaMaaraykset] = useState([]);
  const [valtakunnallinen, setValtakunnallinen] = useState([]);

  const { headingNumber } = props.lupa.kohteet[3];

  useEffect(() => {
    fetchKunnat()(kunnatDispatch);
    fetchMaakunnat()(maakunnatDispatch);
    fetchMaakuntakunnat()(maakuntakunnatDispatch);
  }, [kunnatDispatch, maakunnatDispatch, maakuntakunnatDispatch]);
  // }, [kunnat, maakunnat, maakuntakunnat, dispatch]);

  useEffect(() => {
    setKuntamaaraykset(props.lupa.kohteet[3].kunnat);
    // const {
    //   lupa,
    //   valtakunnallinenmuutoksetValue,
    //   toimialuemuutoksetValue
    // } = props;
    setMaakuntaMaaraykset(props.lupa.kohteet[3].maakunnat);
    setValtakunnallinen(props.lupa.kohteet[3].valtakunnallinen || false);
  }, [props.lupa]);

  useEffect(() => {
    console.log(kunnat);
    console.log(maakunnat);
    console.log(maakuntakunnat);
  }, [kunnat, maakunnat, maakuntakunnat]);

  if (kunnat.fetched && maakunnat.fetched && maakuntakunnat.fetched) {
    return (
      <Section code={headingNumber} title={heading}>
        <Row>
          <p>Tähän lyhyt ohjeteksti kohteen täyttämisestä</p>
        </Row>
        <Row>
          <RenderToimialueMuutokset
            name={FIELD_ARRAY_NAMES.TOIMINTA_ALUEET}
            maakunnat={maakuntaMaaraykset}
            kunnat={kuntaMaaraykset}
            // editValues={toimialuemuutoksetValue}
            maakuntaList={maakunnat.data}
            kuntaList={kunnat.data}
            maakuntakunnatList={maakuntakunnat.data}
            valtakunnallinen={valtakunnallinen}
          />
        </Row>
        <Row>
          <RenderValtakunnallinen
          name="valtakunnallinen"
          // editValues={valtakunnallinenmuutoksetValue}
          valtakunnallinen={valtakunnallinen}
        />
        </Row>
      </Section>
    );
  }
  // } else if (
  //   props.kunnat.hasErrored ||
  //   props.maakunnat.hasErrored ||
  //   props.maakuntakunnat.hasErrored
  // ) {
  //   return <h2>Toiminta-aluetta ladattaessa tapahtui virhe</h2>;
  // } else if (
  //   props.kunnat.isFetching ||
  //   props.maakunnat.isFetching ||
  //   props.maakuntakunnat.isFetching
  // ) {
  //   return <Loading />;
  // } else {
  //   return null;
  // }
});

const RenderToimialueMuutokset = props => {
  const { maakunnat, kunnat, maakuntakunnatList, editValues, fields } = props;
  let opts = [];
  let initialValue = [];
  let valitutMaakunnat = [];
  let valitutKunnat = [];

  _.forEach(maakuntakunnatList, maakunta => {
    opts.push(maakunta);
    _.forEach(maakunta.kunta, kunta => {
      opts.push(kunta);
    });
  });

  maakunnat.forEach(maakunta => {
    initialValue.push(maakunta.koodiarvo);
  });
  kunnat.forEach(kunta => {
    initialValue.push(kunta.koodiarvo);
  });

  if (editValues) {
    editValues.forEach(value => {
      if (value.type === MUUTOS_TYPES.ADDITION) {
        initialValue.push(value.value);
      } else if (value.type === MUUTOS_TYPES.REMOVAL) {
        // Jätetään poistettu toimialue näkyville
        // if (_.includes(initialValue, value.value)) {
        //   _.pull(initialValue, value.value)
        // }
      }
    });
  }

  if (initialValue) {
    initialValue.forEach(value => {
      const alue = getToimialueByKoodiArvo(value);

      if (alue) {
        if (editValues) {
          const val = _.find(editValues, editValue => {
            return editValue.koodiArvo === value;
          });
          if (val) {
            alue.type = val.type;
          }
        }

        if (alue.tyyppi === "maakunta") {
          valitutMaakunnat.push(alue);
        } else if (alue.tyyppi === "kunta") {
          valitutKunnat.push(alue);
        }
      }
    });
  }

  return (
    <div>
      <p>Tähän lyhyt ohjeteksti toimialueiden valintaan liittyen</p>
      <ToimialueSelect
        options={opts}
        value={initialValue}
        initialValue={initialValue}
        editValues={editValues}
        fields={fields}
      />

      {initialValue && initialValue.length === 0 && (
        <h4>Toiminta-aluetta ei määritetty</h4>
      )}

      {valitutMaakunnat.length > 0 && (
        <div>
          <h4>Maakunnat</h4>
          {valitutMaakunnat.map(alue => {
            const { label, type } = alue;
            const customClass =
              type === MUUTOS_TYPES.ADDITION
                ? "is-added"
                : type === MUUTOS_TYPES.REMOVAL
                  ? "is-removed"
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
              type === MUUTOS_TYPES.ADDITION
                ? "is-added"
                : type === MUUTOS_TYPES.REMOVAL
                  ? "is-removed"
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

const RenderValtakunnallinen = props => {
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
      <p>Tähän lyhyt ohjeteksti valtakunnallisen valintaan liittyen</p>
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
        <Nimi>
          Koulutuksen järjestäjällä on velvollisuus järjestää tutkintoja ja
          koulutusta Ahvenanmaan maakuntaa lukuunottamatta koko Suomen
          osaamis- ja koulutustarpeeseen.
          </Nimi>
      </CheckboxRowContainer>
    </div>
  );
}

const ToimialueSelect = React.memo(props => {

  const [value] = useState(props.value);

  const handleSelectChange = value => {
    // this.setState({ value });
    // const { editValues, fields, initialValue } = props;
    // handleToimialueSelectChange(editValues, fields, initialValue, value);
  }

  let { options } = props;
  console.log(options)

  return (
    <Select
      name="toimialue"
      multi
      options={options}
      value={value}
      onChange={handleSelectChange}
    />
  );
});

// const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

// MuutospyyntoWizardToimialue = connect(state => {
//   const toimialuemuutoksetValue = selector(state, FIELD_ARRAY_NAMES.TOIMINTA_ALUEET)
//   const valtakunnallinenmuutoksetValue = selector(state, 'valtakunnallinen')

//   return {
//     valtakunnallinenmuutoksetValue,
//     toimialuemuutoksetValue
//   }
// })(MuutospyyntoWizardToimialue)

// export default reduxForm({
//   form: FORM_NAME_UUSI_HAKEMUS,
//   destroyOnUnmount: false,
//   forceUnregisterOnUnmount: true,
//   // validate,
// })(MuutospyyntoWizardToimialue)

export default injectIntl(MuutospyyntoWizardToimintaalue);