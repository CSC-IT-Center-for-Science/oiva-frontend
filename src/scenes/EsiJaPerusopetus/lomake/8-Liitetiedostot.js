import React from "react";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";

const Liitetiedostot = ({ changeObjects, onChangesUpdate, sectionId }) => {
  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      changeObjects={changeObjects}
      onChangesUpdate={onChangesUpdate}
      path={["esiJaPerusopetus", "liitetiedostot"]}
      showCategoryTitles={true}></Lomake>
  );
};

Liitetiedostot.propTypes = {
  changeObjects: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  sectionId: PropTypes.string
};

export default Liitetiedostot;
