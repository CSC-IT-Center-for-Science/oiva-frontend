import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getRules } from "../../../../../../../services/lomakkeet/perustelut/opetuskielet/rules";

const PerustelutOpetuskielet = React.memo(props => {
  const intl = useIntl();
  const sectionId = "perustelut_kielet_opetuskielet";
  const { onChangesRemove, onChangesUpdate } = props;

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      changes={props.changeObjects.perustelut}
      disableReverting={props.isReadOnly}
      messages={changesMessages}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      sectionId={sectionId}
      title={intl.formatMessage(wizardMessages.teachingLanguages)}
      isExpanded={true}
      hideAmountOfChanges={true}>
      <Lomake
        anchor={sectionId}
        action="reasoning"
        changeObjects={props.changeObjects.perustelut}
        data={{
          changeObjectsPage1: props.changeObjects.opetuskielet,
          kohde: props.kohde,
          maaraystyyppi: props.maaraystyyppi,
          opetuskielet: props.opetuskielet
        }}
        metadata={{ kohde: props.kohde, maaraystyyppi: props.maaraystyyppi }}
        isReadOnly={props.isReadOnly}
        onChangesUpdate={onChangesUpdate}
        path={["perustelut", "kielet", "opetuskielet"]}
        rulesFn={getRules}></Lomake>
    </ExpandableRowRoot>
  );
});

PerustelutOpetuskielet.defaultProps = {
  changeObjects: {},
  stateObject: {}
};

PerustelutOpetuskielet.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  opetuskielet: PropTypes.array
};

export default PerustelutOpetuskielet;
