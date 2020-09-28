import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import { equals } from "ramda";

const Liitetiedostot = React.memo(
  ({ changeObjects, onChangesUpdate }) => {
    const intl = useIntl();
    const sectionId = "liitetiedostot";

    return (
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={changeObjects.liitetiedostot}
        onChangesUpdate={onChangesUpdate}
        path={["esiJaPerusopetus", "liitetiedostot"]}
        showCategoryTitles={true}></Lomake>
    );
  },
  (currentProps, nextProps) => {
    return equals(currentProps.changeObjects, nextProps.changeObjects);
  }
);

Liitetiedostot.propTypes = {
  changeObjects: PropTypes.array,
  onChangesUpdate: PropTypes.func
};

export default Liitetiedostot;
