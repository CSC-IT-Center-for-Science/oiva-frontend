import React from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { Helmet } from "react-helmet";
import common from "../../i18n/definitions/common";
import education from "../../i18n/definitions/education";
import { useIntl } from "react-intl";
import { Routes, Route } from "react-router-dom";
import BaseData from "scenes/BaseData";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import Jarjestaja from "./Jarjestaja/components/Jarjestaja";
import Loading from "modules/Loading";

/**
 * Järjestäjät-osion pääsivu.
 */
const Jarjestajat = ({ user }) => {
  const intl = useIntl();
  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>Ammatillisen koulutuksen järjestäjät</title>
      </Helmet>

      <Routes>
        <Route
          path="/*"
          element={
            <BaseData
              keys={["luvat"]}
              locale={intl.locale}
              render={_props => {
                return _props.luvat ? (
                  <Jarjestajaluettelo luvat={_props.luvat} />
                ) : (
                  <Loading />
                );
              }}
            />
          }
        />

        <Route
          path={":ytunnus/*"}
          element={
            <BaseData
              keys={["lupa"]}
              locale={intl.locale}
              render={_props => {
                return _props.lupa ? (
                  <div>
                    <Jarjestaja lupa={_props.lupa} user={user} />
                  </div>
                ) : (
                  <Loading />
                );
              }}
            />
          }
        />
      </Routes>
    </React.Fragment>
  );
};

export default Jarjestajat;
