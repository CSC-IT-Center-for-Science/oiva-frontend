import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getMaarayksetByTunniste } from "../../../../../../../helpers/lupa";
import { values, filter, flatten, includes, find, path } from "ramda";
import { useLomakeSection } from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";

const constants = {
  formLocation: ["opiskelijavuodet"]
};

const MuutospyyntoWizardOpiskelijavuodet = React.memo(
  ({ maaraykset, muut, sectionId }) => {
    const [changeObjects, { setChanges }] = useLomakeSection({
      anchor: "opiskelijavuodet"
    });
    const [muutChangeObjects] = useLomakeSection({
      anchor: "muut"
    });
    const [lomakedata, { setLomakedata }] = useLomakedata({
      anchor: "opiskelijavuodet"
    });
    const opiskelijavuosiMaaraykset = getMaarayksetByTunniste(
      "opiskelijavuodet",
      maaraykset
    );
    const muutMaaraykset = getMaarayksetByTunniste("muut", maaraykset);

    /**
     * Opiskelijavuodet-osio (4) on kytköksissä osioon 5 (Muut oikeudet,
     * velvollisuudet, ehdot ja tehtävät) siten, että osion 5 valinnat
     * vaikuttavat siihen, mitä sisältöä osiossa 4 näytetään.
     *
     * Alla oleva useEffect käsittelee tilannetta, jossa käyttäjä on valinnut
     * jonkin vaativaa tukea koskevan kohdan osiosta 5. Tällöin on
     * tarkistettava, että molempien osioiden koodiarvot ovat samat. Muutoin
     * tallennusvaiheessa backendille lähtee väärä koodiarvo koskien
     * vaativaan tukeen liittyvää opiskelijavuosimäärätietoa.
     */
    useEffect(() => {
      const activeSection5VaativaTukiChangeObj = find(changeObj => {
        return (
          includes("vaativatuki", changeObj.anchor) &&
          changeObj.properties.isChecked
        );
      }, flatten(values(muutChangeObjects)));

      const vaativaTukiKoodiarvoSection5 = activeSection5VaativaTukiChangeObj
        ? path(
            ["properties", "metadata", "koodiarvo"],
            activeSection5VaativaTukiChangeObj
          )
        : null;

      const activeSection4VaativaTukiChangeObj = find(changeObj => {
        return includes("vaativatuki", changeObj.anchor);
      }, changeObjects);

      const vaativaTukiKoodiarvoSection4 = activeSection4VaativaTukiChangeObj
        ? path(
            ["properties", "metadata", "koodiarvo"],
            activeSection4VaativaTukiChangeObj
          )
        : null;

      if (
        activeSection4VaativaTukiChangeObj &&
        vaativaTukiKoodiarvoSection4 !== null &&
        vaativaTukiKoodiarvoSection5 !== null &&
        vaativaTukiKoodiarvoSection4 !== vaativaTukiKoodiarvoSection5
      ) {
        setChanges(
          filter(changeObj => {
            return (
              changeObj.anchor !== activeSection4VaativaTukiChangeObj.anchor
            );
          }, changeObjects),
          sectionId
        );
      }
    }, [muutChangeObjects, changeObjects, sectionId, setChanges]);

    useEffect(() => {
      setLomakedata(
        {
          isSisaoppilaitosValueRequired: false,
          isVaativaTukiValueRequired: false,
          muutChanges: muutChangeObjects,
          sectionId
        },
        sectionId
      );
    }, [muut, muutChangeObjects, sectionId, setLomakedata]);

    return muut && muutMaaraykset && opiskelijavuosiMaaraykset ? (
      <Lomake
        action="modification"
        anchor={sectionId}
        data={lomakedata}
        isRowExpanded={true}
        path={constants.formLocation}
        showCategoryTitles={true}></Lomake>
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
