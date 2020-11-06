import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import education from "../../../i18n/definitions/education";
import { getAnchorPart } from "../../../utils/common";
import { useChangeObjects } from "scenes/AmmatillinenKoulutus/store";

const constants = {
  formLocations: ["esiJaPerusopetus", "erityisetKoulutustehtavat"]
};

const ErityisetKoulutustehtavat = ({ sectionId }) => {
  const intl = useIntl();
  const [, { createTextBoxChangeObject }] = useChangeObjects();

  const onAddButtonClick = useCallback(
    addBtn => {
      createTextBoxChangeObject(sectionId, getAnchorPart(addBtn.anchor, 1));
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
      rowTitle={intl.formatMessage(
        education.erityisetKoulutustehtavat
      )}></Lomake>
  );
};

ErityisetKoulutustehtavat.propTypes = {
  sectionId: PropTypes.string
};

export default ErityisetKoulutustehtavat;
