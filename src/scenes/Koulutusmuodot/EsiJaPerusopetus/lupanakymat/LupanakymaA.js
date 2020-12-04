import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
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
import { filter, pathEq } from "ramda";

const constants = {
  formLocations: {
    paatoksenTiedot: ["esiJaPerusopetus", "paatoksenTiedot"]
  }
};

function filterByTunniste(tunniste, maaraykset = []) {
  return filter(pathEq(["kohde", "tunniste"], tunniste), maaraykset);
}

/**
 * Tämä lupanäkymä sisältää kaikki PO-lomakkeen osiot soveltuen siksi
 * erinomaisesti myös esikatselunäkymäksi.
 * @param {*} param0
 */
const LupanakymaA = ({
  isPreviewModeOn,
  kohteet,
  lupakohteet,
  maaraykset,
  valtakunnallinenMaarays
}) => {
  const intl = useIntl();
  console.info(lupakohteet, kohteet);
  return (
    <div
      className={`p-6 bg-white ${
        isPreviewModeOn ? "border border-gray-300" : ""
      }`}>
      {isPreviewModeOn ? null : (
        <div className="xxl:w-1/3 px-4 mb-12">
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
        maaraykset={filterByTunniste("opetusjotalupakoskee", maaraykset)}
        sectionId="opetustehtavat"
      />

      <OpetustaAntavatKunnat
        code="2"
        isPreviewModeOn={isPreviewModeOn}
        lupakohde={lupakohteet[2]}
        maaraykset={filterByTunniste(
          "kunnatjoissaopetustajarjestetaan",
          maaraykset
        )}
        sectionId="toimintaalue"
        title={intl.formatMessage(education.opetustaAntavatKunnat)}
        valtakunnallinenMaarays={valtakunnallinenMaarays}
      />

      <Opetuskieli
        code="3"
        isPreviewModeOn={isPreviewModeOn}
        maaraykset={filterByTunniste("opetuskieli", maaraykset)}
        sectionId={"opetuskielet"}
        title={intl.formatMessage(common.opetuskieli)}
      />

      <OpetuksenJarjestamismuoto
        code="4"
        isPreviewModeOn={isPreviewModeOn}
        maaraykset={filterByTunniste("opetuksenjarjestamismuoto", maaraykset)}
        sectionId={"opetuksenJarjestamismuodot"}
        title={intl.formatMessage(education.opetuksenJarjestamismuoto)}
      />

      <ErityisetKoulutustehtavat
        code="5"
        isPreviewModeOn={isPreviewModeOn}
        maaraykset={filterByTunniste("erityinenkoulutustehtava", maaraykset)}
        sectionId={"erityisetKoulutustehtavat"}
        title={intl.formatMessage(
          common.VSTLupaSectionTitleSchoolMissionSpecial
        )}
      />

      <Opiskelijamaarat
        code="6"
        isPreviewModeOn={isPreviewModeOn}
        maaraykset={filterByTunniste("oppilasopiskelijamaara", maaraykset)}
        sectionId={"opiskelijamaarat"}
        title={intl.formatMessage(education.oppilasOpiskelijamaarat)}
      />

      <MuutEhdot
        code="7"
        isPreviewModeOn={isPreviewModeOn}
        maaraykset={filterByTunniste(
          "muutkoulutuksenjarjestamiseenliittyvatehdot",
          maaraykset
        )}
        sectionId={"muutEhdot"}
        title={intl.formatMessage(education.muutEhdotTitle)}
      />

      {/* {!isPreviewModeOn ? (
        <FormSection
          render={props => <Rajoitteet {...props} />}
          sectionId="rajoitteet"
          title={"Lupaan kohdistuvat rajoitteet"}></FormSection>
      ) : null} */}
    </div>
  );
};

LupanakymaA.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  kohteet: PropTypes.array,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default LupanakymaA;
