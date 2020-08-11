import React, { useMemo } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import { getAnchorPart } from "../../../../../../../utils/common";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import Lomake from "../../../../../../../components/02-organisms/Lomake";

const PerustelutTyovoimakoulutukset = React.memo(props => {
  const intl = useIntl();
  const sectionId = "perustelut_koulutukset_tyovoimakoulutukset";
  const { onChangesRemove, onChangesUpdate } = props;

  const lomakkeet = useMemo(() => {
    return (
      <React.Fragment>
        {R.map(changeObj => {
          const code = getAnchorPart(changeObj.anchor, 1);
          const isReasoningRequired = R.path(
            ["properties", "metadata", "isReasoningRequired"],
            changeObj
          );

          let lomake = null;
          if (isReasoningRequired) {
            lomake = changeObj.properties.isChecked ? (
              <Lomake
                anchor={"perustelut_koulutukset_tyovoimakoulutukset"}
                changeObjects={
                  props.changeObjects.perustelut.koulutukset.tyovoimakoulutukset
                }
                data={{
                  code,
                  elykeskukset: props.elykeskukset
                }}
                key={code}
                isReadOnly={props.isReadOnly}
                onChangesUpdate={onChangesUpdate}
                path={["perustelut", "koulutukset", "tyovoimakoulutukset"]}></Lomake>
            ) : (
              <Lomake
                action="removal"
                anchor={`perustelut_koulutukset_tyovoimakoulutukset`}
                prefix={code}
                changeObjects={
                  props.changeObjects.perustelut.koulutukset.tyovoimakoulutukset
                }
                isReadOnly={props.isReadOnly}
                key={code}
                onChangesUpdate={onChangesUpdate}
                path={[
                  "perustelut",
                  "koulutukset",
                  "tyovoimakoulutukset"
                ]}></Lomake>
            );
          }
          return lomake;
        }, props.changeObjects.koulutukset.tyovoimakoulutukset || []).filter(
          Boolean
        )}
      </React.Fragment>
    );
  }, [
    onChangesUpdate,
    props.elykeskukset,
    props.isReadOnly,
    props.changeObjects.koulutukset.tyovoimakoulutukset,
    props.changeObjects.perustelut.koulutukset.tyovoimakoulutukset
  ]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <React.Fragment>
      {lomakkeet && (
        <ExpandableRowRoot
          anchor={sectionId}
          key={`expandable-row-root`}
          changes={
            props.changeObjects.perustelut.koulutukset.tyovoimakoulutukset
          }
          disableReverting={props.isReadOnly}
          hideAmountOfChanges={true}
          isExpanded={true}
          messages={changesMessages}
          onChangesRemove={onChangesRemove}
          sectionId={sectionId}
          title={intl.formatMessage(wizardMessages.workforceTraining)}>
          {lomakkeet}
        </ExpandableRowRoot>
      )}
    </React.Fragment>
  );
});

PerustelutTyovoimakoulutukset.defaultProps = {
  changeObjects: {},
  isReadOnly: false
};

PerustelutTyovoimakoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  code: PropTypes.string,
  elykeskukset: PropTypes.array,
  isReadOnly: PropTypes.bool,
  koulutukset: PropTypes.object
};

export default PerustelutTyovoimakoulutukset;
