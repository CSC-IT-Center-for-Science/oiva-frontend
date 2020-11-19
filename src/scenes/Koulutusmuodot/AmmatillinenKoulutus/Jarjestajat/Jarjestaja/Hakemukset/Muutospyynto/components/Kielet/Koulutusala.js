import React from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../../components/02-organisms/Lomake";
import { useLomakedata } from "stores/lomakedata";

const constants = {
  formLocation: ["kielet", "tutkintokielet"]
};

const Koulutusala = ({ koodiarvo, sectionId, title }) => {
  const [tutkintodata] = useLomakedata({
    anchor: "tutkinnot"
  });

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={tutkintodata[koodiarvo]}
      path={constants.formLocation}
      rowTitle={title}
      showCategoryTitles={true}
    />
  );
};

Koulutusala.propTypes = {
  koodiarvo: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default Koulutusala;
