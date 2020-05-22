import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Route } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import JarjestajaBasicInfo from "./JarjestajaBasicInfo";
import ProfileMenu from "./ProfileMenu";
import JulkisetTiedot from "./JulkisetTiedot";
import OmatTiedot from "./OmatTiedot";
import JarjestamislupaAsiat from "./Jarjestamislupa-asiat";
import Jarjestamislupa from "./Jarjestamislupa";
import HakemuksetJaPaatokset from "../Hakemukset/components/HakemuksetJaPaatokset";
import { COLORS } from "../../../../modules/styles";
import { FullWidthWrapper } from "../../../../modules/elements";
import common from "../../../../i18n/definitions/common";
import * as R from "ramda";

const Separator = styled.div`
  &:after {
    display: block;
    content: "";
    width: 100%;
    height: 1px;
    background-color: ${COLORS.BORDER_GRAY};
    margin: 30px 0;
  }
`;

const Jarjestaja = React.memo(
  ({ lupaKohteet = [], lupa = {}, path, url, user }) => {
    const intl = useIntl();

    const jarjestaja = useMemo(() => {
      return lupa && lupa.jarjestaja
        ? {
            ...lupa.jarjestaja,
            nimi: R.prop(intl.locale, lupa.jarjestaja.nimi)
              || R.head(R.values(lupa.jarjestaja.nimi))
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
      <React.Fragment>
        <div className="mx-auto px-4 sm:px-0 w-11/12 lg:w-3/4">
          <BreadcrumbsItem to="/">Etusivu</BreadcrumbsItem>
          <BreadcrumbsItem to="/jarjestajat">
            Ammatillinen koulutus
          </BreadcrumbsItem>
          <BreadcrumbsItem to={breadcrumb}>{jarjestaja.nimi}</BreadcrumbsItem>

          <JarjestajaBasicInfo jarjestaja={jarjestaja} />

          <Separator />

          <ProfileMenu routes={tabNavRoutes} />
        </div>
        <FullWidthWrapper backgroundColor={COLORS.BG_GRAY} className="mt-4">
          {!!user ? (
            <div className="mx-auto lg:w-3/4 pb-8 py-8">
              <Route
                path={`${path}/omattiedot`}
                exact
                render={() => <OmatTiedot />}
              />
              <Route
                path={`${url}/jarjestamislupa`}
                exact
                render={() => (
                  <Jarjestamislupa
                    lupaKohteet={lupaKohteet}
                    lupa={lupa}
                    ytunnus={jarjestaja.ytunnus}
                  />
                )}
              />
              <Route
                path={`${url}`}
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
            <div className="mx-auto w-full sm:w-3/4 pb-8 sm:py-16">
              <Route
                path={`${url}/jarjestamislupa`}
                render={() => (
                  <Jarjestamislupa lupa={lupa} lupaKohteet={lupaKohteet} />
                )}
              />
              <Route
                path={`${url}`}
                exact
                render={() => (
                  <JulkisetTiedot lupa={lupa} jarjestaja={jarjestaja} />
                )}
              />
            </div>
          )}
        </FullWidthWrapper>
      </React.Fragment>
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
