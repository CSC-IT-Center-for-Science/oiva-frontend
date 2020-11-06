import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import education from "../../../i18n/definitions/education";

const constants = {
  formLocations: ["esiJaPerusopetus", "opetuksenJarjestamismuodot"]
}

const OpetuksenJarjestamismuoto = ({
  sectionId
}) => {
  const intl = useIntl();

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      path={constants.formLocations}
      showCategoryTitles={true}
      isRowExpanded={true}
      rowTitle={intl.formatMessage(education.opetuksenJarjestamismuodot)}></Lomake>
  );
};

OpetuksenJarjestamismuoto.propTypes = {
  sectionId: PropTypes.string
};

export default OpetuksenJarjestamismuoto;
