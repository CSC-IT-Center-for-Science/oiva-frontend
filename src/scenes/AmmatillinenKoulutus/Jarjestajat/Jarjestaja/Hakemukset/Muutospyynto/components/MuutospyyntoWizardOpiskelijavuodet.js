import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getMaarayksetByTunniste } from "../../../../../../../helpers/lupa";
import {
  difference,
  filter,
  find,
  includes,
  length,
  path,
  propEq
} from "ramda";
import {
  useChangeObjectsByAnchor,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";

const constants = {
  formLocation: ["opiskelijavuodet"]
};

/**
 * Mikäli jokin näistä koodeista on valittuna osion 5 (Muut) kohdassa 02
 * (vaativa tuki), näytetään vaativaa tukea koskevat kentät tässä osiossa
 * (Opiskelijavuodet).
 **/
export const vaativatCodes = ["2", "16", "17", "18", "19", "20", "21"];

/**
 * Mikäli jokin näistä koodeista on valittuna osion 5 (Muut) kohdassa 03
 * (sisäoppilaitos), näytetään sisäoppilaitosta koskevat kentät tässä osiossa
 * (Opiskelijavuodet).
 **/
export const sisaoppilaitosCodes = ["4"];

const MuutospyyntoWizardOpiskelijavuodet = React.memo(
  ({ maaraykset, muut, sectionId }) => {
    const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: "opiskelijavuodet"
    });
    const [muutChangeObjects] = useChangeObjectsByAnchor({
      anchor: "muut"
    });
    const [lomakedata] = useLomakedata({
      anchor: sectionId
    });
    const [muutLomakedata, { setLomakedata }] = useLomakedata({
      anchor: "muut"
    });
    const opiskelijavuosiMaaraykset = getMaarayksetByTunniste(
      "opiskelijavuodet",
      maaraykset
    );
    const muutMaaraykset = getMaarayksetByTunniste("muut", maaraykset);

    const vahimmaisopiskelijavuodetMaarays = find(
      propEq("koodisto", "koulutussektori"),
      maaraykset
    );

    /**
     * Muodostetaan data, jonka perusteella lomake voidaan luoda
     * lomakepalvelussa. Koska opiskelijavuosiosion sisältö riippuu Muut-osion
     * sisällöstä, on tarpeen reagoida Muut-osiossa tehtyihin muutoksiin.
     */
    useEffect(() => {
      // Mikäli Muut-osion lomakkeelta 02 (vaativa tuki) on valittu jokin
      // listatuista koodiarvoista, on vaativaa tukea koskeva tietue näytettävä
      // opiskelijavuosiosiossa.
      const visibilityOfVaativaTuki =
        length(
          difference(
            vaativatCodes,
            path(["02", "valitutKoodiarvot"], muutLomakedata) || []
          )
        ) < length(vaativatCodes);

      // Mikäli Muut-osion lomakkeelta 03 (sisäoppilaitos) on valittu mitä
      // tahansa, on sisäoppilaitosta koskeva tietue näytettävä
      // opiskelijavuosiosiossa.
      const visibilityOfSisaoppilaitos =
        length(
          difference(
            sisaoppilaitosCodes,
            path(["03", "valitutKoodiarvot"], muutLomakedata) || []
          )
        ) < length(sisaoppilaitosCodes);

      setLomakedata(
        {
          sisaoppilaitos: visibilityOfSisaoppilaitos,
          vaativaTuki: visibilityOfVaativaTuki
        },
        `${sectionId}_visibility`
      );
    }, [muutLomakedata, sectionId, setLomakedata]);

    /**
     * Tässä reagoidaan opiskelijavuosiosion muutoksiin ja tarkastellaan sitä,
     * onko sisäoppilaitosta ja vaativaa tukea koskevat kentät täytetty.
     * Tieto asetetaan jaettuun tilaan, josta sitä tarvitseva osio voi sen
     * lukea.
     */
    useEffect(() => {
      const vahimmaisopiskelijavuodetChangeObj = find(
        propEq("anchor", `${sectionId}.vahimmaisopiskelijavuodet.A`),
        changeObjects
      );
      if (!!vahimmaisopiskelijavuodetChangeObj) {
        setLomakedata(
          vahimmaisopiskelijavuodetChangeObj.properties.isValueSet,
          `${sectionId}_vahimmaisopiskelijavuodet_isApplyForValueSet`
        );
      }
      const sisaoppilaitosChangeObj = find(
        propEq("anchor", `${sectionId}.sisaoppilaitos.A`),
        changeObjects
      );
      if (!!sisaoppilaitosChangeObj) {
        setLomakedata(
          sisaoppilaitosChangeObj.properties.isValueSet,
          `${sectionId}_sisaoppilaitos_isApplyForValueSet`
        );
      }
      const vaativaTukiChangeObj = find(
        propEq("anchor", `${sectionId}.vaativatuki.A`),
        changeObjects
      );
      if (!!vaativaTukiChangeObj) {
        setLomakedata(
          vaativaTukiChangeObj.properties.isValueSet,
          `${sectionId}_vaativaTuki_isApplyForValueSet`
        );
      }
    }, [changeObjects, sectionId, setLomakedata]);

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
    // useEffect(() => {
    //   const activeSection5VaativaTukiChangeObj = find(changeObj => {
    //     return (
    //       includes("vaativatuki", changeObj.anchor) &&
    //       changeObj.properties.isChecked
    //     );
    //   }, flatten(values(head(muutChangeObjects))));

    //   const vaativaTukiKoodiarvoSection5 = activeSection5VaativaTukiChangeObj
    //     ? path(
    //         ["properties", "metadata", "koodiarvo"],
    //         activeSection5VaativaTukiChangeObj
    //       )
    //     : null;

    //   const activeSection4VaativaTukiChangeObj = find(changeObj => {
    //     return includes("vaativatuki", changeObj.anchor);
    //   }, changeObjects);

    //   const vaativaTukiKoodiarvoSection4 = activeSection4VaativaTukiChangeObj
    //     ? path(
    //         ["properties", "metadata", "koodiarvo"],
    //         activeSection4VaativaTukiChangeObj
    //       )
    //     : null;

    //   if (
    //     activeSection4VaativaTukiChangeObj &&
    //     vaativaTukiKoodiarvoSection4 !== null &&
    //     vaativaTukiKoodiarvoSection5 !== null &&
    //     vaativaTukiKoodiarvoSection4 !== vaativaTukiKoodiarvoSection5
    //   ) {
    //     setChanges(
    //       filter(changeObj => {
    //         return (
    //           changeObj.anchor !== activeSection4VaativaTukiChangeObj.anchor
    //         );
    //       }, changeObjects),
    //       sectionId
    //     );
    //   }
    // }, [muutChangeObjects, changeObjects, sectionId, setChanges]);

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
