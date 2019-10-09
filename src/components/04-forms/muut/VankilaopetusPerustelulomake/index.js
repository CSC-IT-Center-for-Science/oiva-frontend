import React from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../../../02-organisms/CategorizedListRoot";
import { getVankilaopetusPerustelulomake } from "../../../../services/lomakkeet/perustelut/muut";

const defaultProps = {
  changes: []
};

const VankilaopetusPerustelulomake = ({ changes = defaultProps.changes }) => {
  const lomake = getVankilaopetusPerustelulomake();

  return (
    <div className="p-8">
      <CategorizedListRoot
        anchor="lomake"
        categories={lomake}
        changes={changes}
        onUpdate={() => {}}
        showCategoryTitles={true}
      />
    </div>
  );
};

VankilaopetusPerustelulomake.propTypes = {
  changes: PropTypes.array
};

export default VankilaopetusPerustelulomake;
