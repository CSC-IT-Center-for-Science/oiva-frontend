import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "yhteistyosopimus"]
};

const Yhteistyosopimus = ({
  isReadOnly,
  items,
  localeUpper,
  maarayksetByKoodiarvo,
  mode,
  sectionId
}) => {
  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });
  const dataLomakepalvelulle = useMemo(
    () => ({
      items,
      maarayksetByKoodiarvo
    }),
    [items, maarayksetByKoodiarvo]
  );

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      data={dataLomakepalvelulle}
      mode={mode}
      isReadOnly={isReadOnly}
      isRowExpanded={false}
      path={constants.formLocation}
      rowTitle={items[0].metadata[localeUpper].nimi}
      showCategoryTitles={true}
    />
  );
};

Yhteistyosopimus.propTypes = {
  isReadOnly: PropTypes.bool,
  items: PropTypes.array,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.object,
  mode: PropTypes.string,
  sectionId: PropTypes.string
};

export default Yhteistyosopimus;
