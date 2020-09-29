import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import { equals } from "ramda";

const Liitetiedostot = ({ changeObjects, onChangesUpdate, sectionId }) => {
  const intl = useIntl();

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
