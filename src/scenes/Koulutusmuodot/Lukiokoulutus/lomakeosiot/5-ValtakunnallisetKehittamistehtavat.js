import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import education from "i18n/definitions/education";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import { useLomakedata } from "stores/lomakedata";
import { compose, filter, prop, propEq } from "ramda";

const constants = {
  formLocation: ["lukiokoulutus", "valtakunnallinenKehittamistehtava"],
  mode: "modification"
};

const ValtakunnallisetKehittamistehtavat = ({
  code,
  isPreviewModeOn,
  maaraykset,
  mode = constants.mode,
  rajoitteet,
  sectionId,
  title
}) => {
  const intl = useIntl();
  const [checkboxStatesSection4, setCheckboxStatesSection4] = useState([]);

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const [stateObjectsSection4] = useLomakedata({
    anchor: "erityisetKoulutustehtavat"
  });

  useEffect(() => {
    setCheckboxStatesSection4(
      filter(
        compose(propEq("isChecked", true), prop("properties")),
        stateObjectsSection4
      )
    );
  }, [stateObjectsSection4]);

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      code={code}
      data={{ checkboxStatesSection4, maaraykset, rajoitteet, sectionId }}
      formTitle={title}
      mode={mode}
      isPreviewModeOn={isPreviewModeOn}
      isRowExpanded={true}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(education.valtakunnallinenKehittamistehtava)}
      showCategoryTitles={true}
    ></Lomake>
  );
};

ValtakunnallisetKehittamistehtavat.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  rajoitteet: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default ValtakunnallisetKehittamistehtavat;
