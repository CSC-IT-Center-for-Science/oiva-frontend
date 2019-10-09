import React, { useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake from "../../../../../../../components/04-forms/muut/OpiskelijavuodetLomake/Vahimmaisopiskelijavuosimaara";
import OpiskelijavuodetsisaoppilaitosPerustelulomake from "../../../../../../../components/04-forms/muut/OpiskelijavuodetLomake/SisamuotoinenOpetus";
import OpiskelijavuodetvaativatukiPerustelulomake from "../../../../../../../components/04-forms/muut/OpiskelijavuodetLomake/VaativaKoulutus";
import { getAnchorPart } from "../../../../../../../utils/common";

const filterChanges = (anchor, changeObjects = []) => {
  return R.filter(changeObj => {
    return R.equals(getAnchorPart(changeObj.anchor, 1), anchor);
  })(changeObjects);
};

const PerustelutOpiskelijavuodet = props => {
  const sectionId = "perustelut_opiskelijavuodet";
  const { onChangesRemove, onChangesUpdate } = props;

  const changesByLimitations = useMemo(() => {
    return {
      vahimmaisopiskelijavuosimaara: filterChanges(
        "vahimmaisopiskelijavuodet",
        R.path(["vahimmaisopiskelijavuodet"], props.changeObjects.perustelut)
      ),
      sisaoppilaitos: filterChanges(
        "sisaoppilaitos",
        R.path(["sisaoppilaitos"], props.changeObjects.perustelut)
      ),
      vaativatuki: filterChanges(
        "vaativatuki",
        R.path(["vaativatuki"], props.changeObjects.perustelut)
      )
    };
  }, [props.changeObjects.perustelut]);

  return (
    <React.Fragment>
      {changesByLimitations.vahimmaisopiskelijavuosimaara && (
        <ExpandableRowRoot
          anchor={`${sectionId}_vahimmaisopiskelijavuodet`}
          key={`expandable-row-root-vahimmaisopiskelijavuodet`}
          changes={R.path(
            ["perustelut", "vahimmaisopiskelijavuodet"],
            props.changeObjects
          )}
          isExpanded={true}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Vähimmäisopiskelijavuosimäärä"}
        >
          <OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake
            onChangesUpdate={onChangesUpdate}
            changeObjects={R.path(
              ["perustelut", "vahimmaisopiskelijavuodet"],
              props.changeObjects
            )}
            sectionId={`${sectionId}_vahimmaisopiskelijavuodet`}
          ></OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake>
        </ExpandableRowRoot>
      )}

      {changesByLimitations.sisaoppilaitos && (
        <ExpandableRowRoot
          anchor={`${sectionId}_sisaoppilaitos`}
          key={`expandable-row-root-sisaoppilaitos`}
          changes={changesByLimitations.sisaoppilaitos}
          isExpanded={true}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Sisäoppilaitosmuotoinen opetus"}
        >
          <OpiskelijavuodetsisaoppilaitosPerustelulomake
            onChangesUpdate={onChangesUpdate}
            changeObjects={changesByLimitations.sisaoppilaitos}
            sectionId={`${sectionId}_sisaoppilaitos`}
          ></OpiskelijavuodetsisaoppilaitosPerustelulomake>
        </ExpandableRowRoot>
      )}

      {changesByLimitations.vaativatuki && (
        <ExpandableRowRoot
          anchor={`${sectionId}_vaativatuki`}
          key={`expandable-row-root-vaativatuki`}
          changes={changesByLimitations.vaativatuki}
          isExpanded={true}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Vaativa koulutus"}
        >
          <OpiskelijavuodetvaativatukiPerustelulomake
            onChangesUpdate={onChangesUpdate}
            changeObjects={changesByLimitations.vaativatuki}
            sectionId={`${sectionId}_vaativatuki`}
          ></OpiskelijavuodetvaativatukiPerustelulomake>
        </ExpandableRowRoot>
      )}
    </React.Fragment>
  );
};

PerustelutOpiskelijavuodet.defaultProps = {
  changeObjects: {},
  stateObject: {}
};

PerustelutOpiskelijavuodet.propTypes = {
  changeObjects: PropTypes.object,
  kohde: PropTypes.object,
  lomakkeet: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object
};

export default injectIntl(PerustelutOpiskelijavuodet);
