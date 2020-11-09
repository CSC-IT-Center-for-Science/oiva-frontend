import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjects } from "scenes/AmmatillinenKoulutus/store";
import { getAnchorPart } from "utils/common";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "yhteistyosopimus"]
};

const Yhteistyosopimus = ({
  items,
  localeUpper,
  maarayksetByKoodiarvo,
  sectionId
}) => {
  const [, { createTextBoxChangeObject }] = useChangeObjects();

  const onAddButtonClick = useCallback(
    addBtn => {
      createTextBoxChangeObject(sectionId, getAnchorPart(addBtn.anchor, 1));
    },
    [createTextBoxChangeObject, sectionId]
  );

  const dataLomakepalvelulle = useMemo(
    () => ({
      items,
      maarayksetByKoodiarvo,
      onAddButtonClick,
      sectionId
    }),
    [items, maarayksetByKoodiarvo, onAddButtonClick, sectionId]
  );

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={dataLomakepalvelulle}
      path={constants.formLocation}
      rowTitle={items[0].metadata[localeUpper].nimi}
      showCategoryTitles={true}
    />
  );
};

Yhteistyosopimus.propTypes = {
  items: PropTypes.array,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.object,
  sectionId: PropTypes.string
};

export default Yhteistyosopimus;
