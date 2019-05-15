import React, { useContext, useEffect, useState } from "react";
import { KoulutuksetContext } from "context/koulutuksetContext";
import { getDataForKoulutusList } from "services/koulutukset/koulutusUtil";
import { TUTKINNOT_SECTIONS } from "../../../../modules/constants";
import { fetchKoulutuksetMuut } from "services/koulutukset/actions";
import RadioButtonWithLabel from "01-molecules/RadioButtonWithLabel";
import { Wrapper } from "../MuutospyyntoWizardComponents";
import ExpandableRow from "01-molecules/ExpandableRow";
import { MUUT_KEYS } from "../../modules/constants";
import NumberOfChanges from "00-atoms/NumberOfChanges";
import PropTypes from "prop-types";
import _ from "lodash";

const Kuljettajakoulutukset = props => {
  const koodisto = "kuljettajakoulutus";
  const [state, setState] = useState({});
  const { state: koulutukset, dispatch: koulutuksetDispatch } = useContext(
    KoulutuksetContext
  );

  useEffect(() => {
    if (_.indexOf(koulutukset.muut.fetched, koodisto) !== -1) {
      setState(
        getDataForKoulutusList(
          koulutukset.muut.muudata[koodisto],
          props.changes
        )
      );
    }
  }, [koulutukset.muut.muudata, props.changes]);

  useEffect(() => {
    fetchKoulutuksetMuut(MUUT_KEYS.KULJETTAJAKOULUTUS)(koulutuksetDispatch);
  }, []);

  const handleChanges = item => {
    props.onChanges(item, koodisto, true);
  };

  return (
    <Wrapper>
      <ExpandableRow>
        <div data-slot="title">
          <span>{TUTKINNOT_SECTIONS.KULJETTAJAT}</span>
        </div>
        <div data-slot="info">
          <NumberOfChanges changes={props.changes} />
        </div>
        <div data-slot="content">
          <div className="py-4">
            {_.map(state.items, (item, i) => {
              return (
                <div key={`item-${i}`} className="px-6 py-2">
                  <RadioButtonWithLabel
                    name={koodisto}
                    isChecked={item.shouldBeSelected}
                    onChanges={handleChanges}
                    payload={item}
                  >
                    <span>{item.code}</span>
                    <span className="ml-4">{item.title}</span>
                  </RadioButtonWithLabel>
                </div>
              );
            })}
          </div>
        </div>
      </ExpandableRow>
    </Wrapper>
  );
};

Kuljettajakoulutukset.propTypes = {
  changes: PropTypes.array,
  onChanges: PropTypes.func
};

export default Kuljettajakoulutukset;
