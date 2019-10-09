import React, { useState } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../../../02-organisms/CategorizedListRoot";
import { getTyovoimakoulutuslomake } from "../../../../services/lomakkeet/perustelut/muut";

const defaultProps = {
  changes: []
};

const Tyovoimakoulutuslomake = ({ changes = defaultProps.changes }) => {
  const [lomake] = useState(getTyovoimakoulutuslomake());

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

Tyovoimakoulutuslomake.propTypes = {
  changes: PropTypes.array
};

export default Tyovoimakoulutuslomake;
