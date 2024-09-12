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
  assoc,
  filter,
  find,
  includes,
  isNil,
  map,
  mapObjIndexed,
  path,
  pathEq,
  propEq,
  reject
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

    const rajoitepoistoIds = map(
      rajoitepoisto => path(["properties", "rajoiteId"], rajoitepoisto),
      rajoitepoistot
    );

    const maarayksetRajoitepoistotFiltered = map(maarays => {
      /** Opiskelijamäärärajoitteen poisto poistaa koko määräyksen */
      if (
        maarays.koodisto === "kujalisamaareet" &&
        path(["maaraystyyppi", "tunniste"], maarays) === "RAJOITE" &&
        includes(path(["meta", "rajoiteId"], maarays), rajoitepoistoIds)
      ) {
        return null;
      }

      /** Muissa tapauksissa poistetaan vain alimääräykset */
      const alimaaraykset = filter(
        alimaarays =>
          !includes(path(["meta", "rajoiteId"], alimaarays), rajoitepoistoIds),
        maarays.aliMaaraykset || []
      );
      return assoc("aliMaaraykset", alimaaraykset, maarays);
    }, maaraykset || []).filter(Boolean);

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

    const rajoitteetListausChangeObj = find(
      propEq("anchor", "rajoitteet.listaus.A"),
      rajoitteetStateObj
    );

    const rajoiteChangeObjsByRajoiteId = path(
      ["properties", "rajoitteet"],
      rajoitteetListausChangeObj
    );

    const opetustehtavamaaraykset = filterByTunniste(
      "opetusjotalupakoskee",
      maarayksetRajoitepoistotFiltered
    );

    const toimintaaaluemaaraykset = filterByTunniste(
      "kunnatjoissaopetustajarjestetaan",
      maarayksetRajoitepoistotFiltered
    );

    const opetuksenJarjestamismuotomaaraykset = filterByTunniste(
      "opetuksenjarjestamismuoto",
      maarayksetRajoitepoistotFiltered
    );

    const opetustehtavatRajoitteet = getRajoitteetBySection(
      "opetustehtavat",
      rajoiteChangeObjsByRajoiteId
    );

    const opetuskieletRajoitteet = getRajoitteetBySection(
      "opetuskielet",
      rajoiteChangeObjsByRajoiteId
    );

    const opetuksenJarjestamismuodotRajoitteet = getRajoitteetBySection(
      "opetuksenJarjestamismuodot",
      rajoiteChangeObjsByRajoiteId
    );

    const erityisetKoulutustehtavatRajoitteet = getRajoitteetBySection(
      "erityisetKoulutustehtavat",
      rajoiteChangeObjsByRajoiteId
    );

    const toimintaalueRajoitteet = getRajoitteetBySection(
      "toimintaalue",
      rajoiteChangeObjsByRajoiteId
    );

    const opiskelijamaaraRajoitteet = getRajoitteetBySection(
      "opiskelijamaarat",
      rajoiteChangeObjsByRajoiteId
    );

    const muutEhdotRajoitteet = getRajoitteetBySection(
      "muutEhdot",
      rajoiteChangeObjsByRajoiteId
    );

    const asianumeroYmsClasses = isPreviewModeOn
      ? "md:w-1/2 xxl:w-1/3 pr-6 mb-6 mt-3"
      : "md:w-1/2 xxl:w-1/3 my-12";

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
                  maaraykset={filterByTunniste(
                    "opetuskieli",
                    maarayksetRajoitepoistotFiltered
                  )}
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
                    maarayksetRajoitepoistotFiltered
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
                    maarayksetRajoitepoistotFiltered
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
                    maarayksetRajoitepoistotFiltered
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
  koulutustyyppi: PropTypes.string,
  lupakohteet: PropTypes.object,
  maaraykset: PropTypes.array,
  OpetustaAntavatKunnatJSX: PropTypes.func,
  rajoitemaaraykset: PropTypes.array,
  valtakunnallinenMaarays: PropTypes.object
};

export default LupanakymaA;
