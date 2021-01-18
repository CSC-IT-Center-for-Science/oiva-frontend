import React from "react";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { getMaarayksetByTunniste } from "helpers/lupa";
import { useLomakedata } from "stores/lomakedata";

const constants = {
  formLocation: ["opiskelijavuodet"]
};

const MuutospyyntoWizardOpiskelijavuodet = React.memo(
  ({ code, maaraykset, muut, sectionId, title }) => {
    const [muutLomakedata] = useLomakedata({
      anchor: "muut"
    });
    const opiskelijavuosiMaaraykset = getMaarayksetByTunniste(
      "opiskelijavuodet",
      maaraykset
    );
    const muutMaaraykset = getMaarayksetByTunniste("muut", maaraykset);

    return muut && muutMaaraykset && opiskelijavuosiMaaraykset ? (
      <Lomake
        anchor={sectionId}
        code={code}
        data={{ muutLomakedata, sectionId }}
        formTitle={title}
        isRowExpanded={true}
        mode="modification"
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
  muut: PropTypes.array,
  sectionId: PropTypes.string
};

export default MuutospyyntoWizardOpiskelijavuodet;
