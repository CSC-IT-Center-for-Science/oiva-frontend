import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getRules } from "../../../../../../../services/lomakkeet/perustelut/koulutukset/valmentavatKoulutukset/rules";
import * as R from "ramda";

const PerustelutValmentavatKoulutukset = React.memo(props => {
  const intl = useIntl();
  const sectionId = "perustelut_koulutukset_valmentavatKoulutukset";
  const { onChangesRemove, onChangesUpdate } = props;

  const koulutusdata = useMemo(() => {
    return getDataForKoulutusList(
      props.koulutukset.poikkeukset,
      R.toUpper(intl.locale)
    );
  }, [intl.locale, props.koulutukset.poikkeukset]);

  const changes = R.path(
    ["koulutukset", "valmentavatKoulutukset"],
    props.changeObjects
  );

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  if (changes && !R.isEmpty(changes)) {
    return (
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        changes={
          props.changeObjects.perustelut.koulutukset.valmentavatKoulutukset
        }
        disableReverting={props.isReadOnly}
        hideAmountOfChanges={true}
        isExpanded={true}
        messages={changesMessages}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        sectionId={sectionId}
        title={intl.formatMessage(wizardMessages.preparatoryTraining)}>
        <Lomake
          anchor={sectionId}
          changeObjects={
            props.changeObjects.perustelut.koulutukset.valmentavatKoulutukset
          }
          data={{
            changeObjectsPage1:
              props.changeObjects.koulutukset.valmentavatKoulutukset,
            koulutusdata,
            kohde: props.kohde,
            maaraystyyppi: props.maaraystyyppi
          }}
          isReadOnly={props.isReadOnly}
          onChangesUpdate={onChangesUpdate}
          path={["perustelut", "koulutukset", "valmentavat"]}
          rulesFn={getRules}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    );
  }
  return <React.Fragment />;
});

PerustelutValmentavatKoulutukset.defaultProps = {
  changeObjects: {}
};

PerustelutValmentavatKoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  koulutukset: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default PerustelutValmentavatKoulutukset;
