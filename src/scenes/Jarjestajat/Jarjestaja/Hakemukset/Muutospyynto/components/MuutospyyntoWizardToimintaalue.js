import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import Section from "components/03-templates/Section";
import Toimialuemuutokset from "../components/Toimialuemuutokset";
import Toimialuevalinta from "../components/Toimialuevalinta";
import Valtakunnallinen from "../components/Valtakunnallinen";
import * as R from "ramda";

const getInitialItems = (items, list) => {
  return R.map(item => {
    return R.find(R.propEq("koodiArvo", item.koodiarvo))(items);
  }, list);
};

const filterOutRemovedOnes = (items, list, changes) => {
  return R.map(item => {
    let result = false;
    const itemInChanges = R.find(R.propEq("koodiarvo", item.koodiarvo))(
      changes
    );
    if (!itemInChanges || (itemInChanges && itemInChanges.tila !== "POISTO")) {
      result = R.find(R.propEq("koodiArvo", item.koodiarvo))(items);
    }
    return result;
  }, list).filter(Boolean);
};

const getAddedItems = (items, changes) => {
  return R.map(item => {
    let result = false;
    if (item.tila === "LISAYS") {
      result = R.find(R.propEq("koodiArvo", item.koodiarvo))(items);
    }
    return result;
  }, changes).filter(Boolean);
};

const MuutospyyntoWizardToimintaalue = React.memo(props => {
  const sectionId = "toimintaalue";
  const heading = props.intl.formatMessage(wizardMessages.header_section3);
  const [initialValueOfSelect, setInitialValueOfSelect] = useState([]);
  const [valueOfSelect, setValueOfSelect] = useState(null);
  const [changesOfValtakunnallinen, setChangesOfValtakunnallinen] = useState({
    properties: {}
  });
  const { onStateUpdate } = props;

  useEffect(() => {
    const kunnat = R.flatten(
      R.map(R.prop("kunta"), props.maakuntakunnat.maakuntakunnatList)
    );

    const initialMaakunnat = getInitialItems(
      props.maakuntakunnat.maakuntakunnatList,
      props.lupakohde.maakunnat
    );

    const maakunnatWithoutRemovedOnes = filterOutRemovedOnes(
      props.maakuntakunnat.maakuntakunnatList,
      props.lupakohde.maakunnat,
      props.muutokset
    );

    const addedItems = getAddedItems(
      R.concat(props.maakuntakunnat.maakuntakunnatList, kunnat),
      props.muutokset
    );

    const kunnatInitial = getInitialItems(
      props.maakuntakunnat.maakuntakunnatList,
      props.lupakohde.kunnat
    ).filter(Boolean);

    const initialValueOfSelect = R.concat(kunnatInitial, initialMaakunnat);

    setInitialValueOfSelect(initialValueOfSelect);
    setValueOfSelect(R.concat(maakunnatWithoutRemovedOnes, addedItems));
  }, [
    props.lupakohde,
    props.kunnat,
    props.maakunnat,
    props.maakuntakunnat,
    props.muutokset
  ]);

  useEffect(() => {
    if (valueOfSelect) {
      onStateUpdate(sectionId, {
        changesOfValtakunnallinen,
        initialValueOfSelect,
        kohde: props.kohde,
        maaraystyyppi: props.maaraystyyppi,
        valueOfSelect
      });
    }
  }, [
    props.kohde,
    props.maaraystyyppi,
    changesOfValtakunnallinen,
    initialValueOfSelect,
    onStateUpdate,
    valueOfSelect
  ]);

  useEffect(() => {
    const valtakunnallinenChangeObj = R.find(changeObj =>
      R.compose(
        R.equals("valtakunnallinen"),
        R.path(["properties", "name"])
      )(changeObj)
    )(props.muutokset);

    if (valtakunnallinenChangeObj) {
      setChangesOfValtakunnallinen(valtakunnallinenChangeObj);
    }
  }, [props.muutokset]);

  const handleNewValueOfToimialuevalinta = value => {
    setValueOfSelect(value);
  };

  const handleChangeOfValtakunnallinen = ({ isChecked }) => {
    setChangesOfValtakunnallinen(
      Object.assign({}, changesOfValtakunnallinen, {
        properties: {
          name: "valtakunnallinen",
          isChecked
        }
      })
    );
  };

  return (
    <Section code={props.lupakohde.headingNumber} title={heading}>
      <p
        className={
          !!changesOfValtakunnallinen.properties.isChecked ? "hidden" : "pb-4"
        }
      >
        {props.intl.formatMessage(wizardMessages.areasInfo1)}
      </p>
      <div
        className={
          !!changesOfValtakunnallinen.properties.isChecked
            ? "hidden pointer-events-none"
            : "bg-gray-100 p-6"
        }
      >
        <Toimialuevalinta
          maakuntakunnatList={props.maakuntakunnat.maakuntakunnatList}
          value={valueOfSelect}
          callback={handleNewValueOfToimialuevalinta}
        />

        {valueOfSelect && (
          <Toimialuemuutokset
            name="toimintaalueet"
            initialValues={initialValueOfSelect}
            values={valueOfSelect}
          />
        )}
      </div>
      <div
        className={
          !!changesOfValtakunnallinen.properties.isChecked ? "" : "pt-4"
        }
      >
        <Valtakunnallinen
          callback={handleChangeOfValtakunnallinen}
          changes={changesOfValtakunnallinen}
          isCheckedInitial={!!props.lupakohde.valtakunnallinen}
        />
      </div>
    </Section>
  );
});

MuutospyyntoWizardToimintaalue.defaultProps = {
  muutokset: [],
  kohde: {},
  kunnat: {},
  lupakohde: {},
  maakunnat: {},
  maakuntakunnat: {},
  maaraystyyppi: {}
};

MuutospyyntoWizardToimintaalue.propTypes = {
  muutokset: PropTypes.array,
  kohde: PropTypes.object,
  kunnat: PropTypes.object,
  lupakohde: PropTypes.object,
  maakunnat: PropTypes.object,
  maakuntakunnat: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onStateUpdate: PropTypes.func
};

export default injectIntl(MuutospyyntoWizardToimintaalue);
