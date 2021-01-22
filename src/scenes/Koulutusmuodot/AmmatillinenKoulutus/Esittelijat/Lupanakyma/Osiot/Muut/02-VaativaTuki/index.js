import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useLomakedata } from "stores/lomakedata";
import { find, path, propEq } from "ramda";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/tutkintomuutokset";

const constants = {
  formLocation: ["ammatillinenKoulutus", "muut", "vaativaTuki"]
};

const VaativaTuki = ({
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

  const [changeObjects, actions] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const vaativaTukiStateObj = find(
    propEq("anchor", "opiskelijavuodet.vaativatuki.A"),
    lomakedata
  );

  const dataLomakepalvelulle = useMemo(
    () => ({
      isApplyForValueSet: !!path(
        ["properties", "applyForValue"],
        vaativaTukiStateObj
      ),
      items,
      maarayksetByKoodiarvo,
      koodiarvot: ["2", "16", "17", "18", "19", "20", "21"]
    }),
    [items, vaativaTukiStateObj, maarayksetByKoodiarvo]
  );

  return (
    <Lomake
      actions={actions}
      anchor={sectionId}
      changeObjects={changeObjects}
      data={dataLomakepalvelulle}
      isReadOnly={isReadOnly}
      mode={mode}
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
