import React, { useMemo, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Jarjestaja from "../components/Jarjestaja";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { parseLupa } from "../../../../utils/lupaParser";
import HakemusContainer from "../Hakemukset/HakemusContainer";
import { useLupa } from "../../../../stores/lupa";
import { isEmpty } from "ramda";
import Loading from "../../../../modules/Loading";
import { prop } from "ramda";

const JarjestajaSwitch = React.memo(({ history, path, user, ytunnus }) => {
  const intl = useIntl();

  const [lupa, lupaActions] = useLupa();

  // Let's fetch LUPA
  useEffect(() => {
    let abortController;
    if (ytunnus) {
      abortController = lupaActions.load(ytunnus);
    }
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [lupaActions, ytunnus, user]);

  const lupaKohteet = useMemo(() => {
    return !lupa.data ? {} : parseLupa({ ...lupa.data }, intl.formatMessage);
  }, [lupa.data, intl.formatMessage]);

  return (
    <Switch>
      <Route
        exact
        path={`${path}/hakemukset-ja-paatokset/uusi/:page`}
        render={props => {
          if (!isEmpty(lupaKohteet) && lupa.fetchedAt) {
            return (
              <HakemusContainer
                history={history}
                lupaKohteet={lupaKohteet}
                lupa={lupa.data}
                match={props.match}
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
          if (lupaKohteet && lupa.fetchedAt) {
            return (
              <HakemusContainer
                history={history}
                lupaKohteet={lupaKohteet}
                lupa={lupa.data}
                match={props.match}
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
            lupa.isLoading !== true &&
            ytunnus === prop("ytunnus", lupa.keyParams) &&
            !isEmpty(lupaKohteet)
          ) {
            return (
              <Jarjestaja
                lupaKohteet={lupaKohteet}
                lupa={lupa.data}
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
  history: PropTypes.object,
  path: PropTypes.string,
  ytunnus: PropTypes.string,
  user: PropTypes.object
};

export default JarjestajaSwitch;
