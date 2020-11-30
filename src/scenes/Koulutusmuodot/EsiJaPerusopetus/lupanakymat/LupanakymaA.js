import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { toUpper } from "ramda";
import common from "i18n/definitions/common";
import education from "i18n/definitions/education";
import Opetustehtavat from "../lomakeosiot/1-Opetustehtavat";
import OpetustaAntavatKunnat from "../lomakeosiot/2-OpetustaAntavatKunnat";
import Opetuskieli from "../lomakeosiot/3-Opetuskieli";
import OpetuksenJarjestamismuoto from "../lomakeosiot/4-OpetuksenJarjestamismuoto";
import ErityisetKoulutustehtavat from "../lomakeosiot/5-ErityisetKoulutustehtavat";
import Opiskelijamaarat from "../lomakeosiot/6-Opiskelijamaarat";
import MuutEhdot from "../lomakeosiot/7-MuutEhdot";
import Lomake from "components/02-organisms/Lomake";

const constants = {
  formLocations: {
    paatoksenTiedot: ["esiJaPerusopetus", "paatoksenTiedot"]
  }
};

/**
 * Tämä lupanäkymä sisältää kaikki PO-lomakkeen osiot soveltuen siksi
 * erinomaisesti myös esikatselunäkymäksi.
 * @param {*} param0
 */
const LupanakymaA = ({
  isPreviewModeOn,
  kunnat,
  lisatiedot,
  lupakohteet,
  maakunnat,
  maakuntakunnat,
  opetustehtavakoodisto,
  uuid,
  valtakunnallinenMaarays
}) => {
  const intl = useIntl();
  return (
    <div className="p-12">
      {isPreviewModeOn ? null : (
        <div className="xxl:w-1/3 p-6 bg-gray-100 mb-12">
          <Lomake
            anchor="paatoksentiedot"
            isInExpandableRow={false}
            isPreviewModeOn={isPreviewModeOn}
            noPadding={true}
            path={constants.formLocations.paatoksenTiedot}></Lomake>
        </div>
      )}

      <Opetustehtavat
        code="1"
        isPreviewModeOn={isPreviewModeOn}
        opetustehtavakoodisto={opetustehtavakoodisto}
        sectionId="opetustehtavat"
        title={opetustehtavakoodisto.metadata[toUpper(intl.locale)].kuvaus}
      />

      <OpetustaAntavatKunnat
        code="2"
        isPreviewModeOn={isPreviewModeOn}
        kunnat={kunnat}
        lisatiedot={lisatiedot}
        lupakohde={lupakohteet[3]}
        maakunnat={maakunnat}
        maakuntakunnat={maakuntakunnat}
        sectionId="toimintaalue"
        title={intl.formatMessage(education.opetustaAntavatKunnat)}
        valtakunnallinenMaarays={valtakunnallinenMaarays}
      />

      <Opetuskieli
        code="3"
        isPreviewModeOn={isPreviewModeOn}
        sectionId={"opetuskielet"}
        title={intl.formatMessage(common.opetuskieli)}
      />

      <OpetuksenJarjestamismuoto
        code="4"
        isPreviewModeOn={isPreviewModeOn}
        sectionId={"opetuksenJarjestamismuodot"}
        title={intl.formatMessage(education.opetuksenJarjestamismuoto)}
      />

      <ErityisetKoulutustehtavat
        code="5"
        isPreviewModeOn={isPreviewModeOn}
        sectionId={"erityisetKoulutustehtavat"}
        title={intl.formatMessage(
          common.VSTLupaSectionTitleSchoolMissionSpecial
        )}
      />

      <Opiskelijamaarat
        code="6"
        isPreviewModeOn={isPreviewModeOn}
        sectionId={"opiskelijamaarat"}
        title={intl.formatMessage(education.oppilasOpiskelijamaarat)}
      />

      <MuutEhdot
        code="7"
        isPreviewModeOn={isPreviewModeOn}
        sectionId={"muutEhdot"}
        title={intl.formatMessage(education.muutEhdotTitle)}
      />
    </div>
  );
};

LupanakymaA.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  mode: PropTypes.string,
  opetustehtavakoodisto: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default LupanakymaA;
