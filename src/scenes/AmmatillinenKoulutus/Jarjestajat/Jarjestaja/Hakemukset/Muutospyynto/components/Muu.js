import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import { map, path, pathEq } from "ramda";

const constants = {
  formLocation: ["muut"]
};

const Muu = ({ configObj, sectionId, title }) => {
  const [
    changeObjects,
    { setChanges }
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const [, { setLomakedata }] = useLomakedata({ anchor: "muut" });

  useEffect(() => {
    setLomakedata(
      map(changeObj => {
        return pathEq(["properties", "isChecked"], true, changeObj)
          ? path(["properties", "metadata", "koodiarvo"], changeObj)
          : null;
      }, changeObjects).filter(Boolean),
      `${sectionId}_valitutKoodiarvot`
    );
  }, [changeObjects]);

  return (
    <Lomake
      action="modification"
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
