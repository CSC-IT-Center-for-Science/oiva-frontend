import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import education from "i18n/definitions/education";

const constants = {
  mode: "modification",
  formLocation: ["esiJaPerusopetus", "opetuksenJarjestamismuodot"]
};

const OpetuksenJarjestamismuoto = ({
  code,
  isPreviewModeOn,
  maaraykset,
  mode = constants.mode,
  sectionId,
  rajoitteet,
  title
}) => {
  const intl = useIntl();

  return (
    <Lomake
      anchor={sectionId}
      code={code}
      data={{ maaraykset, rajoitteet }}
      formTitle={title}
      isPreviewModeOn={isPreviewModeOn}
      isRowExpanded={true}
      mode={mode}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(education.opetuksenJarjestamismuodot)}
      showCategoryTitles={true}
    ></Lomake>
  );
};

OpetuksenJarjestamismuoto.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  rajoitteet: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default OpetuksenJarjestamismuoto;
