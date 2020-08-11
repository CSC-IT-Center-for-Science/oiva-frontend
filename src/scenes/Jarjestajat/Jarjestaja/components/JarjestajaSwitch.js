import React, { useMemo } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Jarjestaja from "../components/Jarjestaja";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { parseLupa } from "../../../../utils/lupaParser";
import HakemusContainer from "../Hakemukset/HakemusContainer";
import { isEmpty } from "ramda";
import Loading from "../../../../modules/Loading";
import { prop } from "ramda";
import BaseData from "scenes/BaseData";

const JarjestajaSwitch = React.memo(({ lupa, path, user, ytunnus }) => {
  const intl = useIntl();
  const history = useHistory();

  const lupaKohteet = useMemo(() => {
    return !lupa
      ? {}
      : parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase());
  }, [lupa, intl]);

  return (
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
            ytunnus === prop("ytunnus", lupa.keyParams) &&
            !isEmpty(lupaKohteet)
          ) {
            return (
              <Jarjestaja
                lupaKohteet={lupaKohteet}
                lupa={lupa}
                path={path}
                url={props.match.url}
                user={user}
              />
            );
          }
          return <Loading />;
        }}
      />
    </Switch>
  );
});

JarjestajaSwitch.propTypes = {
  path: PropTypes.string,
  ytunnus: PropTypes.string,
  user: PropTypes.object
};

export default JarjestajaSwitch;
