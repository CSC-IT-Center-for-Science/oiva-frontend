import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "urheilu"]
};

const Urheilu = ({ items, localeUpper, maarayksetByKoodiarvo, sectionId }) => {
  const dataLomakepalvelulle = useMemo(
    () => ({
      items,
      maarayksetByKoodiarvo
    }),
    [items, maarayksetByKoodiarvo]
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

Urheilu.propTypes = {
  items: PropTypes.array,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.object,
  sectionId: PropTypes.string
};

export default Urheilu;
