import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { prop } from "ramda";
import { useLomakedata } from "stores/lomakedata";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "sisaoppilaitos"]
};

const Sisaoppilaitos = ({
  items,
  localeUpper,
  maarayksetByKoodiarvo,
  sectionId
}) => {
  const [lomakedata] = useLomakedata({
    anchor: "opiskelijavuodet"
  });

  const dataLomakepalvelulle = useMemo(
    () => ({
      isApplyForValueSet: prop("isApplyForValueSet", lomakedata.sisaoppilaitos),
      items,
      koodiarvot: ["4"],
      maarayksetByKoodiarvo
    }),
    [items, lomakedata.sisaoppilaitos, maarayksetByKoodiarvo]
  );

  return (
    <Lomake
      mode="modification"
      anchor={sectionId}
      data={dataLomakepalvelulle}
      path={constants.formLocation}
      rowTitle={items[0].metadata[localeUpper].nimi}
      showCategoryTitles={true}
    />
  );
};

Sisaoppilaitos.propTypes = {
  items: PropTypes.array,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.object,
  sectionId: PropTypes.string
};

export default Sisaoppilaitos;
