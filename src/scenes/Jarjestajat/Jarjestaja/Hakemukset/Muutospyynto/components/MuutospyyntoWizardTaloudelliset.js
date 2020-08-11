import React from "react";
import { useIntl } from "react-intl";
import TaloudellisetYleisettiedot from "./Taloudelliset/TaloudellisetYleisettiedot";
import TaloudellisetInvestoinnit from "./Taloudelliset/TaloudellisetInvestoinnit";
import TaloudellisetTilinpaatostiedot from "./Taloudelliset/TaloudellisetTilinpaatostiedot";
import TaloudellisetLiitteet from "./Taloudelliset/TaloudellisetLiitteet";
import wizard from "../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import Section from "components/03-templates/Section";
import * as R from "ramda";

const MuutospyyntoWizardTaloudelliset = ({
  changeObjects,
  onChangesRemove,
  onChangesUpdate
}) => {
  const intl = useIntl();

  const checkIfIsAdditions = changeObjects => {
    const findIsChecked = obj => {
      if (obj instanceof Array) {
        return R.any(findIsChecked, obj);
      } else if (obj instanceof Object) {
        const isChecked = R.prop("isChecked", obj);
        return (
          isChecked ||
          R.compose(
            R.any(([k, v]) => findIsChecked(v)),
            R.toPairs
          )(obj)
        );
      }
      return false;
    };

    return findIsChecked(changeObjects);
  };

  return (
    <React.Fragment>
      <h2 className="my-6">{intl.formatMessage(wizard.pageTitle_3)}</h2>

      {!checkIfIsAdditions(
        R.props(["tutkinnot", "koulutukset"], changeObjects)
      ) ? (
        <p>{intl.formatMessage(wizard.noAddedTutkinnot)}</p>
      ) : (
        <React.Fragment>
          <p className={"mb-10"}>
            {intl.formatMessage(wizard.allFieldsRequired)}
          </p>
          <Section title={intl.formatMessage(wizard.yleisetTiedot)}>
            <TaloudellisetYleisettiedot
              changeObjects={changeObjects.taloudelliset.yleisettiedot}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={onChangesUpdate}
            />
          </Section>
          <Section title={intl.formatMessage(wizard.taloudellisetInvestoinnit)}>
            <TaloudellisetInvestoinnit
              changeObjects={changeObjects.taloudelliset.investoinnit}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={onChangesUpdate}
            />
          </Section>
          <Section
            title={intl.formatMessage(wizard.taloudellisetTilinpaatostiedot)}>
            <TaloudellisetTilinpaatostiedot
              changeObjects={changeObjects.taloudelliset.tilinpaatostiedot}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={onChangesUpdate}
            />
          </Section>
          <Section title={intl.formatMessage(wizard.liitteet)}>
            <TaloudellisetLiitteet
              changeObjects={changeObjects.taloudelliset.liitteet}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={onChangesUpdate}
            />
          </Section>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

MuutospyyntoWizardTaloudelliset.propTypes = {
  changeObjects: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  isReadOnly: PropTypes.bool
};

export default MuutospyyntoWizardTaloudelliset;
