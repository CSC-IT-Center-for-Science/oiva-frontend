import React from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../../components/02-organisms/Lomake";

const constants = {
  formLocation: ["kielet", "tutkintokielet"]
};

const Koulutusala = ({ aktiivisetTutkinnot, sectionId, title }) => {
  return (
    <Lomake
      mode="modification"
      anchor={sectionId}
      data={{ aktiiviset: aktiivisetTutkinnot }}
      path={constants.formLocation}
      rowTitle={title}
      showCategoryTitles={true}
    />
  );
};

Koulutusala.propTypes = {
  koodiarvo: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Koulutusala;
