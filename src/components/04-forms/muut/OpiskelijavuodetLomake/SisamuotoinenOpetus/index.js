import React from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../../../../02-organisms/CategorizedListRoot";
import { getOpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake } from "../../../../../services/lomakkeet/perustelut/muut";

const defaultProps = {
  changeObjects: []
};

const OpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake = ({
  changeObjects = defaultProps.changeObjects,
  onChangesUpdate,
  sectionId
}) => {
  const lomake = getOpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake();

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

OpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake.propTypes = {
  changeObjects: PropTypes.array
};

export default OpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake;
