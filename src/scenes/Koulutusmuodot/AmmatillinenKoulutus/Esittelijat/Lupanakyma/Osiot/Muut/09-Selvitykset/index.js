import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "selvitykset"]
};

const Selvitykset = ({
  isReadOnly,
  items,
  localeUpper,
  maarayksetByKoodiarvo,
  mode,
  sectionId
}) => {
  const dataLomakepalvelulle = useMemo(
    () => ({
      items,
      maarayksetByKoodiarvo
    }),
    [items, maarayksetByKoodiarvo]
  );

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      data={dataLomakepalvelulle}
      isReadOnly={isReadOnly}
      mode={mode}
      path={constants.formLocation}
      rowTitle={items[0].metadata[localeUpper].nimi}
      showCategoryTitles={true}
    />
  );
};

Selvitykset.propTypes = {
  items: PropTypes.array,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.object,
  mode: PropTypes.string,
  sectionId: PropTypes.string
};

export default Selvitykset;
