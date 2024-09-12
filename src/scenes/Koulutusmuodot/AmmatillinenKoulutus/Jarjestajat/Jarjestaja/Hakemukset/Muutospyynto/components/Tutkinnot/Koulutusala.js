import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocation: ["tutkinnot"]
};

const Koulutusala = ({
  data,
  isPreviewModeOn,
  isReadOnly,
  mode,
  sectionId,
  title
}) => {
  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      data={data}
      isPreviewModeOn={isPreviewModeOn}
      isReadOnly={isReadOnly}
      isRowExpanded={mode === "reasoning"}
      key={sectionId}
      mode={mode}
      path={constants.formLocation}
      rowTitle={title}
      showCategoryTitles={true}
    />
  );
};

Koulutusala.propTypes = {
  data: PropTypes.object,
  isPreviewModeOn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  mode: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string,
  tutkinnot: PropTypes.array
};

export default Koulutusala;
