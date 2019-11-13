import React, { useContext, useMemo } from "react";
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
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import { COLORS } from "../../../../modules/styles";
import { FullWidthWrapper } from "../../../../modules/elements";
import { BackendContext } from "../../../../context/backendContext";
import * as R from "ramda";
import FetchHandler from "../../../../FetchHandler";

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
  lupaKohteet = [],
  lupa = {},
  match,
  organisaatio = {},
  user
}) => {
  const { state: fromBackend, dispatch } = useContext(BackendContext);

  const jarjestaja = useMemo(() => {
    return lupa && lupa.jarjestaja
      ? {
          ...lupa.jarjestaja,
          nimi: R.prop(intl.locale, lupa.jarjestaja.nimi)
        }
      : {};
  }, [intl.locale, lupa]);

  const breadcrumb = useMemo(() => {
    return jarjestaja ? `/jarjestajat/${jarjestaja.oid}` : "";
  }, [jarjestaja]);

  const fetchSetup = useMemo(() => {
    return jarjestaja && jarjestaja.oid
      ? [
          {
            key: "lupahistoria",
            dispatchFn: dispatch,
            urlEnding: jarjestaja.oid
          },
          {
            key: "muutospyynnot",
            dispatchFn: dispatch,
            urlEnding: jarjestaja.ytunnus
          }
        ]
      : [];
  }, [dispatch, jarjestaja]);

  const tabNavRoutes = useMemo(() => {
    // Basic routes (no authentication needed)
    const basicRoutes = [
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
    ];
    // If user is logged in we are going to show her/him these additional routes.
    const additionalRoutes =
      user && R.equals(user.oid, R.prop("oid", lupa.jarjestaja))
        ? [
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
          ]
        : [];
    return R.flatten(R.insert(1, basicRoutes, additionalRoutes));
  }, [lupa.jarjestaja, match.url, user]);

  const newApplicationRouteItem = useMemo(() => {
    return {
      path: `${match.url}/hakemukset-ja-paatokset/uusi/1`,
      text: LUPA_TEKSTIT.MUUT.UUSI_HAKEMUS_OTSIKKO.FI,
      authenticated: !!user
    };
  }, [match, user]);

  const muutospyynnot = R.path(["muutospyynnot", "raw"], fromBackend);

  return (
    <React.Fragment>
      <FetchHandler
        fetchSetup={fetchSetup}
        ready={
          <React.Fragment>
            <div className="mx-auto px-4 sm:px-0 w-11/12 lg:w-3/4">
              <BreadcrumbsItem to="/">Etusivu</BreadcrumbsItem>
              <BreadcrumbsItem to="/jarjestajat">
                Ammatillinen koulutus
              </BreadcrumbsItem>
              <BreadcrumbsItem to={breadcrumb}>
                {jarjestaja.nimi}
              </BreadcrumbsItem>

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
                    render={() => <OmatTiedot organisaatio={organisaatio} />}
                  />
                  <Route
                    path={`${match.url}/jarjestamislupa`}
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
                    path={`${match.url}`}
                    exact
                    render={() => (
                      <JulkisetTiedot jarjestaja={jarjestaja} lupa={lupa} />
                    )}
                  />
                  <Route
                    path={`${match.url}/jarjestamislupa-asia`}
                    exact
                    render={props => (
                      <JarjestamislupaAsiat
                        intl={intl}
                        match={props.match}
                        muutospyynnot={muutospyynnot}
                        newApplicationRouteItem={newApplicationRouteItem}
                        organisaatio={organisaatio}
                      />
                    )}
                  />
                  <Route
                    path={`${match.path}/hakemukset-ja-paatokset`}
                    exact
                    render={props => (
                      <HakemuksetJaPaatokset
                        muutospyynnot={muutospyynnot}
                        match={props.match}
                        organisaatio={organisaatio}
                        user={user}
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
                    render={() => <JulkisetTiedot lupa={lupa} />}
                  />
                </div>
              )}
            </FullWidthWrapper>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
};

Jarjestaja.propTypes = {
  lupaKohteet: PropTypes.object,
  lupa: PropTypes.object,
  match: PropTypes.object,
  organisaatio: PropTypes.object,
  user: PropTypes.object
};

export default injectIntl(Jarjestaja);
