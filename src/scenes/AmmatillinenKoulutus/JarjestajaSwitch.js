import React, { useMemo } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Jarjestaja from "./Jarjestajat/Jarjestaja/components/Jarjestaja";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { parseLupa } from "../../utils/lupaParser";
import HakemusContainer from "./Jarjestajat/Jarjestaja/Hakemukset/HakemusContainer";
import { isEmpty } from "ramda";
import Loading from "../../modules/Loading";
import { prop } from "ramda";
import BaseData from "basedata";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import education from "../../i18n/definitions/education";

const JarjestajaSwitch = ({
  lupa,
  organisation,
  path,
  user,
  ytunnus,
  kielet,
  tulevatLuvat,
  voimassaOlevaLupa
}) => {
  const intl = useIntl();
  const history = useHistory();

  const lupaKohteet = useMemo(() => {
    return !lupa
      ? {}
      : parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase());
  }, [lupa, intl]);

  return (
    <React.Fragment>
      <BreadcrumbsItem to="/ammatillinenkoulutus">
        {intl.formatMessage(education.vocationalEducation)}
      </BreadcrumbsItem>
      <Switch>
        <Route
          exact
          path={`${path}/hakemukset-ja-paatokset/uusi/:page`}
          render={props => {
            if (!isEmpty(lupaKohteet) && lupa) {
              return (
                <BaseData
                  locale={intl.locale}
                  render={_props => (
                    <HakemusContainer
                      history={history}
                      lupaKohteet={lupaKohteet}
                      lupa={lupa}
                      match={props.match}
                      {..._props}
                    />
                  )}
                />
              );
            }
            return <Loading />;
          }}
        />
        <Route
          exact
          path={`${path}/hakemukset-ja-paatokset/:uuid/:page`}
          render={props => {
            if (lupaKohteet && lupa) {
              return (
                <BaseData
                  locale={intl.locale}
                  render={_props => (
                    <HakemusContainer
                      history={history}
                      lupaKohteet={lupaKohteet}
                      lupa={lupa}
                      match={props.match}
                      {..._props}
                    />
                  )}
                />
              );
            }
            return <Loading />;
          }}
        />
        <Route
          path={`${path}`}
          render={props => {
            if (
              lupa &&
              ytunnus === prop("jarjestajaYtunnus", lupa) &&
              !isEmpty(lupaKohteet)
            ) {
              return (
                <Jarjestaja
                  lupaKohteet={lupaKohteet}
                  lupa={lupa}
                  organisation={organisation}
                  path={path}
                  url={props.match.url}
                  user={user}
                  kielet={kielet}
                  tulevatLuvat={tulevatLuvat}
                  voimassaOlevaLupa={voimassaOlevaLupa}
                />
              );
            }
            return <Loading />;
          }}
        />
      </Switch>
    </React.Fragment>
  );
};

JarjestajaSwitch.propTypes = {
  lupa: PropTypes.object,
  organisation: PropTypes.object,
  path: PropTypes.string,
  ytunnus: PropTypes.string,
  user: PropTypes.object,
  kielet: PropTypes.array,
  tulevatLuvat: PropTypes.array,
  voimassaOlevaLupa: PropTypes.object
};

export default JarjestajaSwitch;
