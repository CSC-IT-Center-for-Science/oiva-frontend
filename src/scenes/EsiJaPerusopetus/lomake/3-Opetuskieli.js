import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";

const constants = {
  formLocation: ["esiJaPerusopetus", "opetuskielet"]
};

const Opetuskieli = ({ sectionId }) => {
  const intl = useIntl();
  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      isRowExpanded={true}
      path={constants.formLocation}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(common.kielet)}></Lomake>
  );
};

Opetuskieli.propTypes = {
  sectionId: PropTypes.string
};

export default Opetuskieli;
