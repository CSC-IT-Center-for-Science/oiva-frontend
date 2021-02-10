import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { Route, useHistory, useLocation } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import JarjestajaBasicInfo from "./JarjestajaBasicInfo";
import JulkisetTiedot from "./JulkisetTiedot";
import OmatTiedot from "./OmatTiedot";
import JarjestamislupaAsiat from "./Jarjestamislupa-asiat";
import common from "i18n/definitions/common";
import education from "i18n/definitions/education";
import * as R from "ramda";
import BaseData from "basedata";
import { Helmet } from "react-helmet";
import { Tab, Tabs, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { koulutustyypitMap } from "../../../utils/constants";
import { localizeRouteKey } from "utils/common";
import equal from "react-fast-compare";
import { AppRoute } from "const/index";
import { LocalizedSwitch } from "modules/i18n/index";
import kebabCase from "i18n/definitions/kebabCase";

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
    kohteet,
    koulutusmuoto,
    lupa = {},
    lupakohteet = [],
    organisation = {},
    user,
    tulevatLuvat = [],
    voimassaOlevaLupa = {}
  }) => {
    const history = useHistory();
    const intl = useIntl();
    const location = useLocation();
    const tabKey = R.last(R.split("/", location.pathname));

    const jarjestaja =
      lupa && lupa.jarjestaja
        ? {
            ...lupa.jarjestaja,
            nimi:
              R.prop(intl.locale, lupa.jarjestaja.nimi) ||
              R.head(R.values(lupa.jarjestaja.nimi))
          }
        : {};

    const breadcrumb = localizeRouteKey(
      intl.locale,
      AppRoute.Jarjestamislupa,
      intl.formatMessage,
      {
        id: jarjestaja.oid,
        koulutusmuoto: koulutusmuoto.kebabCase
      }
    );

    const tabNavRoutes = useMemo(() => {
      // Basic routes (no authentication needed)
      const basicRoutes = [
        {
          path: intl.formatMessage(kebabCase.jarjestamislupa),
          text: intl.formatMessage(
            koulutusmuoto.koulutustyyppi === koulutustyypitMap.VAPAASIVISTYSTYO
              ? common.yllapitamisLupaTitle
              : common.lupaTitle
          ),
          authenticated: true
        },
        {
          path: intl.formatMessage(kebabCase.paatokset),
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
                path: intl.formatMessage(kebabCase.omatTiedot),
                exact: true,
                text: intl.formatMessage(common.omatTiedotTitle),
                authenticated: !!user
              },
              {
                id: "jarjestamislupa-asia",
                path: intl.formatMessage(kebabCase.jarjestamislupaasiat),
                text: intl.formatMessage(common.asiatTitle),
                authenticated: !!user
              }
            ]
          : [];
      return R.flatten(R.insert(1, basicRoutes, additionalRoutes));
    }, [koulutusmuoto.koulutustyyppi, lupa.jarjestaja, user, intl]);

    const newApplicationRouteItem = {
      path: localizeRouteKey(
        intl.locale,
        AppRoute.UusiHakemus,
        intl.formatMessage,
        {
          id: organisation.ytunnus,
          koulutusmuoto: koulutusmuoto.kebabCase,
          page: 1
        }
      ),
      text: intl.formatMessage(common.newHakemus),
      authenticated: !!user
    };

    return (
      <article className="flex flex-1 flex-col">
        <Helmet htmlAttributes={{ lang: intl.locale }}>
          <title>
            {jarjestaja.nimi},{" "}
            {intl.formatMessage(education.vocationalEducation)} - Oiva
          </title>
        </Helmet>
        <BreadcrumbsItem to={breadcrumb}>{jarjestaja.nimi}</BreadcrumbsItem>
        <div className="sm:w-4/5 mx-auto max-w-8xl">
          <section className="my-8">
            <Typography component="h1" variant="h1">
              {jarjestaja.nimi}
            </Typography>

            <JarjestajaBasicInfo jarjestaja={jarjestaja} />
          </section>

          <OivaTabs
            value={tabKey}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, val) => {
              history.push(val);
            }}
          >
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
        </div>
        <div className="flex-1 bg-gray-100 border-t border-solid border-gray-300">
          <LocalizedSwitch>
            {!!user && (
              <Route
                exact
                path={AppRoute.OmatTiedot}
                render={() => (
                  <BaseData
                    keys={["kunnat", "lupa", "maakunnat"]}
                    locale={intl.locale}
                    render={_props =>
                      !R.isEmpty(organisation) ? (
                        <div className="border m-12 p-20 bg-white mx-auto w-4/5 max-w-8xl">
                          <div className="max-w-5xl m-auto">
                            <OmatTiedot
                              organisation={organisation}
                              {..._props}
                            />
                          </div>
                        </div>
                      ) : null
                    }
                  />
                )}
              />
            )}
            <Route
              path={AppRoute.Jarjestamislupa}
              render={() => (
                <div className="border m-12 p-20 bg-white mx-auto w-4/5 max-w-8xl">
                  {JarjestamislupaJSX ? (
                    <div className="max-w-5xl m-auto">
                      <JarjestamislupaJSX
                        kohteet={kohteet}
                        lupa={lupa}
                        lupakohteet={lupakohteet}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            />
            <Route
              path={AppRoute.Paatokset}
              exact
              render={() => (
                <JulkisetTiedot
                  koulutusmuoto={koulutusmuoto}
                  jarjestaja={jarjestaja}
                  tulevatLuvat={tulevatLuvat}
                  voimassaOlevaLupa={voimassaOlevaLupa}
                />
              )}
            />
            {!!user && (
              <Route
                path={AppRoute.Jarjestamislupaasiat}
                exact
                render={props => (
                  <div className="m-12 mx-auto w-4/5 max-w-8xl">
                    <JarjestamislupaAsiat
                      history={props.history}
                      intl={intl}
                      isForceReloadRequested={R.includes(
                        "force=true",
                        props.location.search
                      )}
                      koulutusmuoto={koulutusmuoto}
                      match={props.match}
                      newApplicationRouteItem={newApplicationRouteItem}
                      lupa={lupa}
                      organisation={organisation}
                    />
                  </div>
                )}
              />
            )}
          </LocalizedSwitch>
        </div>
      </article>
    );
  },
  (cp, np) => {
    return equal(cp, np);
  }
);

Jarjestaja.propTypes = {
  koulutusmuoto: PropTypes.object,
  lupakohteet: PropTypes.object,
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
