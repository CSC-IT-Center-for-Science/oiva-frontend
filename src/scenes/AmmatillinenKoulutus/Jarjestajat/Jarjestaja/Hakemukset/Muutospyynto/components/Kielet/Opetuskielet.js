import React from "react";
import wizardMessages from "../../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";

const constants = {
  formLocation: ["kielet", "opetuskielet"]
};

const Opetuskielet = () => {
  const intl = useIntl();
  const sectionId = "kielet_opetuskielet";

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      isRowExpanded={true}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.teachingLanguages)}
      showCategoryTitles={true}
    />
  );
};

export default Opetuskielet;
