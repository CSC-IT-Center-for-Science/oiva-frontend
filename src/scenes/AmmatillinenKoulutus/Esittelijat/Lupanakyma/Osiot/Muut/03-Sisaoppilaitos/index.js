import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "scenes/AmmatillinenKoulutus/store";
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
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "sisaoppilaitos"]
};

const Sisaoppilaitos = ({
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
        lomakedata.sisaoppilaitos || {}
      ),
      items,
      koodiarvot: ["4"],
      maarayksetByKoodiarvo
    }),
    [items, lomakedata.sisaoppilaitos, maarayksetByKoodiarvo]
  );

  const koodiarvot = map(prop("koodiarvo"), items);

  useEffect(() => {
    const muutostenJalkeenAktiivisetKoodiarvot = filter(koodiarvo => {
      const changeObj = find(
        pathEq(["properties", "metadata", "koodiarvo"], koodiarvo),
        changeObjects
      );
      return (
        includes(koodiarvo, koodiarvot) &&
        (!changeObj ||
          (changeObj && pathEq(["properties", "isChecked"], true, changeObj)))
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
      action="modification"
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
