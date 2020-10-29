import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getMaarayksetByTunniste } from "../../../../../../../helpers/lupa";
import {
  filter,
  includes,
  find,
  path,
  head,
  values,
  flatten,
  propEq
} from "ramda";
import { useChangeObjectsByAnchor } from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";

const constants = {
  formLocation: ["opiskelijavuodet"]
};

const MuutospyyntoWizardOpiskelijavuodet = React.memo(
  ({ maaraykset, muut, sectionId }) => {
    const [changeObjects, { setChanges }] = useChangeObjectsByAnchor({
      anchor: "opiskelijavuodet"
    });
    const [muutChangeObjects] = useChangeObjectsByAnchor({
      anchor: "muut"
    });
    const [, { setLomakedata }] = useLomakedata({ anchor: sectionId });
    const opiskelijavuosiMaaraykset = getMaarayksetByTunniste(
      "opiskelijavuodet",
      maaraykset
    );
    const muutMaaraykset = getMaarayksetByTunniste("muut", maaraykset);

    const vahimmaisopiskelijavuodetMaarays = find(
      propEq("koodisto", "koulutussektori"),
      maaraykset
    );

    useEffect(() => {
// 1. unsaved, 2. saved, jos ei poistettavana

      // console.info(vahimmaisopiskelijavuodetInput);
      // const applyForValue = vahimmaisopiskelijavuodetMaarays
      //   ? parseInt(vahimmaisopiskelijavuodetMaarays.arvo, 10)
      //   : null;

      // let value = changeObjects.unsaved.length ?

      // console.info(
      //   applyForValue,
      //   vahimmaisopiskelijavuodetMaarays,
      //   maaraykset,
      //   changeObjects.unsaved
      // );
      // const aktiivisetTutkinnot = getAktiivisetTutkinnot(
      //   tutkinnot,
      //   changeObjects
      // );
      // setLomakedata(aktiivisetTutkinnot, `${sectionId}_sisaoppilaitos`);
    }, [changeObjects, setLomakedata]);

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
      }, flatten(values(head(muutChangeObjects))));

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

    const lomakedata = useMemo(() => {
      return {
        isSisaoppilaitosValueRequired: false,
        isVaativaTukiValueRequired: false,
        muutChanges: muutChangeObjects,
        sectionId
      };
    }, [muutChangeObjects, sectionId]);

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
