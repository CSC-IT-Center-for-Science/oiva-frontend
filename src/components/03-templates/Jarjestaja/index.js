import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { Route, useHistory, useLocation } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import JarjestajaBasicInfo from "./JarjestajaBasicInfo";
import JulkisetTiedot from "./JulkisetTiedot";
import OmatTiedot from "./OmatTiedot";
import JarjestamislupaAsiat from "./Jarjestamislupa-asiat";
import HakemuksetJaPaatokset from "./HakemuksetJaPaatokset";
import common from "i18n/definitions/common";
import education from "i18n/definitions/education";
import * as R from "ramda";
import BaseData from "basedata";
import { Helmet } from "react-helmet";
import { Tab, Tabs, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Separator } from "./MuutospyyntoWizardComponents";

const OivaTab = withStyles(theme => ({
  root: {
    minWidth: 0,
    textTransform: "none",
    color: "#333 !important",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    padding: 0,
    marginRight: "2rem",
    marginLeft: "0.3em",
    marginTop: "0.3em",
    "&:focus": {
      outline: "0.2rem solid #d1d1d1"
    }
  }
}))(props => <Tab {...props} />);

const OivaTabs = withStyles(() => ({
  root: {},
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: "0.3rem !important",
    "& > div": {
      width: "100%",
      backgroundColor: "#4C7A61"
    }
  }
}))(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const Jarjestaja = React.memo(
  ({
    JarjestamislupaJSX,
    lupaKohteet = [],
    lupa = {},
    organisation = {},
    path,
    url,
    user,
    kielet,
    tulevatLuvat = [],
    voimassaOlevaLupa = {}
  }) => {
    const history = useHistory();
    const intl = useIntl();
    const location = useLocation();
    const tabKey = R.last(R.split("/", location.pathname));

    const jarjestaja = useMemo(() => {
      return lupa && lupa.jarjestaja
        ? {
            ...lupa.jarjestaja,
            nimi:
              R.prop(intl.locale, lupa.jarjestaja.nimi) ||
              R.head(R.values(lupa.jarjestaja.nimi))
          }
        : {};
    }, [intl.locale, lupa]);

    const breadcrumb = useMemo(() => {
      return jarjestaja ? `/jarjestajat/${jarjestaja.oid}` : "";
    }, [jarjestaja]);

    const tabNavRoutes = useMemo(() => {
      // Basic routes (no authentication needed)
      const basicRoutes = [
        {
          path: "jarjestamislupa",
          text: intl.formatMessage(common.lupaTitle),
          authenticated: true
        },
        {
          path: "paatokset",
          exact: true,
          text: intl.formatMessage(common.lupaPaatokset),
          authenticated: true
        }
      ];
      // If user is logged in we are going to show her/him these additional routes.
      const additionalRoutes =
        user && R.equals(user.oid, R.prop("oid", lupa.jarjestaja))
          ? [
              {
                path: "omattiedot",
                exact: true,
                text: intl.formatMessage(common.omatTiedotTitle),
                authenticated: !!user
              },
              {
                id: "jarjestamislupa-asia",
                path: "jarjestamislupa-asiat",
                text: intl.formatMessage(common.asiatTitle),
                authenticated: !!user
              }
            ]
          : [];
      return R.flatten(R.insert(1, basicRoutes, additionalRoutes));
    }, [lupa.jarjestaja, user, intl]);

    const newApplicationRouteItem = useMemo(() => {
      return {
        path: `${url}/hakemukset-ja-paatokset/uusi/1`,
        text: intl.formatMessage(common.newHakemus),
        authenticated: !!user
      };
    }, [intl, url, user]);

    return (
      <article>
        <Helmet htmlAttributes={{ lang: intl.locale }}>
          <title>
            {jarjestaja.nimi},{" "}
            {intl.formatMessage(education.vocationalEducation)} - Oiva
          </title>
        </Helmet>
        <BreadcrumbsItem to={breadcrumb}>{jarjestaja.nimi}</BreadcrumbsItem>
        <section className="px-8">
          <Typography component="h1" variant="h1">
            {jarjestaja.nimi}
          </Typography>

          <JarjestajaBasicInfo jarjestaja={jarjestaja} />
        </section>

        <Separator />

        <div className="px-8">
          <OivaTabs
            value={tabKey}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, val) => {
              history.push(val);
            }}>
            {tabNavRoutes
              ? R.addIndex(R.map)((route, index) => {
                  return (
                    <OivaTab
                      key={`tab-${index}`}
                      label={route.text}
                      aria-label={route.text}
                      to={route.path}
                      value={route.path}
                    />
                  );
                }, tabNavRoutes)
              : null}
             
          </OivaTabs>
          {!!user ? (
            <div>
              <Route
                path={`${path}/omattiedot`}
                exact
                render={() => (
                  <BaseData
                    keys={["kunnat", "lupa", "maakunnat"]}
                    locale={intl.locale}
                    render={_props => (
                      <OmatTiedot organisation={organisation} {..._props} />
                    )}
                  />
                )}
              />
              <Route
                path={`${url}/jarjestamislupa`}
                render={() => (
                  <div className="border mt-12 p-12">
                    <JarjestamislupaJSX lupa={lupa} />
                  </div>
                )}
              />
              <Route
                path={`${url}/paatokset`}
                exact
                render={props => (
                  <JulkisetTiedot
                    jarjestaja={jarjestaja}
                    tulevatLuvat={tulevatLuvat}
                    voimassaOlevaLupa={voimassaOlevaLupa}
                  />
                )}
              />
              <Route
                path={`${url}/jarjestamislupa-asiat`}
                exact
                render={props => (
                  <JarjestamislupaAsiat
                    history={props.history}
                    intl={intl}
                    isForceReloadRequested={R.includes(
                      "force=true",
                      props.location.search
                    )}
                    match={props.match}
                    newApplicationRouteItem={newApplicationRouteItem}
                    lupa={lupa}
                    organisation={organisation}
                  />
                )}
              />
              <Route
                path={`${path}/hakemukset-ja-paatokset`}
                exact
                render={props => <HakemuksetJaPaatokset match={props.match} />}
              />
            </div>
          ) : (
            <div>
              <Route
                path={`${url}/jarjestamislupa`}
                render={() => (
                  <div className="border mt-12 p-12">
                    <JarjestamislupaJSX lupa={lupa} />
                  </div>
                )}
              />
              <Route
                path={`${url}/paatokset`}
                exact
                render={() => (
                  <JulkisetTiedot
                    jarjestaja={jarjestaja}
                    tulevatLuvat={tulevatLuvat}
                    voimassaOlevaLupa={voimassaOlevaLupa}
                  />
                )}
              />
            </div>
          )}
        </div>
      </article>
    );
  }
);

Jarjestaja.propTypes = {
  lupaKohteet: PropTypes.object,
  lupa: PropTypes.object,
  organisation: PropTypes.object,
  path: PropTypes.string,
  url: PropTypes.string,
  user: PropTypes.object,
  kielet: PropTypes.array,
  tulevatLuvat: PropTypes.array,
  voimassaOlevaLupa: PropTypes.object
};

export default Jarjestaja;
