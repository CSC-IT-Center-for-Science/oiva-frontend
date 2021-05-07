import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { find, path, propEq } from "ramda";
import { useLomakedata } from "stores/lomakedata";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "sisaoppilaitos"]
};

const Sisaoppilaitos = ({
  isReadOnly,
  items,
  localeUpper,
  maarayksetByKoodiarvo,
  mode,
  sectionId
}) => {
  const [lomakedata] = useLomakedata({
    anchor: "opiskelijavuodet"
  });

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const sisaoppilaitosStateObj = find(
    propEq("anchor", "opiskelijavuodet.sisaoppilaitos.A"),
    lomakedata
  );

  const dataLomakepalvelulle = useMemo(
    () => ({
      isApplyForValueSet: !!path(
        ["properties", "applyForValue"],
        sisaoppilaitosStateObj
      ),
      items,
      koodiarvot: ["4"],
      maarayksetByKoodiarvo
    }),
    [items, sisaoppilaitosStateObj, maarayksetByKoodiarvo]
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

Sisaoppilaitos.propTypes = {
  isReadOnly: PropTypes.bool,
  items: PropTypes.array,
  localeUpper: PropTypes.string,
  maarayksetByKoodiarvo: PropTypes.object,
  mode: PropTypes.string,
  sectionId: PropTypes.string
};

export default Sisaoppilaitos;
