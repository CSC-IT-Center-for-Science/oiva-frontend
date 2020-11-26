import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import education from "i18n/definitions/education";

const constants = {
  formLocation: ["esiJaPerusopetus", "opiskelijamaarat"],
  mode: "modification"
};

const Opiskelijamaarat = ({
  code,
  isPreviewModeOn,
  mode = constants.mode,
  sectionId,
  title
}) => {
  const intl = useIntl();

  return (
    <Lomake
      anchor={sectionId}
      code={code}
      formTitle={title}
      mode={mode}
      isPreviewModeOn={isPreviewModeOn}
      isRowExpanded={true}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(education.oppilasOpiskelijamaarat)}
      showCategoryTitles={true}></Lomake>
  );
};

Opiskelijamaarat.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  mode: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Opiskelijamaarat;
