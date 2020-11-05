import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import education from "../../../i18n/definitions/education";

const constants = {
  formLocations: ["esiJaPerusopetus", "opiskelijamaarat"]
}

const Opiskelijamaarat = ({
  lisatiedot,
  sectionId
}) => {
  const intl = useIntl();

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={{
        lisatiedot
      }}
      path={constants.formLocations}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(education.oppilasOpiskelijamaarat)}></Lomake>
  );
};

Opiskelijamaarat.propTypes = {
  lisatiedot: PropTypes.array,
  sectionId: PropTypes.string
};

export default Opiskelijamaarat;
