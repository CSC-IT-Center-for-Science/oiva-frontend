import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import education from "i18n/definitions/education";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  mode: "modification",
  formLocation: ["lukiokoulutus", "oikeusSisaoppilaitosmuotoiseenKoulutukseen"]
};

const OikeusSisaoppilaitosmuotoiseenKoulutukseen = ({
  code,
  isPreviewModeOn,
  maaraykset,
  mode = constants.mode,
  sectionId,
  rajoitteet,
  title
}) => {
  const intl = useIntl();

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      code={code}
      data={{ maaraykset, rajoitteet }}
      formTitle={title}
      isPreviewModeOn={isPreviewModeOn}
      isRowExpanded={true}
      mode={mode}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(
        education.oikeusSisaoppilaitosmuotoiseenKoulutukseen
      )}
      showCategoryTitles={true}
    ></Lomake>
  );
};

OikeusSisaoppilaitosmuotoiseenKoulutukseen.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  rajoitteet: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default OikeusSisaoppilaitosmuotoiseenKoulutukseen;
