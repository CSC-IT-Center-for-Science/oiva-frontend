import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { addIndex, keys, map, path, prop } from "ramda";
import { getRules } from "../../../../../../../services/lomakkeet/perustelut/muutMuutokset/rules";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  maaraykset: [],
  muut: [],
  vankilat: []
};

const PerustelutMuut = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    isReadOnly = PropTypes.isReadOnly,
    maaraykset = defaultProps.maaraykset,
    muut = defaultProps.muut,
    onChangesRemove,
    onChangesUpdate,
    vankilat = defaultProps.vankilat
  }) => {
    const intl = useIntl();
    const sectionId = "perustelut_muut";

    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    };

    return (
      <React.Fragment>
        {addIndex(map)((areaCode, i) => {
          return changeObjects.muut[areaCode].length ? (
            <ExpandableRowRoot
              anchor={`${sectionId}_${areaCode}`}
              changes={prop(areaCode, changeObjects.perustelut)}
              code={areaCode}
              disableReverting={isReadOnly}
              hideAmountOfChanges={true}
              isExpanded={true}
              key={`expandable-row-root-${i}`}
              messages={changesMessages}
              onChangesRemove={onChangesRemove}
              onUpdate={onChangesUpdate}
              sectionId={sectionId}
              showCategoryTitles={true}
              title={path(
                [areaCode, 0, "properties", "metadata", "title"],
                changeObjects.muut
              )}>
              <Lomake
                action="reasoning"
                anchor={`${sectionId}_${areaCode}`}
                changeObjects={prop(areaCode, changeObjects.perustelut)}
                isReadOnly={isReadOnly}
                data={{
                  areaCode,
                  changeObjectsPage1: changeObjects.muut[areaCode],
                  maaraykset,
                  muut,
                  vankilat
                }}
                onChangesUpdate={onChangesUpdate}
                path={["perustelut", "muut"]}
                rulesFn={getRules}
                showCategoryTitles={true}></Lomake>
            </ExpandableRowRoot>
          ) : null;
        }, keys(changeObjects.muut).sort())}
      </React.Fragment>
    );
  }
);

PerustelutMuut.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  headingNumber: PropTypes.number,
  isReadOnly: PropTypes.bool,
  maaraykset: PropTypes.array,
  muut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  title: PropTypes.string,
  vankilat: PropTypes.array
};

export default PerustelutMuut;
