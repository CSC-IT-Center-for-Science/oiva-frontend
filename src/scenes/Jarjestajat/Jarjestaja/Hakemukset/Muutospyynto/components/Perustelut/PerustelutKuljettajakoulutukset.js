import React, { useMemo } from "react";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { getAnchorPart } from "../../../../../../../utils/common";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import * as R from "ramda";

const PerustelutKuljettajakoulutukset = props => {
  const sectionId = "perustelut_koulutukset_kuljettajakoulutukset";
  const { onChangesRemove, onChangesUpdate } = props;

  const lomakkeet = useMemo(() => {
    return (
      <React.Fragment>
        {R.map(changeObj => {
          const mapping = {
            1: "peruskoulutus",
            2: "jatkokoulutus",
            3: "peruskoulutus",
            4: "jatkokoulutus",
            5: "peruskoulutus",
            6: "jatkokoulutus"
          };
          const code = getAnchorPart(changeObj.anchor, 1);
          const isReasoningRequired = R.path(
            ["properties", "metadata", "isReasoningRequired"],
            changeObj
          );

          let lomake = null;

          if (isReasoningRequired) {
            if (changeObj.properties.isChecked) {
              lomake = (
                <Lomake
                  anchor={"perustelut_koulutukset_kuljettajakoulutukset"}
                  changeObjects={props.changeObjects.perustelut}
                  isReadOnly={props.isReadOnly}
                  key={code}
                  onChangesUpdate={onChangesUpdate}
                  path={["koulutukset", "kuljettajakoulutukset", mapping[code]]}
                  showCategoryTitles={true}></Lomake>
              );
            } else {
              lomake = (
                <Lomake
                  action="removal"
                  anchor={`perustelut_koulutukset_kuljettajakoulutukset`}
                  changeObjects={props.changeObjects.perustelut}
                  isReadOnly={props.isReadOnly}
                  key={code}
                  onChangesUpdate={onChangesUpdate}
                  prefix={code}
                  path={[
                    "koulutukset",
                    "kuljettajakoulutukset",
                    mapping[code]
                  ]}></Lomake>
              );
            }
          }
          return lomake;
        }, props.changeObjects.koulutukset.kuljettajakoulutukset || []).filter(
          Boolean
        )}
      </React.Fragment>
    );
  }, [
    onChangesUpdate,
    props.isReadOnly,
    props.changeObjects.koulutukset.kuljettajakoulutukset,
    props.changeObjects.perustelut
  ]);

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
        title={props.intl.formatMessage(wizardMessages.driverTraining)}>
        {lomakkeet}
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
