import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";

const defaultProps = {
  areTitlesVisible: true,
  isReadOnly: false
};

const constants = {
  formLocation: ["rajoitteet", "rajoitedialogi"]
};

const Rajoite = ({
  areTitlesVisible = defaultProps.areTitlesVisible,
  isReadOnly = defaultProps.isReadOnly,
  rajoiteId,
  rajoite
}) => {
  return rajoite ? (
    <Lomake
      anchor={"rajoitteet"}
      data={{
        rajoiteId,
        sectionId: "rajoitelomake",
        changeObjects: rajoite.changeObjects,
        rajoitteet: rajoite
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
  rajoiteId: PropTypes.string,
  rajoite: PropTypes.object
};

export default Rajoite;
