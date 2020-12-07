import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import common from "i18n/definitions/common";

const constants = {
  mode: "modification",
  formLocation: ["esiJaPerusopetus", "opetuskielet"]
};

const Opetuskieli = ({
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
      isPreviewModeOn={isPreviewModeOn}
      isRowExpanded={true}
      mode={mode}
      path={constants.formLocation}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(common.kielet)}></Lomake>
  );
};

Opetuskieli.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  mode: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Opetuskieli;
