import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";

const constants = {
  formLocation: ["tutkinnot"]
};

const Koulutusala = ({ data, sectionId, title }) => {
  return (
    <Lomake
      anchor={sectionId}
      data={data}
      key={sectionId}
      mode="modification"
      path={constants.formLocation}
      rowTitle={title}
      showCategoryTitles={true}
    />
  );
};

Koulutusala.propTypes = {
  data: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string,
  tutkinnot: PropTypes.array
};

export default Koulutusala;
