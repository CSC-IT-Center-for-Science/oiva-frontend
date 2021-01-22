import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/tutkintomuutokset";

const constants = {
  formLocation: ["kielet", "tutkintokielet"]
};

const Koulutusala = ({
  aktiivisetTutkinnot,
  koulutusalakoodiarvo,
  maaraykset,
  mode,
  sectionId,
  title
}) => {
  const [changeObjects, actions] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const lomakedata =
    mode === "modification"
      ? { aktiiviset: aktiivisetTutkinnot }
      : { koulutusalakoodiarvo, maaraykset };

  return (
    <Lomake
      actions={actions}
      anchor={sectionId}
      changeObjects={changeObjects}
      data={lomakedata}
      isRowExpanded={mode === "reasoning"}
      mode={mode}
      path={constants.formLocation}
      rowTitle={title}
      showCategoryTitles={true}
    />
  );
};

Koulutusala.propTypes = {
  aktiivisetTutkinnot: PropTypes.array,
  koodiarvo: PropTypes.string,
  mode: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Koulutusala;
