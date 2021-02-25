import React from "react";
import { useIntl } from "react-intl";
import { NavLink, Route, Router, useHistory } from "react-router-dom";
import common from "../../../i18n/definitions/common";
import education from "../../../i18n/definitions/education";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Typography } from "@material-ui/core";
import { AppRoute } from "const/index";
import { LocalizedSwitch } from "modules/i18n/index";
import Asiat from "../Asiat/index";
import { localizeRouteKey } from "utils/common";
import BaseData from "basedata";
import { MuutoksetContainer } from "stores/muutokset";
import { ROLE_ESITTELIJA } from "modules/constants";
import esiJaPerusopetus from "i18n/definitions/esiJaPerusopetus";
import lukiokoulutus from "i18n/definitions/lukiokoulutus";
import ammatillinenKoulutus from "i18n/definitions/ammatillinenKoulutus";

const Asianhallinta = ({ koulutusmuoto, user, WizardContainer }) => {
  const history = useHistory();
  const { formatMessage, locale } = useIntl();

  const role =
    sessionStorage.getItem("role") === ROLE_ESITTELIJA ? "ESITTELIJA" : "KJ";

  return (
    <React.Fragment>
      <Router history={history}>
        <LocalizedSwitch>
          <Route
            authenticated={!!user}
            exact
            path={AppRoute.UusiHakemus}
            render={() => (
              <BaseData
                locale={locale}
                koulutustyyppi={koulutusmuoto.koulutustyyppi}
                render={_props => {
                  return (
                    <MuutoksetContainer>
                      <WizardContainer
                        kohteet={_props.kohteet}
                        koulutukset={_props.koulutukset}
                        koulutusalat={_props.koulutusalat}
                        koulutusmuoto={koulutusmuoto}
                        koulutustyypit={_props.koulutustyypit}
                        lisatiedot={_props.lisatiedot}
                        maaraystyypit={_props.maaraystyypit}
                        muut={_props.muut}
                        opetuskielet={_props.opetuskielet}
                        organisaatio={_props.organisaatio}
                        role={role}
                        viimeisinLupa={_props.viimeisinLupa}
                      />
                    </MuutoksetContainer>
                  );
                }}
              />
            )}
          />
          <Route
            authenticated={!!user}
            exact
            path={AppRoute.Hakemus}
            render={() => {
              return (
                <BaseData
                  locale={locale}
                  koulutustyyppi={koulutusmuoto.koulutustyyppi}
                  render={_props => {
                    return (
                      <MuutoksetContainer>
                        <WizardContainer
                          kohteet={_props.kohteet}
                          koulutukset={_props.koulutukset}
                          koulutusalat={_props.koulutusalat}
                          koulutusmuoto={koulutusmuoto}
                          koulutustyypit={_props.koulutustyypit}
                          lisatiedot={_props.lisatiedot}
                          maaraystyypit={_props.maaraystyypit}
                          muut={_props.muut}
                          opetuskielet={_props.opetuskielet}
                          organisaatio={_props.organisaatio}
                          role={role}
                          viimeisinLupa={_props.viimeisinLupa}
                        />
                      </MuutoksetContainer>
                    );
                  }}
                />
              );
            }}
          />
          {!!user && (
            <Route
              authenticated={!!user}
              path={AppRoute.Asianhallinta}
              render={() => <Asiat koulutusmuoto={koulutusmuoto} user={user} />}
            />
          )}
          <Route path="*">
            {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
              <div className="flex-1 bg-gray-100">
                <div className="border border-gray-300 max-w-7xl m-auto bg-white mt-12 px-64 py-12">
                  <Typography component="h1" variant="h1">
                    {formatMessage(common.asianhallinta)}
                  </Typography>
                  <p>{formatMessage(common.asianhallintaInfoText)}</p>
                  <div className="grid grid-cols-3 gap-4 justify-items-auto pt-12">
                    <NavLink
                      className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                      to={localizeRouteKey(
                        locale,
                        AppRoute.AsianhallintaAvoimet,
                        formatMessage,
                        {
                          koulutusmuoto: formatMessage(
                            esiJaPerusopetus.kebabCase
                          )
                        }
                      )}
                      exact={true}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {formatMessage(education.preAndBasicEducation)}
                      <ArrowForwardIcon className="ml-4" />
                    </NavLink>
                    <NavLink
                      className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                      to={localizeRouteKey(
                        locale,
                        AppRoute.AsianhallintaAvoimet,
                        formatMessage,
                        {
                          koulutusmuoto: formatMessage(lukiokoulutus.kebabCase)
                        }
                      )}
                      exact={true}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {formatMessage(education.highSchoolEducation)}
                      <ArrowForwardIcon className="ml-4" />
                    </NavLink>
                    <NavLink
                      className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                      to={localizeRouteKey(
                        locale,
                        AppRoute.AsianhallintaAvoimet,
                        formatMessage,
                        {
                          koulutusmuoto: formatMessage(
                            ammatillinenKoulutus.kebabCase
                          )
                        }
                      )}
                      exact={true}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {formatMessage(education.vocationalEducation)}
                      <ArrowForwardIcon className="ml-4" />
                    </NavLink>
                  </div>
                </div>
              </div>
            ) : null}
          </Route>
        </LocalizedSwitch>
      </Router>
    </React.Fragment>
  );
};

export default Asianhallinta;
