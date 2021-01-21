import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { getMaarayksetByTunniste } from "helpers/lupa";
import { useLomakedata } from "stores/lomakedata";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/tutkintomuutokset";

const constants = {
  formLocation: ["opiskelijavuodet"]
};

const MuutospyyntoWizardOpiskelijavuodet = React.memo(
  ({ code, maaraykset, mode, muut, sectionId, title }) => {
    const [muutLomakedata] = useLomakedata({
      anchor: "muut"
    });
    const [
      changeObjects,
      actions
    ] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: sectionId
    });
    const opiskelijavuosiMaaraykset = getMaarayksetByTunniste(
      "opiskelijavuodet",
      maaraykset
    );
    const muutMaaraykset = getMaarayksetByTunniste("muut", maaraykset);

    return muut && muutMaaraykset && opiskelijavuosiMaaraykset ? (
      <Lomake
        actions={actions}
        anchor={sectionId}
        changeObjects={changeObjects}
        code={code}
        data={{ muutLomakedata, sectionId }}
        formTitle={title}
        isRowExpanded={true}
        mode={mode}
        path={constants.formLocation}
        showCategoryTitles={true}
      ></Lomake>
    ) : null;
  }
);

MuutospyyntoWizardOpiskelijavuodet.defaultProps = {
  maaraykset: []
};

MuutospyyntoWizardOpiskelijavuodet.propTypes = {
  lupaKohteet: PropTypes.object,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  muut: PropTypes.array,
  sectionId: PropTypes.string
};

export default MuutospyyntoWizardOpiskelijavuodet;
