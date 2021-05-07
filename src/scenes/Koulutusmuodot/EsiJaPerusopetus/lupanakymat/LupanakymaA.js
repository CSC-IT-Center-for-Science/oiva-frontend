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
  includes,
  isNil,
  keys,
  last,
  length,
  map,
  mapObjIndexed,
  mergeAll,
  nth,
  path,
  pathEq,
  prop,
  propEq,
  reject,
  split,
  startsWith
} from "ramda";
import equal from "react-fast-compare";
import { useLomakedata } from "stores/lomakedata";
import AsianumeroYmsKentat from "../lomakeosiot/0-AsianumeroYmsKentat";
import Rajoitteet from "components/02-organisms/Rajoitteet/index";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

// Kohdevaihtoehtoja käytetään rajoitteita tehtäessä.
// Kohteet vaihtelevat koulutusmuodoittain.
const rajoitteidenKohdevaihtoehdot = [
  {
    label: "Opetus, jota lupa koskee",
    value: "opetustehtavat"
  },
  {
    label: "Kunnat, joissa opetusta järjestetään",
    value: "toimintaalue"
  },
  { label: "Opetuskieli", value: "opetuskielet" },
  {
    label: "Opetuksen järjestämismuodot",
    value: "opetuksenJarjestamismuodot"
  },
  {
    label: "Erityinen koulutustehtävä",
    value: "erityisetKoulutustehtavat"
  },
  {
    label: "Opiskelijamäärät",
    value: "opiskelijamaarat"
  },
  {
    label: "Muut koulutuksen järjestämiseen liittyvät ehdot",
    value: "muutEhdot"
  },
  {
    label: "Oppilaitokset",
    value: "oppilaitokset"
  }
];

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
    koulutustyyppi,
    lupakohteet,
    maaraykset,
    valtakunnallinenMaarays,
    rajoitemaaraykset
  }) => {
    const intl = useIntl();

    const [rajoitepoistot] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: "rajoitepoistot"
    });

    const [rajoitteetStateObj] = useLomakedata({ anchor: "rajoitteet" });

    const paattymispvm = path(
      ["properties", "value"],
      find(
        cObj => cObj.anchor === "paatoksentiedot.paattymispaivamaara.A",
        path(
          ["0"],
          useChangeObjectsByAnchorWithoutUnderRemoval({
            anchor: "paatoksentiedot"
          })
        ) || []
      )
    );

    // TODO: Näytetään rajoitemääräykset siten että ei käytetä parent-määräyksen sisällä olevia changeObjekteja.
    // TODO: Käytetään niiden sijaan rajoitemääräyksiä
    const rajoitteetFromMaarayksetByRajoiteId = map(
      cObjs => {
        return { changeObjects: cObjs };
      },
      groupBy(
        compose(last, split("_"), nth(0), split("."), prop("anchor")),
        filter(
          changeObj => startsWith("rajoitteet_", changeObj.anchor),
          flatten(
            map(
              cObj => {
                return path(["meta", "changeObjects"], cObj);
              },
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
    const rajoitepoistoIds = map(
      rajoitepoisto => path(["properties", "rajoiteId"], rajoitepoisto),
      rajoitepoistot
    );

    // Ei oteta mukaan poistettuja rajoitemääräyksiä
    const rajoiteMaarayksetPoistotFiltered = mergeAll(
      map(key => {
        return includes(key, rajoitepoistoIds)
          ? null
          : { [key]: rajoitteetFromMaarayksetByRajoiteId[key] };
      }, keys(rajoitteetFromMaarayksetByRajoiteId)).filter(Boolean)
    );

    const rajoitteet = Object.assign(
      {},
      rajoiteMaarayksetPoistotFiltered,
      rajoitteetByRajoiteId
    );

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

    const asianumeroYmsClasses = isPreviewModeOn
      ? "md:w-1/2 xxl:w-1/3 pr-6 mb-6 mt-3"
      : "md:w-1/2 xxl:w-1/3 px-6 my-12";

    return (
      <div className={`bg-white ${isPreviewModeOn ? "" : ""}`}>
        {!(isPreviewModeOn && !paattymispvm) && (
          <div className={asianumeroYmsClasses}>
            <AsianumeroYmsKentat isPreviewModeOn={isPreviewModeOn} />
          </div>
        )}

        <Rajoitteet
          maaraykset={filter(
            maarays =>
              maarays.aliMaaraykset ||
              (maarays.koodisto === "kujalisamaareet" &&
                path(["maaraystyyppi", "tunniste"], maarays) === "RAJOITE"),
            maaraykset || []
          )}
          rajoitemaaraykset={rajoitemaaraykset}
          isPreviewModeOn={isPreviewModeOn}
          isRestrictionsModeOn={isRestrictionsModeOn}
          kohdevaihtoehdot={rajoitteidenKohdevaihtoehdot}
          koulutustyyppi={koulutustyyppi}
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

                <div className="pt-8">
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
                </div>
                <div className="pt-8">
                  <Opetuskieli
                    code="3"
                    isPreviewModeOn={isPreviewModeOn}
                    maaraykset={filterByTunniste("opetuskieli", maaraykset)}
                    rajoitteet={opetuskieletRajoitteet}
                    sectionId={"opetuskielet"}
                    title={intl.formatMessage(common.opetuskieli)}
                  />
                </div>
                <div className="pt-8">
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
                </div>
                <div className="pt-8">
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
                </div>
                <div className="pt-8">
                  <Opiskelijamaarat
                    code="6"
                    isPreviewModeOn={isPreviewModeOn}
                    maaraykset={filterByTunniste(
                      "oppilasopiskelijamaara",
                      maaraykset
                    )}
                    rajoitteet={opiskelijamaaraRajoitteet}
                    sectionId={"opiskelijamaarat"}
                    title={intl.formatMessage(
                      education.oppilasOpiskelijamaarat
                    )}
                  />
                </div>
                <div className="pt-8">
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
                </div>
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
  koulutustyyppi: PropTypes.object,
  lupakohteet: PropTypes.object,
  maaraykset: PropTypes.array,
  OpetustaAntavatKunnatJSX: PropTypes.func,
  rajoitemaaraykset: PropTypes.array,
  valtakunnallinenMaarays: PropTypes.object
};

export default LupanakymaA;
