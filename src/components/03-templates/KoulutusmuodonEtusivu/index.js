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

const keys = ["lupaByYtunnus"];

export default function KoulutusmuodonEtusivu({
  AsiaDialogContainer,
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

  return (
    <div>
      <div className="mx-auto max-w-9xl">
        <BreadcrumbsItem to="/">Oiva</BreadcrumbsItem>
        <div className="flex flex-col min-h-screen mx-auto bg-white mb-8 pb-8">
          <article className="px-16">
            <nav
              tabIndex="0"
              className="breadcumbs-nav py-8"
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
              <React.Fragment>
                <Typography component="h1" variant="h1" className="py-4">
                  {sivunOtsikko}
                </Typography>
                <Typography component="p" className="pb-8">
                  {kuvausteksti}
                </Typography>
                {!!user ? (
                  <section>
                    <Typography component="h2" variant="h2" className="py-4">
                      {formatMessage(commonMessages.asianhallinta)}
                    </Typography>
                    <AsianhallintaCard
                      koulutusmuoto={koulutusmuoto}></AsianhallintaCard>
                  </section>
                ) : null}
                <section className="pt-12">
                  <Jarjestajat
                    koulutusmuoto={koulutusmuoto}
                    sivunOtsikko={sivunOtsikko}
                  />
                </section>
              </React.Fragment>
            ) : null}
          </article>

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
                        return (
                          <JarjestajaSwitch
                            JarjestamislupaJSX={JarjestamislupaJSX}
                            koulutusmuoto={koulutusmuoto}
                            lupa={_props.lupa}
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
    </div>
  );
}
