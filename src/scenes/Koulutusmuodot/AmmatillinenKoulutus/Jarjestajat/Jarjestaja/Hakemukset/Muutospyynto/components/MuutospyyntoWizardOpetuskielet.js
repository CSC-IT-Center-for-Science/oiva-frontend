import React from "react";
import PropTypes from "prop-types";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import Lomake from "components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import wizardMessages from "i18n/definitions/wizard";

const constants = {
  formLocation: ["kielet", "opetuskielet"]
};

const MuutospyyntoWizardOpetuskielet = ({
  isReadOnly,
  mode,
  sectionHeadingsOpetusJaTutkintokieli
}) => {
  const intl = useIntl();
  const sectionId = "kielet_opetuskielet";
  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      code={String(sectionHeadingsOpetusJaTutkintokieli.number)}
      formTitle={sectionHeadingsOpetusJaTutkintokieli.title}
      isPreviewModeOn={false}
      isReadOnly={isReadOnly}
      isRowExpanded={true}
      mode={mode}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.teachingLanguages)}
      showCategoryTitles={true}
    />
  );
};

MuutospyyntoWizardOpetuskielet.propTypes = {
  mode: PropTypes.string,
  sectionHeadingsOpetusJaTutkintokieli: PropTypes.object
};

export default MuutospyyntoWizardOpetuskielet;
