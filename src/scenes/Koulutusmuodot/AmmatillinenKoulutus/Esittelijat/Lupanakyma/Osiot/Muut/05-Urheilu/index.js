import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "urheilu"]
};

const Urheilu = ({
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
      isReadOnly={isReadOnly}
      mode={mode}
      path={constants.formLocation}
      rowTitle={items[0].metadata[localeUpper].nimi}
      showCategoryTitles={true}
    />
  );
};

Urheilu.propTypes = {
  items: PropTypes.array,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.object,
  sectionId: PropTypes.string
};

export default Urheilu;
