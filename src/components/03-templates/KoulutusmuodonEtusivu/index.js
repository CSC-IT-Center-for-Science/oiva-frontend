import React from "react";
import { Typography } from "@material-ui/core";
import commonMessages from "i18n/definitions/common";
import { useIntl } from "react-intl";
import { Breadcrumbs, BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import {
  NavLink,
  Route,
  Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { COLORS } from "modules/styles";
import Jarjestajat from "../Jarjestajat";
import BaseData from "basedata";
import JarjestajaSwitch from "../JarjestajaSwitch";
import { useUser } from "stores/user";
import AsianhallintaCard from "../AsianhallintaCard";
import Asianhallinta from "../Asianhallinta";
import { includes } from "ramda";

const keys = ["lupaByYtunnus", "organisaatio"];

export default function KoulutusmuodonEtusivu({
  AsiaDialogContainer,
  Jarjestajaluettelo,
  JarjestamislupaJSX,
  koulutusmuoto,
  kuvausteksti,
  sivunOtsikko,
  UusiAsiaDialogContainer
}) {
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const location = useLocation();
  const [userState] = useUser();
  const { data: user } = userState;

  const isEsittelija = user
    ? includes("OIVA_APP_ESITTELIJA", user.roles)
    : false;

  return (
    <React.Fragment>
      <BreadcrumbsItem to="/">Oiva</BreadcrumbsItem>
      <div className="flex-1 flex flex-col bg-white">
        <article>
          <nav
            tabIndex="0"
            className="breadcumbs-nav py-4 border-b pl-8 mb-12"
            aria-label={formatMessage(commonMessages.breadCrumbs)}>
            <Breadcrumbs
              hideIfEmpty={true}
              separator={<b> / </b>}
              item={NavLink}
              finalItem={"b"}
              finalProps={{
                style: {
                  fontWeight: 400,
                  color: COLORS.BLACK
                }
              }}
            />
          </nav>
          {location.pathname === `/${koulutusmuoto.kebabCase}` ? (
            <div className="mx-auto w-4/5 mt-12">
              <Typography component="h1" variant="h1" className="py-4">
                {sivunOtsikko}
              </Typography>
              <Typography component="p" className="pb-8">
                {kuvausteksti}
              </Typography>
              {isEsittelija ? (
                <section>
                  <Typography component="h2" variant="h2" className="py-4">
                    {formatMessage(commonMessages.asianhallinta)}
                  </Typography>
                  <AsianhallintaCard
                    koulutusmuoto={koulutusmuoto}></AsianhallintaCard>
                </section>
              ) : null}
              <section>
                {Jarjestajaluettelo ? (
                  <Jarjestajat
                    koulutusmuoto={koulutusmuoto}
                    Jarjestajaluettelo={Jarjestajaluettelo}
                    sivunOtsikko={sivunOtsikko}
                  />
                ) : null}
              </section>
            </div>
          ) : null}
        </article>

        <div className="flex-1 flex flex-col">
          <Router history={history}>
            <Switch>
              <Route
                path={`/${koulutusmuoto.kebabCase}/asianhallinta`}
                render={() => (
                  <Asianhallinta
                    AsiaDialogContainer={AsiaDialogContainer}
                    koulutusmuoto={koulutusmuoto}
                    sivunOtsikko={sivunOtsikko}
                    UusiAsiaDialogContainer={UusiAsiaDialogContainer}
                  />
                )}
              />
              <Route
                path={`/${koulutusmuoto.kebabCase}/koulutuksenjarjestajat/:id`}
                render={props => {
                  return (
                    <BaseData
                      keys={keys}
                      locale={locale}
                      render={_props => {
                        console.info(_props);
                        return (
                          <JarjestajaSwitch
                            JarjestamislupaJSX={JarjestamislupaJSX}
                            koulutusmuoto={koulutusmuoto}
                            lupa={_props.lupa}
                            organisation={_props.organisaatio}
                            path={props.match.path}
                            user={user}
                            {..._props}
                          />
                        );
                      }}
                    />
                  );
                }}
              />
            </Switch>
          </Router>
        </div>
      </div>
    </React.Fragment>
  );
}
