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

    /**
     * Tässä reagoidaan opiskelijavuosiosion muutoksiin ja tarkastellaan sitä,
     * onko sisäoppilaitosta ja vaativaa tukea koskevat kentät täytetty.
     * Tieto asetetaan jaettuun tilaan, josta sitä tarvitseva osio voi sen
     * lukea.
     */
    // useEffect(() => {
    //   const vahimmaisopiskelijavuodetChangeObj = find(
    //     propEq("anchor", `${sectionId}.vahimmaisopiskelijavuodet.A`),
    //     changeObjects
    //   );
    //   if (!!vahimmaisopiskelijavuodetChangeObj) {
    //     setLomakedata(
    //       vahimmaisopiskelijavuodetChangeObj.properties.isValueSet,
    //       `${sectionId}_vahimmaisopiskelijavuodet_isApplyForValueSet`
    //     );
    //   }
    //   const sisaoppilaitosChangeObj = find(
    //     propEq("anchor", `${sectionId}.sisaoppilaitos.A`),
    //     changeObjects
    //   );
    //   if (!!sisaoppilaitosChangeObj) {
    //     setLomakedata(
    //       sisaoppilaitosChangeObj.properties.isValueSet,
    //       `${sectionId}_sisaoppilaitos_isApplyForValueSet`
    //     );
    //   }
    //   const vaativaTukiChangeObj = find(
    //     propEq("anchor", `${sectionId}.vaativatuki.A`),
    //     changeObjects
    //   );
    //   if (!!vaativaTukiChangeObj) {
    //     setLomakedata(
    //       vaativaTukiChangeObj.properties.isValueSet,
    //       `${sectionId}_vaativaTuki_isApplyForValueSet`
    //     );
    //   }
    // }, [changeObjects, sectionId, setLomakedata]);

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
