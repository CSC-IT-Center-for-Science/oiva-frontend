import React from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { addIndex, curry, keys, map, path, prop } from "ramda";
import { getRules } from "../../../../../../../services/lomakkeet/perustelut/muutMuutokset/rules";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  maaraykset: [],
  muut: [],
  lomakkeet: {},
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
    const sectionId = "perustelut_muut";

    return (
      <React.Fragment>
        {addIndex(map)((areaCode, i) => {
          return (
            <ExpandableRowRoot
              anchor={`${sectionId}_${areaCode}`}
              categories={[]}
              changes={prop(areaCode, changeObjects.perustelut)}
              code={areaCode}
              disableReverting={isReadOnly}
              isExpanded={true}
              key={`expandable-row-root-${i}`}
              onChangesRemove={onChangesRemove}
              onUpdate={onChangesUpdate}
              sectionId={sectionId}
              showCategoryTitles={true}
              title={path(
                [areaCode, 0, "properties", "metadata", "title"],
                changeObjects.muut
              )}
              hideAmountOfChanges={false}>
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
          );
        }, keys(changeObjects.muut))}
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
