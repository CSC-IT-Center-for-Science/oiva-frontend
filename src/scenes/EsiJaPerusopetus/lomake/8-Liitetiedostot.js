import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";

const Liitetiedostot = ({ changeObjects, onChangesUpdate, sectionId }) => {
  const onChanges = useCallback((payload, { files }) => {
    console.info(payload, files);
  }, []);

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      changeObjects={changeObjects}
      data={{
        onChanges
      }}
      noPadding={true}
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
