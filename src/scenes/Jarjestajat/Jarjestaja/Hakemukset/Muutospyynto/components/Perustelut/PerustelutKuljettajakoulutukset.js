import React, { useMemo } from "react";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { getAnchorPart } from "../../../../../../../utils/common";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import KuljettajienJatkokoulutuslomake from "../../../../../../../components/04-forms/koulutukset/Kuljettajakoulutukset/Jatkokoulutuslomake";
import KuljettajienPeruskoulutuslomake from "../../../../../../../components/04-forms/koulutukset/Kuljettajakoulutukset/Peruskoulutuslomake";
const PerustelutKuljettajakoulutukset = props => {
  const sectionId = "perustelut_koulutukset_kuljettajakoulutukset";
  const { onChangesRemove, onChangesUpdate } = props;

  const code = useMemo(() => {
    return getAnchorPart(
      R.compose(
        R.prop("anchor"),
        R.head
      )(props.changeObjects.koulutukset.kuljettajakoulutukset),
      1
    );
  }, [props.changeObjects.koulutukset.kuljettajakoulutukset]);

  return (
    <React.Fragment>
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        categories={[]}
        changes={R.path(["perustelut"], props.changeObjects)}
        disableReverting={props.isReadOnly}
        hideAmountOfChanges={false}
        isExpanded={true}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        title={props.intl.formatMessage(wizardMessages.driverTraining)}
      >
        {code === "5" ? (
          <KuljettajienPeruskoulutuslomake
            isReadOnly={props.isReadOnly}
            onChangesUpdate={onChangesUpdate}
            changeObjects={R.path(["perustelut"], props.changeObjects)}
          ></KuljettajienPeruskoulutuslomake>
        ) : (
          <KuljettajienJatkokoulutuslomake
            isReadOnly={props.isReadOnly}
            onChangesUpdate={onChangesUpdate}
            changeObjects={R.path(["perustelut"], props.changeObjects)}
          ></KuljettajienJatkokoulutuslomake>
        )}
      </ExpandableRowRoot>
    </React.Fragment>
  );
};

PerustelutKuljettajakoulutukset.defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  stateObject: {}
};

PerustelutKuljettajakoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  koulutukset: PropTypes.object,
  lomakkeet: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object
};

export default injectIntl(PerustelutKuljettajakoulutukset);
