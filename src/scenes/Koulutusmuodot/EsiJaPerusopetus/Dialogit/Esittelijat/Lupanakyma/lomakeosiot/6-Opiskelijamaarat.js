import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import education from "../../../../../../../i18n/definitions/education";

const constants = {
  formLocations: ["esiJaPerusopetus", "opiskelijamaarat"]
}

const Opiskelijamaarat = ({
  sectionId
}) => {
  const intl = useIntl();

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      isRowExpanded={true}
      path={constants.formLocations}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(education.oppilasOpiskelijamaarat)}></Lomake>
  );
};

Opiskelijamaarat.propTypes = {
  sectionId: PropTypes.string
};

export default Opiskelijamaarat;
