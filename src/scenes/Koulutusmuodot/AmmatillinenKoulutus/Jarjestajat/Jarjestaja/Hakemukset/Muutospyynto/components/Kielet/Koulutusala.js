import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";

const constants = {
  formLocation: ["kielet", "tutkintokielet"]
};

const Koulutusala = ({ aktiivisetTutkinnot, mode, sectionId, title }) => {
  return (
    <Lomake
      anchor={sectionId}
      data={{ aktiiviset: aktiivisetTutkinnot }}
      mode={mode}
      path={constants.formLocation}
      rowTitle={title}
      showCategoryTitles={true}
    />
  );
};

Koulutusala.propTypes = {
  aktiivisetTutkinnot: PropTypes.array,
  koodiarvo: PropTypes.string,
  mode: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Koulutusala;
