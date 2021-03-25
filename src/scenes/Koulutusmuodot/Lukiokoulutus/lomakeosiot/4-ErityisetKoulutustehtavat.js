import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import education from "i18n/definitions/education";
import { getAnchorPart } from "utils/common";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "stores/muutokset";

const constants = {
  formLocation: ["lukiokoulutus", "erityisetKoulutustehtavat"],
  mode: "modification"
};

const ErityisetKoulutustehtavat = ({
  code,
  isPreviewModeOn,
  maaraykset,
  mode = constants.mode,
  rajoitteet,
  sectionId,
  title
}) => {
  const intl = useIntl();
  const [, { createTextBoxChangeObject }] = useChangeObjects();

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const onAddButtonClick = useCallback(
    (fromComponent, index) => {
      createTextBoxChangeObject(
        sectionId,
        getAnchorPart(fromComponent.fullAnchor, 1),
        index
      );
    },
    [createTextBoxChangeObject, sectionId]
  );

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      code={code}
      data={{ maaraykset, rajoitteet, sectionId }}
      functions={{
        onAddButtonClick
      }}
      formTitle={title}
      mode={mode}
      isPreviewModeOn={isPreviewModeOn}
      isRowExpanded={true}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(education.erityisetKoulutustehtavat)}
      showCategoryTitles={true}
    ></Lomake>
  );
};

ErityisetKoulutustehtavat.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  rajoitteet: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default ErityisetKoulutustehtavat;
