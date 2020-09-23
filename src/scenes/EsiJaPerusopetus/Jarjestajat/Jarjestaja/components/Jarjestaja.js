import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import {
  Route,
  useHistory,
  useLocation,
  useRouteMatch
} from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import JarjestajaBasicInfo from "./JarjestajaBasicInfo";
import ProfileMenu from "./ProfileMenu";
import JulkisetTiedot from "./JulkisetTiedot";
import OmatTiedot from "./OmatTiedot";
import JarjestamislupaAsiat from "./Jarjestamislupa-asiat";
import Jarjestamislupa from "./Jarjestamislupa";
import HakemuksetJaPaatokset from "../Hakemukset/components/HakemuksetJaPaatokset";
import { COLORS } from "../../../../../modules/styles";
import common from "../../../../../i18n/definitions/common";
import education from "../../../../../i18n/definitions/education";
import * as R from "ramda";
import BaseData from "basedata";
import { Helmet } from "react-helmet";
import { Tab, Tabs, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Separator } from "../Hakemukset/Muutospyynto/components/MuutospyyntoWizardComponents";

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
  ({ lupaKohteet = [], lupa = {}, path, url, user, kielet }) => {
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
          path: `${url}/jarjestamislupa`,
          text: intl.formatMessage(common.lupaTitle),
          authenticated: true
        },
        {
          path: `${url}`,
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
                path: `${url}/omattiedot`,
                exact: true,
                text: intl.formatMessage(common.omatTiedotTitle),
                authenticated: !!user
              },
              {
                id: "jarjestamislupa-asiat",
                path: `${url}/jarjestamislupa-asia`,
                text: intl.formatMessage(common.asiatTitle),
                authenticated: !!user
              }
            ]
          : [];
      return R.flatten(R.insert(1, basicRoutes, additionalRoutes));
    }, [lupa.jarjestaja, url, user, intl]);

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
            <OivaTab
              label={intl.formatMessage(common.lupaTitle)}
              aria-label={intl.formatMessage(common.lupaTitle)}
              to={"jarjestamislupa"}
              value={"jarjestamislupa"}
            />
            <OivaTab
              label={intl.formatMessage(common.lupaPaatokset)}
              aria-label={intl.formatMessage(common.lupaPaatokset)}
              to={"paatokset"}
              value={"paatokset"}
            />
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
                    render={_props => <OmatTiedot {..._props} />}
                  />
                )}
              />
              <Route
                path={`${url}/jarjestamislupa`}
                exact
                render={() => (
                  <Jarjestamislupa
                    lupaKohteet={lupaKohteet}
                    lupa={lupa}
                    ytunnus={jarjestaja.ytunnus}
                    kielet={kielet}
                  />
                )}
              />
              <Route
                path={`${url}/paatokset`}
                exact
                render={props => (
                  <JulkisetTiedot
                    history={props.history}
                    jarjestaja={jarjestaja}
                    lupa={lupa}
                  />
                )}
              />
              <Route
                path={`${url}/jarjestamislupa-asia`}
                exact
                render={props => (
                  <JarjestamislupaAsiat
                    history={props.history}
                    intl={intl}
                    match={props.match}
                    isForceReloadRequested={R.includes(
                      "force=true",
                      props.location.search
                    )}
                    newApplicationRouteItem={newApplicationRouteItem}
                    lupa={lupa}
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
                  <Jarjestamislupa
                    lupa={lupa}
                    lupaKohteet={lupaKohteet}
                    kielet={kielet}
                  />
                )}
              />
              <Route
                path={`${url}/paatokset`}
                exact
                render={() => (
                  <JulkisetTiedot lupa={lupa} jarjestaja={jarjestaja} />
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
  path: PropTypes.string,
  url: PropTypes.string,
  user: PropTypes.object
};

export default Jarjestaja;
