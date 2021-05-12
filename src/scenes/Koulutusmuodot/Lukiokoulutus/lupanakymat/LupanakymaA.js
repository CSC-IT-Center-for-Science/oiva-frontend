import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import common from "i18n/definitions/common";
import education from "i18n/definitions/education";
import OpetustaAntavatKunnat from "../lomakeosiot/1-OpetustaAntavatKunnat";
import Opetuskieli from "../lomakeosiot/2-Opetuskieli";
import OikeusSisaoppilaitosmuotoiseenKoulutukseen from "../lomakeosiot/3-OikeusSisaoppilaitosmuotoiseenKoulutukseen";
import ErityisetKoulutustehtavat from "../lomakeosiot/4-ErityisetKoulutustehtavat";
import ValtakunnallisetKehittamistehtavat from "../lomakeosiot/5-ValtakunnallisetKehittamistehtavat";
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
  prop,
  propEq,
  reject
} from "ramda";
import equal from "react-fast-compare";
import { useLomakedata } from "stores/lomakedata";
import AsianumeroYmsKentat from "../lomakeosiot/0-AsianumeroYmsKentat";
import Rajoitteet from "components/02-organisms/Rajoitteet/index";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "../../../../stores/muutokset";

// Kohdevaihtoehtoja käytetään rajoitteita tehtäessä.
// Kohteet vaihtelevat koulutusmuodoittain.
const rajoitteidenKohdevaihtoehdot = [
  {
    label: "Kunnat, joissa opetusta järjestetään",
    value: "toimintaalue"
  },
  { label: "Opetuskieli", value: "opetuskielet" },
  {
    label: "Oikeus sisäoppilaitosmuotoiseen koulutukseen",
    value: "oikeusSisaoppilaitosmuotoiseenKoulutukseen"
  },
  {
    label: "Erityinen koulutustehtävä",
    value: "erityisetKoulutustehtavat"
  },
  {
    label: "Valtakunnalliset kehittämistehtävät",
    value: "valtakunnallisetKehittamistehtavat"
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

    const rajoitteetListausChangeObj = find(
      propEq("anchor", "rajoitteet.listaus.A"),
      rajoitteetStateObj
    );

    const rajoiteChangeObjsByRajoiteId = path(
      ["properties", "rajoitteet"],
      rajoitteetListausChangeObj
    );

    const toimintaaaluemaaraykset = filterByTunniste(
      "kunnatjoissaopetustajarjestetaan",
      maarayksetRajoitepoistotFiltered
    );

    const oikeusSisaoppilaitosmuotoiseenKoulutukseenMaaraykset = filterByTunniste(
      "sisaoppilaitosmuotoinenkoulutus",
      maarayksetRajoitepoistotFiltered
    );

    // Rajoitteet
    const opetuskieletRajoitteet = getRajoitteetBySection(
      "opetuskielet",
      rajoiteChangeObjsByRajoiteId
    );

    const oikeusSisaoppilaitosmuotoiseenKoulutukseenRajoitteet = getRajoitteetBySection(
      "oikeusSisaoppilaitosmuotoiseenKoulutukseen",
      rajoiteChangeObjsByRajoiteId
    );

    const erityisetKoulutustehtavatRajoitteet = getRajoitteetBySection(
      "erityisetKoulutustehtavat",
      rajoiteChangeObjsByRajoiteId
    );

    const valtakunnallisetKehittamistehtavatRajoitteet = getRajoitteetBySection(
      "valtakunnallisetKehittamistehtavat",
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

    const erityisetKoulutustehtavatMaaraykset = map(maarays => {
      /** Suodatetaan pois alimääräykset (rajoitteet), jotka koskevat valtakunnallisia kehittämistehtäviä
       * koska erityinenkoulutustehtava tunnisteen alla on sekä valtakunnallisten kehittämistehtävisen rajoitteet, että
       * erityisien koulutustehtävien rajoitteet */
      const alimaaraykset = filter(
        alimaarays =>
          !path(["meta", "valtakunnallinenKehittamistehtava"], alimaarays),
        prop("aliMaaraykset", maarays) || []
      );
      return assoc("aliMaaraykset", alimaaraykset, maarays);
    }, filterByTunniste("erityinenkoulutustehtava", maarayksetRajoitepoistotFiltered));

    const valtakunnallisetKehittamistehtavatMaaraykset = map(maarays => {
      /** Suodatetaan pois alimääräykset (rajoitteet), jotka koskevat erityisiä koulutustehtäviä */
      const alimaaraykset = filter(
        alimaarays =>
          path(["meta", "valtakunnallinenKehittamistehtava"], alimaarays),
        prop("aliMaaraykset", maarays) || []
      );
      return assoc("aliMaaraykset", alimaaraykset, maarays);
    }, filterByTunniste("erityinenkoulutustehtava", maarayksetRajoitepoistotFiltered));

    return (
      <div className={`bg-white ${isPreviewModeOn ? "" : ""}`}>
        {isPreviewModeOn ? null : (
          <div className="md:w-1/2 xxl:w-1/3 px-6 my-12">
            <AsianumeroYmsKentat />
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
                <div className="pt-8">
                  <OpetustaAntavatKunnat
                    code="1"
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
                    code="2"
                    isPreviewModeOn={isPreviewModeOn}
                    maaraykset={filterByTunniste(
                      "opetuskieli",
                      maarayksetRajoitepoistotFiltered
                    )}
                    rajoitteet={opetuskieletRajoitteet}
                    sectionId={"opetuskielet"}
                    title={intl.formatMessage(common.opetuskieli)}
                  />
                </div>

                <div className="pt-8">
                  <OikeusSisaoppilaitosmuotoiseenKoulutukseen
                    code="3"
                    isPreviewModeOn={isPreviewModeOn}
                    maaraykset={
                      oikeusSisaoppilaitosmuotoiseenKoulutukseenMaaraykset
                    }
                    rajoitteet={
                      oikeusSisaoppilaitosmuotoiseenKoulutukseenRajoitteet
                    }
                    sectionId={"oikeusSisaoppilaitosmuotoiseenKoulutukseen"}
                    title={intl.formatMessage(
                      education.oikeusSisaoppilaitosmuotoiseenKoulutukseen
                    )}
                  />
                </div>

                <div className="pt-8">
                  <ErityisetKoulutustehtavat
                    code="4"
                    isPreviewModeOn={isPreviewModeOn}
                    maaraykset={erityisetKoulutustehtavatMaaraykset}
                    rajoitteet={erityisetKoulutustehtavatRajoitteet}
                    sectionId={"erityisetKoulutustehtavat"}
                    title={intl.formatMessage(
                      common.VSTLupaSectionTitleSchoolMissionSpecial
                    )}
                  />
                </div>

                <div className="pt-8">
                  <ValtakunnallisetKehittamistehtavat
                    code="5"
                    isPreviewModeOn={isPreviewModeOn}
                    maaraykset={valtakunnallisetKehittamistehtavatMaaraykset}
                    rajoitteet={valtakunnallisetKehittamistehtavatRajoitteet}
                    sectionId={"valtakunnallisetKehittamistehtavat"}
                    title={intl.formatMessage(
                      education.valtakunnallinenKehittamistehtava
                    )}
                  />
                </div>

                <div className="pt-8">
                  <Opiskelijamaarat
                    code="6"
                    isPreviewModeOn={isPreviewModeOn}
                    maaraykset={filterByTunniste(
                      "opiskelijamaarat",
                      maarayksetRajoitepoistotFiltered
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
                      maarayksetRajoitepoistotFiltered
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
  koulutustyyppi: PropTypes.string,
  lupakohteet: PropTypes.object,
  maaraykset: PropTypes.array,
  OpetustaAntavatKunnatJSX: PropTypes.func,
  rajoitemaaraykset: PropTypes.array,
  valtakunnallinenMaarays: PropTypes.object
};

export default LupanakymaA;
