import React, { useMemo } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { findAnchoredElement } from "../../../../../../../utils/common";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getRules as getVahimmaisRules } from "../../../../../../../services/lomakkeet/perustelut/opiskelijavuodet/vahimmais/rules";
import { getRules as getSisaoppilaitosRules } from "../../../../../../../services/lomakkeet/perustelut/opiskelijavuodet/sisaoppilaitos/rules";
import { getRules as getVaativaTukiRules } from "../../../../../../../services/lomakkeet/perustelut/opiskelijavuodet/vaativa/rules";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";
import { path } from "ramda";
import common from "../../../../../../../i18n/definitions/common";

const PerustelutOpiskelijavuodet = props => {
  const intl = useIntl();
  const [changeObjects] = useChangeObjects();
  const sectionId = "perustelut_opiskelijavuodet";
  const { onChangesRemove, onChangesUpdate, isReadOnly } = props;

  const valueChanges = useMemo(() => {
    return {
      vahimmaisopiskelijavuosimaara: findAnchoredElement(
        "opiskelijavuodet.vahimmaisopiskelijavuodet.A",
        changeObjects.opiskelijavuodet
      ),
      sisaoppilaitos: findAnchoredElement(
        "opiskelijavuodet.sisaoppilaitos.A",
        changeObjects.opiskelijavuodet
      ),
      vaativatuki: findAnchoredElement(
        "opiskelijavuodet.vaativatuki.A",
        changeObjects.opiskelijavuodet
      )
    };
  }, [changeObjects.opiskelijavuodet]);

  const differenceTitles = [
    intl.formatMessage(common.current),
    intl.formatMessage(common.applyFor),
    intl.formatMessage(common.difference)
  ];
  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  }

  return (
    <React.Fragment>
      {valueChanges.vahimmaisopiskelijavuosimaara && (
        <ExpandableRowRoot
          anchor={`${sectionId}_vahimmaisopiskelijavuodet`}
          key={`expandable-row-root-vahimmaisopiskelijavuodet`}
          changes={path(
            ["perustelut", "opiskelijavuodet", "vahimmaisopiskelijavuodet"],
            changeObjects
          )}
          hideAmountOfChanges={true}
          isExpanded={true}
          messages={changesMessages}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Vähimmäisopiskelijavuosimäärä"}>
          <Lomake
            anchor={`${sectionId}_vahimmaisopiskelijavuodet`}
            action="reasoning"
            changeObjects={path(
              ["perustelut", "opiskelijavuodet", "vahimmaisopiskelijavuodet"],
              changeObjects
            )}
            data={{
              checkboxItems: props.muutosperustelut,
              changeObject:
                valueChanges.vahimmaisopiskelijavuosimaara.properties,
              differenceTitles
            }}
            isReadOnly={isReadOnly}
            onChangesUpdate={onChangesUpdate}
            path={["perustelut", "opiskelijavuodet", "vahimmais"]}
            rulesFn={getVahimmaisRules}></Lomake>
        </ExpandableRowRoot>
      )}
      {valueChanges.sisaoppilaitos && (
        <ExpandableRowRoot
          anchor={`${sectionId}_sisaoppilaitos`}
          key={`expandable-row-root-sisaoppilaitos`}
          changes={path(
            ["perustelut", "opiskelijavuodet", "sisaoppilaitos"],
            changeObjects
          )}
          hideAmountOfChanges={true}
          isExpanded={true}
          messages={changesMessages}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Sisäoppilaitosmuotoinen opetus"}>
          <Lomake
            action="reasoning"
            anchor={`${sectionId}_sisaoppilaitos`}
            changeObjects={path(
              ["perustelut", "opiskelijavuodet", "sisaoppilaitos"],
              changeObjects
            )}
            data={{
              changeObject: valueChanges.sisaoppilaitos.properties,
              differenceTitles
            }}
            isReadOnly={isReadOnly}
            onChangesUpdate={onChangesUpdate}
            path={["perustelut", "opiskelijavuodet", "sisaoppilaitos"]}
            rulesFn={getSisaoppilaitosRules}></Lomake>
        </ExpandableRowRoot>
      )}
      {valueChanges.vaativatuki && (
        <ExpandableRowRoot
          anchor={`${sectionId}_vaativatuki`}
          key={`expandable-row-root-vaativatuki`}
          changes={path(
            ["perustelut", "opiskelijavuodet", "vaativatuki"],
            changeObjects
          )}
          hideAmountOfChanges={true}
          isExpanded={true}
          messages={changesMessages}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={"Vaativa koulutus"}>
          <Lomake
            action="reasoning"
            anchor={`${sectionId}_vaativatuki`}
            changeObjects={path(
              ["perustelut", "opiskelijavuodet", "vaativatuki"],
              changeObjects
            )}
            data={{
              changeObject: valueChanges.vaativatuki.properties,
              differenceTitles
            }}
            isReadOnly={isReadOnly}
            onChangesUpdate={onChangesUpdate}
            path={["perustelut", "opiskelijavuodet", "vaativatuki"]}
            rulesFn={getVaativaTukiRules}></Lomake>
        </ExpandableRowRoot>
      )}
    </React.Fragment>
  );
};

PerustelutOpiskelijavuodet.defaultProps = {
  changeObjects: {},
  muutosperustelut: [],
  isReadOnly: false
};

PerustelutOpiskelijavuodet.propTypes = {
  changeObjects: PropTypes.object,
  muutosperustelut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  isReadOnly: PropTypes.bool
};

export default PerustelutOpiskelijavuodet;
