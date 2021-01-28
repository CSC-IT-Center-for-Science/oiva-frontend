import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocations: {
    paatoksenTiedot: ["esiJaPerusopetus", "paatoksenTiedot"]
  }
};

const AsianumeroYmsKentat = ({ isPreviewModeOn, mode = constants.mode }) => {
  const sectionId = "paatoksentiedot";

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      isInExpandableRow={false}
      isPreviewModeOn={isPreviewModeOn}
      mode={mode}
      noPadding={true}
      path={constants.formLocations.paatoksenTiedot}
    ></Lomake>
  );
};

AsianumeroYmsKentat.propTypes = {
  isPreviewModeOn: PropTypes.bool,
  mode: PropTypes.string
};

export default AsianumeroYmsKentat;
