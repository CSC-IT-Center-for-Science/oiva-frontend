import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { toUpper } from "ramda";

const constants = {
  mode: "modification",
  formLocation: ["esiJaPerusopetus", "opetusJotaLupaKoskee"]
};

const Opetustehtavat = ({
  code,
  isPreviewModeOn,
  mode = constants.mode,
  opetustehtavakoodisto,
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
      rowTitle={opetustehtavakoodisto.metadata[toUpper(intl.locale)].nimi}
      showCategoryTitles={true}></Lomake>
  );
};

Opetustehtavat.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  mode: PropTypes.string,
  opetustehtavakoodisto: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Opetustehtavat;
