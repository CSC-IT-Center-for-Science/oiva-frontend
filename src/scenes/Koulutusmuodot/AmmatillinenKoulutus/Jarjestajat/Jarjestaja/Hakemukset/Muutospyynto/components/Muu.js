import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import { useLomakedata } from "stores/lomakedata";
import { concat, filter, find, map, path, pathEq } from "ramda";

const constants = {
  formLocation: ["muut"]
};

const Muu = ({ configObj, koodiarvotLuvassa, sectionId }) => {
  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const [, { setLomakedata }] = useLomakedata({ anchor: "muut" });

  useEffect(() => {
    const muutostenJalkeenAktiivisetKoodiarvot = filter(koodiarvo => {
      const changeObj = find(
        pathEq(["properties", "metadata", "koodiarvo"], koodiarvo),
        changeObjects
      );
      return !pathEq(["properties", "isChecked"], false, changeObj);
    }, koodiarvotLuvassa).filter(Boolean);

    const muutostenMyotaAktiivisetKoodiarvot = map(changeObj => {
      return pathEq(["properties", "isChecked"], true, changeObj)
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
  }, [changeObjects, koodiarvotLuvassa, sectionId, setLomakedata]);

  return (
    <Lomake
      mode="modification"
      anchor={sectionId}
      data={configObj}
      path={constants.formLocation}
      rowTitle={configObj.title}
      showCategoryTitles={true}
    />
  );
};

Muu.propTypes = {
  koodiarvo: PropTypes.string,
  opiskelijavuodetData: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Muu;
