import React, { useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake from "../../../../../../../components/04-forms/muut/OpiskelijavuodetLomake/Vahimmaisopiskelijavuosimaara";
import OpiskelijavuodetsisaoppilaitosPerustelulomake from "../../../../../../../components/04-forms/muut/OpiskelijavuodetLomake/SisamuotoinenOpetus";
import OpiskelijavuodetvaativatukiPerustelulomake from "../../../../../../../components/04-forms/muut/OpiskelijavuodetLomake/VaativaKoulutus";
import {
  findAnchoredElement,
  findAnchoredElementFromCategoryHierarchy,
  getAnchorPart
} from "../../../../../../../utils/common";
import commonMessages from "../../../../../../../i18n/definitions/common";

const filterChangesByPartialAnchor = (anchor, changeObjects = []) => {
  return R.filter(changeObj => {
    return R.equals(getAnchorPart(changeObj.anchor, 1), anchor);
  })(changeObjects);
};

const PerustelutOpiskelijavuodet = props => {
  const sectionId = "perustelut_opiskelijavuodet";
  const { onChangesRemove, onChangesUpdate, isReadOnly, intl } = props;

  const perustelutChanges = useMemo(() => {
    return {
      vahimmaisopiskelijavuosimaara: filterChangesByPartialAnchor(
        "vahimmaisopiskelijavuodet",
        R.path(["vahimmaisopiskelijavuodet"], props.changeObjects.perustelut)
      ),
      sisaoppilaitos: filterChangesByPartialAnchor(
        "sisaoppilaitos",
        R.path(["sisaoppilaitos"], props.changeObjects.perustelut)
      ),
      vaativatuki: filterChangesByPartialAnchor(
        "vaativatuki",
        R.path(["vaativatuki"], props.changeObjects.perustelut)
      )
    };
  },[props.changeObjects.perustelut]);

  const valueChanges = useMemo(() => {
    return {
      vahimmaisopiskelijavuosimaara: findAnchoredElement(
        "opiskelijavuodet.vahimmaisopiskelijavuodet.A",
        props.changeObjects.opiskelijavuodet
      ),
      sisaoppilaitos: findAnchoredElement(
        "opiskelijavuodet.sisaoppilaitos.A",
        props.changeObjects.opiskelijavuodet
      ),
      vaativatuki: findAnchoredElement(
        "opiskelijavuodet.vaativatuki.A",
        props.changeObjects.opiskelijavuodet
      )
    };
  }, [props.changeObjects.opiskelijavuodet]);

  const initialValues = useMemo(() => {
    return {
      vahimmaisopiskelijavuosimaara: findAnchoredElementFromCategoryHierarchy(
        "vahimmaisopiskelijavuodet.A",
        props.stateObject.opiskelijavuodet
      ),
      sisaoppilaitos: findAnchoredElementFromCategoryHierarchy(
        "sisaoppilaitos.A",
        props.stateObject.opiskelijavuodet
      ),
      vaativatuki: findAnchoredElementFromCategoryHierarchy(
        "vaativatuki.A",
        props.stateObject.opiskelijavuodet
      )
    };
  }, [props.stateObject.opiskelijavuodet]);

  if(valueChanges.vahimmaisopiskelijavuosimaara) {
    valueChanges.vahimmaisopiskelijavuosimaara.properties.initialValue =
      R.path(["vahimmaisopiskelijavuosimaara","properties","initialValue"],initialValues) || 0;
  }
  if(valueChanges.sisaoppilaitos) {
    valueChanges.sisaoppilaitos.properties.initialValue =
      R.path(["sisaoppilaitos","properties","initialValue"],initialValues) || 0;
  }
  if(valueChanges.vaativatuki) {
    valueChanges.vaativatuki.properties.initialValue =
      R.path(["vaativatuki","properties","initialValue"],initialValues) || 0;
  }


  const differenceTitles = [
    intl.formatMessage(commonMessages.current),
    intl.formatMessage(commonMessages.applyFor),
    intl.formatMessage(commonMessages.difference)
  ];
  return (
    <React.Fragment>
      {valueChanges.vahimmaisopiskelijavuosimaara && (
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
            differenceTitles={differenceTitles}
            valueChangeObject={valueChanges.vahimmaisopiskelijavuosimaara.properties}
            muutosperustelut={props.muutosperustelut}
            sectionId={`${sectionId}_vahimmaisopiskelijavuodet`}
            isReadOnly={isReadOnly}
          ></OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake>
        </ExpandableRowRoot>
      )}

      {valueChanges.sisaoppilaitos && (
        <ExpandableRowRoot
          anchor={`${sectionId}_sisaoppilaitos`}
          key={`expandable-row-root-sisaoppilaitos`}
          changes={perustelutChanges.sisaoppilaitos}
          isExpanded={true}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Sisäoppilaitosmuotoinen opetus"}
        >
          <OpiskelijavuodetsisaoppilaitosPerustelulomake
            onChangesUpdate={onChangesUpdate}
            changeObjects={perustelutChanges.sisaoppilaitos}
            differenceTitles={differenceTitles}
            valueChangeObject={valueChanges.sisaoppilaitos.properties}
            sectionId={`${sectionId}_sisaoppilaitos`}
            isReadOnly={isReadOnly}
          ></OpiskelijavuodetsisaoppilaitosPerustelulomake>
        </ExpandableRowRoot>
      )}

      {valueChanges.vaativatuki && (
        <ExpandableRowRoot
          anchor={`${sectionId}_vaativatuki`}
          key={`expandable-row-root-vaativatuki`}
          changes={perustelutChanges.vaativatuki}
          isExpanded={true}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Vaativa koulutus"}
        >
          <OpiskelijavuodetvaativatukiPerustelulomake
            onChangesUpdate={onChangesUpdate}
            differenceTitles={differenceTitles}
            valueChangeObject={valueChanges.vaativatuki.properties}
            changeObjects={perustelutChanges.vaativatuki}
            sectionId={`${sectionId}_vaativatuki`}
            isReadOnly={isReadOnly}
          ></OpiskelijavuodetvaativatukiPerustelulomake>
        </ExpandableRowRoot>
      )}
    </React.Fragment>
  );
};

PerustelutOpiskelijavuodet.defaultProps = {
  changeObjects: {},
  muutosperustelut: [],
  stateObject: {},
  isReadOnly: false
};

PerustelutOpiskelijavuodet.propTypes = {
  changeObjects: PropTypes.object,
  kohde: PropTypes.object,
  lomakkeet: PropTypes.object,
  muutosperustelut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object,
  isReadOnly: PropTypes.bool
};

export default injectIntl(PerustelutOpiskelijavuodet);
