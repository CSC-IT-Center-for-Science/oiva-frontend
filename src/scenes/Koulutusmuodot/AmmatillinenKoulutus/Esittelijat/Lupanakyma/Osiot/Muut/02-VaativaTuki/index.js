import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import { useLomakedata } from "stores/lomakedata";
import {
  concat,
  filter,
  find,
  includes,
  keys,
  map,
  path,
  pathEq,
  prop
} from "ramda";
import Lomake from "components/02-organisms/Lomake";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "vaativaTuki"]
};

const VaativaTuki = ({
  items,
  localeUpper,
  maarayksetByKoodiarvo,
  sectionId
}) => {
  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "muut"
  });

  const [lomakedata, { setLomakedata }] = useLomakedata({
    anchor: "opiskelijavuodet"
  });

  const dataLomakepalvelulle = useMemo(
    () => ({
      isApplyForValueSet: prop(
        "isApplyForValueSet",
        lomakedata.vaativaTuki || {}
      ),
      items,
      maarayksetByKoodiarvo,
      koodiarvot: ["2", "16", "17", "18", "19", "20", "21"]
    }),
    [items, lomakedata.vaativaTuki, maarayksetByKoodiarvo]
  );

  const koodiarvot = concat(
    map(prop("koodiarvo"), items.vaativa_1),
    map(prop("koodiarvo"), items.vaativa_2)
  );

  useEffect(() => {
    const muutostenJalkeenAktiivisetKoodiarvot = filter(koodiarvo => {
      const changeObj = find(
        pathEq(["properties", "metadata", "koodiarvo"], koodiarvo),
        changeObjects
      );
      return (
        includes(koodiarvo, koodiarvot) &&
        (!changeObj || pathEq(["properties", "isChecked"], true, changeObj))
      );
    }, keys(maarayksetByKoodiarvo)).filter(Boolean);

    const muutostenMyotaAktiivisetKoodiarvot = map(changeObj => {
      const koodiarvo = path(
        ["properties", "metadata", "koodiarvo"],
        changeObj
      );
      return includes(koodiarvo, koodiarvot) &&
        pathEq(["properties", "isChecked"], true, changeObj)
        ? path(["properties", "metadata", "koodiarvo"], changeObj)
        : null;
    }, changeObjects).filter(Boolean);

    setLomakedata(
      concat(
        muutostenJalkeenAktiivisetKoodiarvot,
        muutostenMyotaAktiivisetKoodiarvot
      ),
      `${sectionId}_valitutKoodiarvot`
    );
  }, [
    changeObjects,
    koodiarvot,
    maarayksetByKoodiarvo,
    sectionId,
    setLomakedata
  ]);

  return (
    <Lomake
      mode="modification"
      anchor={sectionId}
      data={dataLomakepalvelulle}
      path={constants.formLocation}
      rowTitle={items.vaativa_1[0].metadata[localeUpper].nimi}
      showCategoryTitles={true}
    />
  );
};

VaativaTuki.propTypes = {
  opiskelijavuodetData: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default VaativaTuki;
