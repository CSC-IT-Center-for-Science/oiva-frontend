import React from "react";
import PropTypes from "prop-types";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";

import "./perustelut-toiminta-alue.module.css";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { rules } from "../../../../../../../services/lomakkeet/perustelut/toiminta-alue/rules";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  kohde: {},
  lupakohde: {},
  stateObjects: {}
};

const PerustelutToimintaalue = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    isReadOnly = defaultProps.isReadOnly,
    lupakohde = {},
    onChangesRemove,
    onChangesUpdate,
    sectionId
  }) => {
    return (
      <React.Fragment>
        {lupakohde && lupakohde.kunnat && lupakohde.maakunnat && (
          <ExpandableRowRoot
            anchor={sectionId}
            categories={[]}
            changes={changeObjects.perustelut}
            disableReverting={false}
            hideAmountOfChanges={true}
            isExpanded={true}
            onChangesRemove={onChangesRemove}
            onUpdate={onChangesUpdate}
            sectionId={sectionId}
            title="Muutokset">
            <Lomake
              action="reasoning"
              anchor={sectionId}
              changeObjects={changeObjects.perustelut}
              isReadOnly={isReadOnly}
              data={{
                changeObjectsPage1: changeObjects.toimintaalue,
                lupakohde
              }}
              onChangesUpdate={onChangesUpdate}
              path={["perustelut", "toimintaalue"]}
              rules={rules}
              showCategoryTitles={true}></Lomake>
          </ExpandableRowRoot>
        )}
      </React.Fragment>
    );
  }
);

PerustelutToimintaalue.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  lupakohde: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default PerustelutToimintaalue;
