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
  const [valueOfSelect, setValueOfSelect] = useState([]);
  const [isValtakunnallinenChecked, setIsValtakunnallinenChecked] = useState([]);
  const [changeOfValtakunnallinen, setChangeOfValtakunnallinen] = useState(
    {}
  );
  const { onUpdate } = props;

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
      props.changes
    );

    const addedItems = getAddedItems(
      R.concat(props.maakuntakunnat.maakuntakunnatList, kunnat),
      props.changes
    );

    const kunnatInitial = getInitialItems(
      props.maakuntakunnat.maakuntakunnatList,
      props.lupakohde.kunnat
    );

    const initialValueOfSelect = R.concat(kunnatInitial, initialMaakunnat);

    setInitialValueOfSelect(initialValueOfSelect);
    setValueOfSelect(R.concat(maakunnatWithoutRemovedOnes, addedItems));

    const tmpChangeOfValtakunnallinen =
      R.find(R.propEq("koodisto", "nuts1"))(props.changes)|| {};

    setChangeOfValtakunnallinen(tmpChangeOfValtakunnallinen);

    setIsValtakunnallinenChecked(tmpChangeOfValtakunnallinen.tila === "LISAYS")

  }, [
      props.lupakohde,
      props.kunnat,
      props.maakunnat,
      props.maakuntakunnat,
      props.changes
    ]);

  useEffect(() => {
    onUpdate({
      sectionId,
      state: {
        changeOfValtakunnallinen,
        initialValueOfSelect,
        kohde: props.kohde,
        maaraystyyppi: props.maaraystyyppi,
        valueOfSelect
      }
    });
  }, [
      props.kohde,
      props.maaraystyyppi,
      changeOfValtakunnallinen,
      initialValueOfSelect,
      onUpdate,
      valueOfSelect
    ]);

  const handleNewValueOfToimialuevalinta = value => {
    setValueOfSelect(value);
  };

  const handleChangeOfValtakunnallinen = ({ isChecked }) => {
    setChangeOfValtakunnallinen(
      Object.assign({}, changeOfValtakunnallinen, { isChecked })
    );
  };

  return (
    <Section code={props.lupakohde.headingNumber} title={heading}>
      <p className={
        isValtakunnallinenChecked ?
          "hidden" : "pb-4"
      }>
        {props.intl.formatMessage(wizardMessages.areasInfo1)}
      </p>
      <div className={
        isValtakunnallinenChecked ?
          "hidden pointer-events-none" : "bg-gray-100 p-6"
      }>
        <Toimialuevalinta
          maakuntakunnatList={props.maakuntakunnat.maakuntakunnatList}
          value={valueOfSelect}
          callback={handleNewValueOfToimialuevalinta}
        />

        <Toimialuemuutokset
          name="toimintaalueet"
          initialValues={initialValueOfSelect}
          values={valueOfSelect}
        />
      </div>
      <div className={
        isValtakunnallinenChecked ?
          "" : "pt-4"
      }>
        <Valtakunnallinen
          callback={handleChangeOfValtakunnallinen}
          change={changeOfValtakunnallinen}
          // isCheckedInitial={!!props.lupakohde.valtakunnallinen}
          isCheckedInitial={false}
          initialValues={initialValueOfSelect}
        />
      </div>
    </Section>
  );
});

MuutospyyntoWizardToimintaalue.defaultProps = {
  changes: [],
  kohde: {},
  kunnat: {},
  lupakohde: {},
  maakunnat: {},
  maakuntakunnat: {},
  maaraystyyppi: {}
};

MuutospyyntoWizardToimintaalue.propTypes = {
  changes: PropTypes.array,
  kohde: PropTypes.object,
  kunnat: PropTypes.object,
  lupakohde: PropTypes.object,
  maakunnat: PropTypes.object,
  maakuntakunnat: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onUpdate: PropTypes.func
};

export default injectIntl(MuutospyyntoWizardToimintaalue);
