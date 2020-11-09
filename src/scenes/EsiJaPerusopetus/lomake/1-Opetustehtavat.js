import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import { toUpper } from "ramda";

const constants = {
  formLocation: ["esiJaPerusopetus", "opetusJotaLupaKoskee"]
};

const Opetustehtavat = ({ opetustehtavakoodisto, sectionId }) => {
  const intl = useIntl();

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      isRowExpanded={true}
      path={constants.formLocation}
      rowTitle={opetustehtavakoodisto.metadata[toUpper(intl.locale)].nimi}
      showCategoryTitles={true}></Lomake>
  );
};

Opetustehtavat.propTypes = {
  opetustehtavakoodisto: PropTypes.object,
  sectionId: PropTypes.string
};

export default Opetustehtavat;
