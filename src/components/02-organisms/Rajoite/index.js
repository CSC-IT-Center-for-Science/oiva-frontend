import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";

const defaultProps = {
  areTitlesVisible: true,
  isReadOnly: false
};

const constants = {
  formLocation: ["esiJaPerusopetus", "rajoite"]
};

const Rajoite = ({
  areTitlesVisible = defaultProps.areTitlesVisible,
  isReadOnly = defaultProps.isReadOnly,
  rajoiteId,
  rajoite
}) => {
  console.info(rajoite.changeObjects);
  return rajoite ? (
    <Lomake
      anchor={"rajoitteet"}
      data={{
        rajoiteId,
        sectionId: "rajoitelomake",
        changeObjects: rajoite.changeObjects
      }}
      isInExpandableRow={false}
      isPreviewModeOn={isReadOnly}
      isReadOnly={isReadOnly}
      isSavingState={false}
      path={constants.formLocation}
      showCategoryTitles={areTitlesVisible}
    ></Lomake>
  ) : (
    <p>Jokin meni pieleen rajoitteen näyttämisessä.</p>
  );
};

Rajoite.propTypes = {
  isReadOnly: PropTypes.bool,
  areTitlesVisible: PropTypes.bool,
  rajoiteId: PropTypes.string.isRequired,
  rajoite: PropTypes.object
};

export default Rajoite;
