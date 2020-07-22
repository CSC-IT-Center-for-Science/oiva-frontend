import React, { useEffect, useState } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import common from "../../../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import Lomake from "../../../../../../components/02-organisms/Lomake";
import { useChangeObjects } from "../../../../../../stores/changeObjects";
import { useIntl } from "react-intl";
import { getMaarayksetByTunniste } from "../../../../../../helpers/lupa";
import { getMuutFromStorage } from "../../../../../../helpers/muut";
import { values, filter, flatten, includes, find, path } from "ramda";

const MuutospyyntoWizardOpiskelijavuodet = React.memo(
  ({ onChangesRemove, onChangesUpdate, sectionId }) => {
    const intl = useIntl();
    const [maaraykset, setMaaraykset] = useState();
    const [muut, setMuut] = useState();
    const [muutMaaraykset, setMuutMaaraykset] = useState();
    const [changeObjects] = useChangeObjects();

    useEffect(() => {
      (async () => {
        setMuut(await getMuutFromStorage());
        setMaaraykset(await getMaarayksetByTunniste("opiskelijavuodet"));
        setMuutMaaraykset(await getMaarayksetByTunniste("muut"));
      })();
    }, []);

    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    };

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
      }, flatten(values(changeObjects.muut)));

      const vaativaTukiKoodiarvoSection5 = activeSection5VaativaTukiChangeObj
        ? path(
            ["properties", "metadata", "koodiarvo"],
            activeSection5VaativaTukiChangeObj
          )
        : null;

      const activeSection4VaativaTukiChangeObj = find(changeObj => {
        return includes("vaativatuki", changeObj.anchor);
      }, changeObjects.opiskelijavuodet);

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
        onChangesUpdate({
          anchor: sectionId,
          changes: filter(changeObj => {
            return (
              changeObj.anchor !== activeSection4VaativaTukiChangeObj.anchor
            );
          }, changeObjects.opiskelijavuodet || [])
        });
      }
    }, [
      changeObjects.muut,
      changeObjects.opiskelijavuodet,
      onChangesUpdate,
      sectionId
    ]);

    return muut && muutMaaraykset ? (
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        categories={[]}
        changes={changeObjects.opiskelijavuodet}
        hideAmountOfChanges={true}
        messages={changesMessages}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        sectionId={sectionId}
        showCategoryTitles={true}
        isExpanded={true}>
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={changeObjects.opiskelijavuodet}
          data={{
            isSisaoppilaitosValueRequired: false,
            isVaativaTukiValueRequired: false,
            maaraykset,
            muut,
            muutChanges: changeObjects.muut,
            muutMaaraykset,
            sectionId: sectionId
          }}
          onChangesUpdate={onChangesUpdate}
          path={["opiskelijavuodet"]}
          rules={[]}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
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
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  sectionId: PropTypes.string
};

export default MuutospyyntoWizardOpiskelijavuodet;
