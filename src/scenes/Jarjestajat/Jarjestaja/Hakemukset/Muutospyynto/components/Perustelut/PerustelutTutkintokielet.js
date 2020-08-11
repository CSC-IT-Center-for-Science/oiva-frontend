import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import * as R from "ramda";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import { getRules } from "../../../../../../../services/lomakkeet/perustelut/kielet/tutkintokielet/rules";

const PerustelutTutkintokielet = React.memo(props => {
  const intl = useIntl();
  const sectionId = "perustelut_kielet_tutkintokielet";
  const { onChangesRemove, onChangesUpdate } = props;
  const [isChanges, setIsChanges] = useState(false);

  useEffect(() => {
    R.forEachObjIndexed(item => {
      if (!R.isEmpty(item)) {
        setIsChanges(true);
      }
    }, props.changeObjects.tutkintokielet || []);
  });

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  }

  if (isChanges) {
    return (
      <React.Fragment>
        <h2 className="py-4">
          {intl.formatMessage(wizardMessages.tutkintokielet)}
        </h2>
        {R.addIndex(R.map)((areaCode, index) => {
          const changeObjects = props.changeObjects.tutkintokielet[areaCode];
          const title = R.find(R.propEq("koodiarvo", areaCode), props.koulutusalat)
            .metadata[R.toUpper(intl.locale)].nimi;
          if (changeObjects.length > 0) {
            const fullSectionId = `${sectionId}_${areaCode}`;
            return (
              <ExpandableRowRoot
                anchor={fullSectionId}
                key={`expandable-row-root-${index}`}
                categories={[]}
                changes={R.path(
                  ["perustelut", "tutkintokielet", areaCode],
                  props.changeObjects
                )}
                disableReverting={props.isReadOnly}
                hideAmountOfChanges={true}
                messages={changesMessages}
                onChangesRemove={onChangesRemove}
                onUpdate={onChangesUpdate}
                sectionId={fullSectionId}
                showCategoryTitles={true}
                title={title}
                isExpanded={true}>
                <Lomake
                  action="reasoning"
                  anchor={`${sectionId}_${areaCode}`}
                  changeObjects={R.path(
                    ["perustelut", "tutkintokielet", areaCode],
                    props.changeObjects
                  )}
                  data={{
                    areaCode,
                    changeObjectsPage1: changeObjects,
                    maaraykset: props.maaraykset,
                    tutkinnot: props.tutkinnot,
                    koulutusalat: props.koulutusalat
                  }}
                  isReadOnly={props.isReadOnly}
                  onChangesUpdate={onChangesUpdate}
                  path={["perustelut", "kielet", "tutkintokielet"]}
                  rulesFn={getRules}
                  showCategoryTitles={true}></Lomake>
              </ExpandableRowRoot>
            );
          }
        }, R.keys(props.changeObjects.tutkintokielet))}
      </React.Fragment>
    );
  }
  return <React.Fragment />;
});

PerustelutTutkintokielet.defaultValues = {
  changeObjects: {},
  isReadOnly: false,
  maaraykset: []
};

PerustelutTutkintokielet.propTypes = {
  changeObjects: PropTypes.object,
  maaraykset: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  tutkinnot: PropTypes.array,
  koulutusalat: PropTypes.array
};

export default PerustelutTutkintokielet;
