import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Route, Routes, Navigate } from "react-router-dom";
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
import education from "../../../../i18n/definitions/education";
import * as R from "ramda";
import BaseData from "scenes/BaseData";
import { parseLupa } from "utils/lupaParser";
import Loading from "modules/Loading";
import HakemusContainer from "../Hakemukset/HakemusContainer";

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

const defaultProps = {
  lupa: {}
};

const Jarjestaja = ({ lupa = defaultProps.lupa, user }) => {
  const intl = useIntl();

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

  const lupaKohteet = !lupa
    ? {}
    : parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase());

  const breadcrumb = useMemo(() => {
    return jarjestaja ? `${jarjestaja.oid}` : "";
  }, [jarjestaja]);

  const tabNavRoutes = useMemo(() => {
    // Basic routes (no authentication needed)
    const basicRoutes = [
      {
        path: "jarjestamislupa",
        text: intl.formatMessage(common.jarjestamislupa),
        authenticated: true
      },
      {
        path: "lupapaatokset",
        text: intl.formatMessage(common.lupapaatokset),
        authenticated: true
      }
    ];
    // If user is logged in we are going to show her/him these additional routes.
    const additionalRoutes =
      user && R.equals(user.oid, R.prop("oid", lupa.jarjestaja))
        ? [
            {
              path: "omattiedot",
              text: intl.formatMessage(common.omattiedot),
              authenticated: !!user
            },
            {
              id: "asiat",
              path: "asiat",
              text: intl.formatMessage(common.asiatTitle),
              authenticated: !!user
            }
          ]
        : [];
    return R.flatten(R.insert(1, basicRoutes, additionalRoutes));
  }, [lupa.jarjestaja, user, intl]);

  const newApplicationRouteItem = useMemo(() => {
    return {
      path: "../hakemukset-ja-paatokset/uusi/1",
      text: intl.formatMessage(common.newHakemus),
      authenticated: !!user
    };
  }, [intl, user]);

  return (
    <React.Fragment>
      <div className="mx-auto px-4 sm:px-0 w-11/12 lg:w-3/4">
        <BreadcrumbsItem to={breadcrumb}>{jarjestaja.nimi}</BreadcrumbsItem>

        <JarjestajaBasicInfo jarjestaja={jarjestaja} />

        <Separator />

        <ProfileMenu routes={tabNavRoutes} />
      </div>
      <FullWidthWrapper backgroundColor={COLORS.BG_GRAY} className="mt-4">
        <div className="mx-auto lg:w-3/4 pb-8 py-8">
          <Routes>
            {!!user ? (
              <React.Fragment>
                <Route
                  path="omattiedot"
                  element={
                    <BaseData
                      keys={["kunnat", "lupa", "maakunnat"]}
                      locale={intl.locale}
                      render={_props => <OmatTiedot {..._props} />}
                    />
                  }
                />
                <Route
                  path="jarjestamislupa"
                  element={
                    <Jarjestamislupa
                      lupaKohteet={lupaKohteet}
                      lupa={lupa}
                      ytunnus={jarjestaja.ytunnus}
                    />
                  }
                />
                <Route
                  path={"lupapaatokset"}
                  element={
                    <JulkisetTiedot jarjestaja={jarjestaja} lupa={lupa} />
                  }
                />
                <Route
                  path="asiat"
                  element={
                    <JarjestamislupaAsiat
                      intl={intl}
                      isForceReloadRequested={true}
                      newApplicationRouteItem={newApplicationRouteItem}
                      lupa={lupa}
                    />
                  }
                />
                <Route
                  path="hakemukset-ja-paatokset/uusi/:page"
                  element={
                    <BaseData
                      locale={intl.locale}
                      render={_props => (
                        <HakemusContainer
                          lupaKohteet={lupaKohteet}
                          lupa={lupa}
                          {..._props}
                        />
                      )}
                    />
                  }
                />
                <Route
                  path="/hakemukset-ja-paatokset/:uuid/:page"
                  element={
                    <BaseData
                      locale={intl.locale}
                      render={_props => (
                        <HakemusContainer
                          lupaKohteet={lupaKohteet}
                          lupa={lupa}
                          {..._props}
                        />
                      )}
                    />
                  }
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Route
                  path="jarjestamislupa"
                  element={
                    <Jarjestamislupa lupa={lupa} lupaKohteet={lupaKohteet} />
                  }
                />
                <Route
                  path="julkisettiedot"
                  element={
                    <JulkisetTiedot lupa={lupa} jarjestaja={jarjestaja} />
                  }
                />
              </React.Fragment>
            )}
          </Routes>
        </div>
      </FullWidthWrapper>
    </React.Fragment>
  );
};

Jarjestaja.propTypes = {
  lupaKohteet: PropTypes.object,
  lupa: PropTypes.object,
  user: PropTypes.object
};

export default Jarjestaja;
