import React, { useContext, useEffect, useMemo } from "react";
import { injectIntl } from "react-intl";
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
import Loading from "../../../../modules/Loading";
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import { COLORS } from "../../../../modules/styles";
import { FullWidthWrapper } from "../../../../modules/elements";
import { KunnatProvider } from "context/kunnatContext";
import { MaakunnatProvider } from "../../../../context/maakunnatContext";
import { BackendContext } from "../../../../context/backendContext";
import {
  abort,
  fetchFromBackend,
  getFetchState,
  statusMap
} from "../../../../services/backendService";
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

const Jarjestaja = ({
  intl,
  lupa = {},
  match,
  muutospyynnot,
  organisaatio = {},
  user,
  ytunnus
}) => {
  const { state: fromBackend, dispatch } = useContext(BackendContext);

  const jarjestaja = useMemo(() => {
    return lupa ? {
      ...lupa.jarjestaja,
      nimi: R.prop(intl.locale, lupa.jarjestaja.nimi)
    } : {};
  }, [intl.locale, lupa]);

  const breadcrumb = useMemo(() => {
    return jarjestaja ? `/jarjestajat/${jarjestaja.oid}` : "";
  }, [jarjestaja]);

  /**
   * Abort controller instances are used for cancelling the related
   * XHR calls later.
   */
  const abortControllers = useMemo(() => {
    return jarjestaja
      ? fetchFromBackend([
          {
            key: "lupahistoria",
            dispatchFn: dispatch,
            urlEnding: jarjestaja.oid
          }
        ])
      : [];
  }, [dispatch, jarjestaja]);

  /**
   * Ongoing XHR calls must be canceled. It's done here.
   */
  useEffect(() => {
    return () => {
      abort(abortControllers);
    };
  }, [abortControllers, dispatch]);

  const fetchState = useMemo(() => {
    return getFetchState([fromBackend.lupahistoria]);
  }, [fromBackend.lupahistoria]);

  const tabNavRoutes = useMemo(() => {
    // Basic routes (no authentication needed)
    const basicRoutes = [
      {
        path: `${match.url}/omattiedot`,
        exact: true,
        text: LUPA_TEKSTIT.OMATTIEDOT.OTSIKKO.FI,
        authenticated: !!user
      },
      {
        path: `${match.url}/jarjestamislupa-asia`,
        text: LUPA_TEKSTIT.ASIAT.OTSIKKO_LYHYT.FI,
        authenticated: !!user
      }
    ];
    // If user is logged in we are going to show her/him these additional routes.
    const additionalRoutes = user
      ? [
          {
            path: `${match.url}/jarjestamislupa`,
            text: LUPA_TEKSTIT.LUPA.OTSIKKO_LYHYT.FI,
            authenticated: true
          },
          {
            path: `${match.url}`,
            exact: true,
            text: LUPA_TEKSTIT.PAATOKSET.OTSIKKO.FI,
            authenticated: true
          }
        ]
      : [];
    return R.flatten(R.insert(1, additionalRoutes, basicRoutes));
  }, [match.url, user]);

  const newApplicationRouteItem = useMemo(() => {
    return {
      path: `${match.url}/hakemukset-ja-paatokset/uusi/1`,
      text: LUPA_TEKSTIT.MUUT.UUSI_HAKEMUS_OTSIKKO.FI,
      authenticated: !!user
    };
  }, [match, user]);

  const view = useMemo(() => {
    let jsx = <React.Fragment></React.Fragment>;
    if (fetchState === statusMap.fetching) {
      jsx = <Loading />;
    } else if (fetchState === statusMap.ready) {
      jsx = (
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
              <div className="mx-auto w-11/12 lg:w-3/4 pb-8 py-8">
                <Route
                  path={`${match.path}/omattiedot`}
                  exact
                  render={props => (
                    <MaakunnatProvider>
                      <KunnatProvider>
                        <OmatTiedot organisaatio={organisaatio} user={user} />
                      </KunnatProvider>
                    </MaakunnatProvider>
                  )}
                />
                <Route
                  path={`${match.url}/jarjestamislupa`}
                  exact
                  render={() => <Jarjestamislupa ytunnus={ytunnus} />}
                />
                <Route
                  path={`${match.url}`}
                  exact
                  render={() => <JulkisetTiedot lupadata={lupa.data} />}
                />
                <Route
                  path={`${match.url}/jarjestamislupa-asia`}
                  exact
                  render={() => (
                    <JarjestamislupaAsiat
                      lupadata={lupa.data}
                      lupahistory={R.path(["lupahistoria", "raw"], fromBackend)}
                      newApplicationRouteItem={newApplicationRouteItem}
                    />
                  )}
                />
                <Route
                  path={`${match.path}/hakemukset-ja-paatokset`}
                  exact
                  render={props => (
                    <HakemuksetJaPaatokset
                      muutospyynnot={muutospyynnot}
                      {...props}
                    />
                  )}
                />
              </div>
            ) : (
              <div className="mx-auto w-full sm:w-3/4 pb-8 sm:py-16">
                <Route
                  path={`${match.url}/jarjestamislupa`}
                  render={() => <Jarjestamislupa />}
                />
                <Route
                  path={`${match.url}`}
                  exact
                  render={() => <JulkisetTiedot lupadata={lupa.data} />}
                />
              </div>
            )}
          </FullWidthWrapper>
        </React.Fragment>
      );
    }
    return jsx;
  }, [
    breadcrumb,
    fetchState,
    fromBackend,
    jarjestaja,
    lupa.data,
    match.path,
    match.url,
    muutospyynnot,
    newApplicationRouteItem,
    organisaatio,
    tabNavRoutes,
    user,
    ytunnus
  ]);

  return view;
};

Jarjestaja.propTypes = {
  lupa: PropTypes.object,
  match: PropTypes.object,
  muutospyynnot: PropTypes.array,
  organisaatio: PropTypes.object,
  user: PropTypes.object,
  ytunnus: PropTypes.string
};

export default injectIntl(Jarjestaja);
