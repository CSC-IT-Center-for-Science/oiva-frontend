import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import education from "../../../../../../../i18n/definitions/education";
import { useChangeObjects } from "stores/muutokset";

const constants = {
  formLocations: ["esiJaPerusopetus", "muutEhdot"]
};

const MuutEhdot = ({ sectionId }) => {
  const intl = useIntl();
  const [, { createTextBoxChangeObject }] = useChangeObjects();

  const onAddButtonClick = useCallback(
    koodiarvo => {
      createTextBoxChangeObject(sectionId, koodiarvo);
    },
    [createTextBoxChangeObject, sectionId]
  );

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={{ onAddButtonClick }}
      isRowExpanded={true}
      path={constants.formLocations}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(education.muutEhdotTitle)}></Lomake>
  );
};

MuutEhdot.propTypes = {
  sectionId: PropTypes.string
};

export default MuutEhdot;
