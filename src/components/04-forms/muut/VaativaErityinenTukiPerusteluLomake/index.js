import React from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../../../02-organisms/CategorizedListRoot";
import { getVaativaErityinenTukilomake } from "../../../../services/lomakkeet/perustelut/muut";

const defaultProps = {
  changes: []
};

const VaativaErityinenTukiPerusteluLomake = ({ changes = defaultProps.changes }) => {
  const lomake = getVaativaErityinenTukilomake();

  return (
    <CategorizedListRoot
      anchor="lomake"
      categories={lomake}
      changes={changes}
      onUpdate={() => {}}
      showCategoryTitles={true}
    />
  );
};

VaativaErityinenTukiPerusteluLomake.propTypes = {
  changes: PropTypes.array
};

export default VaativaErityinenTukiPerusteluLomake;
