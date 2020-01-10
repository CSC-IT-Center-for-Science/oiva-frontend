import React, { useState } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../../../02-organisms/CategorizedListRoot";
import {getOppisopimusPerusteluLomake} from "../../../../services/lomakkeet/perustelut/muut";

const defaultProps = {
  changes: []
};

const OppisopimusPerusteluLomake = ({ changes = defaultProps.changes }) => {
  const [lomake] = useState(getOppisopimusPerusteluLomake());

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

OppisopimusPerusteluLomake.propTypes = {
  changes: PropTypes.array
};

export default OppisopimusPerusteluLomake;
