import React from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../../../../02-organisms/CategorizedListRoot";
import { getOpiskelijavuodetVaativaKoulutusPerustelulomake } from "../../../../../services/lomakkeet/perustelut/muut";

const defaultProps = {
  changeObjects: [],
  isReadOnly: false
};

const OpiskelijavuodetVaativaKoulutusPerustelulomake = ({
  changeObjects = defaultProps.changeObjects,
  valueChangeObject,
  onChangesUpdate,
  sectionId,
  isReadOnly = defaultProps.isReadOnly,
  differenceTitles
}) => {
  const lomake = getOpiskelijavuodetVaativaKoulutusPerustelulomake(isReadOnly, valueChangeObject, differenceTitles);

  return (
    <div className="p-8">
      {changeObjects ? (
        <CategorizedListRoot
          anchor={sectionId}
          categories={lomake}
          changes={changeObjects}
          onUpdate={onChangesUpdate}
          showCategoryTitles={true}
        />
      ) : null}
    </div>
  );
};

OpiskelijavuodetVaativaKoulutusPerustelulomake.propTypes = {
  changeObjects: PropTypes.array,
  isReadOnly: PropTypes.bool,
  valueChangeObject: PropTypes.object,
  differenceTitles: PropTypes.array
};

export default OpiskelijavuodetVaativaKoulutusPerustelulomake;
