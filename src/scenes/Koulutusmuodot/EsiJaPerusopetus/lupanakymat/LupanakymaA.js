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
import {
  compose,
  filter,
  find,
  flatten,
  groupBy,
  isEmpty,
  isNil,
  last,
  length,
  map,
  mapObjIndexed,
  nth,
  path,
  pathEq,
  prop,
  propEq,
  reject,
  split,
  startsWith
} from "ramda";
import Rajoitteet from "../lomakeosiot/9-Rajoitteet";
import equal from "react-fast-compare";
import { useLomakedata } from "stores/lomakedata";
import AsianumeroYmsKentat from "../lomakeosiot/0-AsianumeroYmsKentat";

export const getRajoitteetBySection = (sectionId, rajoitteetByRajoiteId) => {
  const rajoitteet = reject(
    isNil,
    mapObjIndexed(rajoite => {
      return pathEq(
        ["changeObjects", 0, "properties", "value", "value"],
        sectionId,
        rajoite
      )
        ? rajoite
        : null;
    }, rajoitteetByRajoiteId)
  );
  return rajoitteet;
};

function filterByTunniste(tunniste, maaraykset = []) {
  return filter(pathEq(["kohde", "tunniste"], tunniste), maaraykset);
}

/**
 * Tämä lupanäkymä sisältää kaikki PO-lomakkeen osiot soveltuen siksi
 * erinomaisesti myös esikatselunäkymäksi.
 * @param {*} param0
 */
const LupanakymaA = React.memo(
  ({
    isPreviewModeOn,
    isRestrictionsModeOn,
    lupakohteet,
    maaraykset,
    valtakunnallinenMaarays
  }) => {
    const intl = useIntl();

    const [rajoitteetStateObj] = useLomakedata({ anchor: "rajoitteet" });

    // TODO: Näytetään rajoitteet oikein, jos on sekä määräyksiä että muutosobjekteja.
    // TODO: Näytetään rajoitteet oikein, jos sama asia on usean rajoitteen kohteena?
    const rajoitteetFromMaarayksetByRajoiteId = map(
      cObjs => {
        return { changeObjects: cObjs };
      },
      groupBy(
        compose(last, split("_"), nth(0), split("."), prop("anchor")),
        filter(
          changeObj => startsWith("rajoitteet_", changeObj.anchor),
          flatten(
            map(cObj => {
                return path(["meta", "changeObjects"], cObj);
              },
              // maaraykset || []
              filter(
                maarays => length(maarays.meta.changeObjects),
                maaraykset || []
              )
            )
          )
        )
      )
    );

    const rajoitteetListausChangeObj = find(
      propEq("anchor", "rajoitteet.listaus.A"),
      rajoitteetStateObj
    );

    const rajoitteetByRajoiteId = path(
      ["properties", "rajoitteet"],
      rajoitteetListausChangeObj
    );

    const opetustehtavamaaraykset = filterByTunniste(
      "opetusjotalupakoskee",
      maaraykset
    );

    const toimintaaaluemaaraykset = filterByTunniste(
      "kunnatjoissaopetustajarjestetaan",
      maaraykset
    );

    const opetuksenJarjestamismuotomaaraykset = filterByTunniste(
      "opetuksenjarjestamismuoto",
      maaraykset
    );

    // Rajoitteet
    // TODO: Toistaiseksi näytetään määräyksiltä saadut rajoitteet, jos niitä on. Muutoin
    // TODO: näytetään muutosobjekteilta saadut rajoitteet. Tämä pitää korjata kun lupamuutoksia
    // TODO: aletaan tekemään esi- ja perusopetukselle.
    const rajoitteet = !isEmpty(rajoitteetFromMaarayksetByRajoiteId)
      ? rajoitteetFromMaarayksetByRajoiteId
      : rajoitteetByRajoiteId;

    const opetustehtavatRajoitteet = getRajoitteetBySection(
      "opetustehtavat",
      rajoitteet
    );

    const opetuskieletRajoitteet = getRajoitteetBySection(
      "opetuskielet",
      rajoitteet
    );

    const opetuksenJarjestamismuodotRajoitteet = getRajoitteetBySection(
      "opetuksenJarjestamismuodot",
      rajoitteet
    );

    const erityisetKoulutustehtavatRajoitteet = getRajoitteetBySection(
      "erityisetKoulutustehtavat",
      rajoitteet
    );

    const toimintaalueRajoitteet = getRajoitteetBySection(
      "toimintaalue",
      rajoitteet
    );

    const opiskelijamaaraRajoitteet = getRajoitteetBySection(
      "opiskelijamaarat",
      rajoitteet
    );

    const muutEhdotRajoitteet = getRajoitteetBySection("muutEhdot", rajoitteet);

    return (
      <div className={`bg-white ${isPreviewModeOn ? "" : ""}`}>
        {isPreviewModeOn ? null : (
          <div className="xxl:w-1/3 px-6 my-12">
            <AsianumeroYmsKentat />
          </div>
        )}

        <Rajoitteet
          isPreviewModeOn={isPreviewModeOn}
          isRestrictionsModeOn={isRestrictionsModeOn}
          sectionId="rajoitteet"
          render={() => {
            return (
              <React.Fragment>
                <Opetustehtavat
                  code="1"
                  isPreviewModeOn={isPreviewModeOn}
                  maaraykset={opetustehtavamaaraykset}
                  sectionId="opetustehtavat"
                  rajoitteet={opetustehtavatRajoitteet}
                />

                <OpetustaAntavatKunnat
                  code="2"
                  isPreviewModeOn={isPreviewModeOn}
                  lupakohde={lupakohteet[2]}
                  maaraykset={toimintaaaluemaaraykset}
                  rajoitteet={toimintaalueRajoitteet}
                  sectionId="toimintaalue"
                  title={intl.formatMessage(education.opetustaAntavatKunnat)}
                  valtakunnallinenMaarays={valtakunnallinenMaarays}
                />

                <Opetuskieli
                  code="3"
                  isPreviewModeOn={isPreviewModeOn}
                  maaraykset={filterByTunniste("opetuskieli", maaraykset)}
                  rajoitteet={opetuskieletRajoitteet}
                  sectionId={"opetuskielet"}
                  title={intl.formatMessage(common.opetuskieli)}
                />

                <OpetuksenJarjestamismuoto
                  code="4"
                  isPreviewModeOn={isPreviewModeOn}
                  maaraykset={opetuksenJarjestamismuotomaaraykset}
                  rajoitteet={opetuksenJarjestamismuodotRajoitteet}
                  sectionId={"opetuksenJarjestamismuodot"}
                  title={intl.formatMessage(
                    education.opetuksenJarjestamismuoto
                  )}
                />

                <ErityisetKoulutustehtavat
                  code="5"
                  isPreviewModeOn={isPreviewModeOn}
                  maaraykset={filterByTunniste(
                    "erityinenkoulutustehtava",
                    maaraykset
                  )}
                  rajoitteet={erityisetKoulutustehtavatRajoitteet}
                  sectionId={"erityisetKoulutustehtavat"}
                  title={intl.formatMessage(
                    common.VSTLupaSectionTitleSchoolMissionSpecial
                  )}
                />

                <Opiskelijamaarat
                  code="6"
                  isPreviewModeOn={isPreviewModeOn}
                  maaraykset={filterByTunniste(
                    "oppilasopiskelijamaara",
                    maaraykset
                  )}
                  rajoitteet={opiskelijamaaraRajoitteet}
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
                  rajoitteet={muutEhdotRajoitteet}
                  sectionId={"muutEhdot"}
                  title={intl.formatMessage(education.muutEhdotTitle)}
                />
              </React.Fragment>
            );
          }}
        />
      </div>
    );
  },
  (cp, np) => {
    return equal(cp, np);
  }
);

LupanakymaA.propTypes = {
  isPreviewModeOn: PropTypes.bool,
  isRestrictionsModeOn: PropTypes.bool,
  lupakohteet: PropTypes.object,
  maaraykset: PropTypes.array,
  OpetustaAntavatKunnatJSX: PropTypes.func,
  valtakunnallinenMaarays: PropTypes.object
};

export default LupanakymaA;
