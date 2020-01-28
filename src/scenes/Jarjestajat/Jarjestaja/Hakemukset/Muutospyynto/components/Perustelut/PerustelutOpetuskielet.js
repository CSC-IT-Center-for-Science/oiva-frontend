import React, { useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { getDataForOpetuskieletList } from "../../../../../../../utils/opetuskieletUtil";
import * as R from "ramda";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getRules } from "../../../../../../../services/lomakkeet/perustelut/opetuskielet/rules";

const PerustelutOpetuskielet = React.memo(props => {
  const intl = useIntl();
  const sectionId = `${props.sectionId}_opetuskielet`;
  const { onChangesRemove, onChangesUpdate } = props;

  const opetuskieletList = useMemo(() => {
    return getDataForOpetuskieletList(
      props.opetuskielet,
      props.kohde,
      R.toUpper(intl.locale)
    );
  }, [props.kohde, props.opetuskielet, intl.locale]);

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      categories={[]}
      changes={props.changeObjects.perustelut}
      disableReverting={props.isReadOnly}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      sectionId={sectionId}
      title={intl.formatMessage(wizardMessages.teachingLanguages)}
      isExpanded={true}
      hideAmountOfChanges={true}>
      {opetuskieletList && opetuskieletList.items && (
        <Lomake
          anchor={sectionId}
          action="reasoning"
          changeObjects={props.changeObjects.perustelut}
          data={{
            changeObjectsPage1: props.changeObjects.opetuskielet,
            kohde: props.kohde,
            maaraystyyppi: props.maaraystyyppi,
            opetuskielet: opetuskieletList
          }}
          isReadOnly={props.isReadOnly}
          onChangesUpdate={onChangesUpdate}
          path={["kielet", "opetuskielet"]}
          rulesFn={getRules}></Lomake>
      )}
    </ExpandableRowRoot>
  );
});

PerustelutOpetuskielet.defaultProps = {
  changeObjects: {},
  stateObject: {}
};

PerustelutOpetuskielet.propTypes = {
  changeObjects: PropTypes.object,
  opetuskielet: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  lupa: PropTypes.object
};

export default PerustelutOpetuskielet;
