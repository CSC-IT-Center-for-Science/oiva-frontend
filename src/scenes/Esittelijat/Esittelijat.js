import React from "react";
import Asiat from "./components/Asiat";
import Asiakirjat from "./components/Asiakirjat";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import { useUser } from "../../stores/user";
import BaseData from "scenes/BaseData";
import { useIntl } from "react-intl";
import AsiaDialogContainer from "./AsiaDialogContainer";

const Esittelijat = () => {
  const intl = useIntl();
  const { path } = useRouteMatch();
  const [user] = useUser();

  return (
    <Switch>
      <Route
        authenticated={!!user}
        exact
        path={`${path}`}
        render={() => <Asiat path={path} user={user} />}
      />
      <Route
        authenticated={!!user}
        exact
        path={`${path}/paatetyt`}
        render={() => <Asiat path={path} user={user} />}
      />
      <Route
        authenticated={!!user}
        exact
        path={`${path}/:uuid`}
        render={() => <Asiakirjat />}
      />
      <Route
        authenticated={!!user}
        exact
        path={`${path}/:ytunnus/uusi`}
        render={() => (
          <BaseData
            locale={intl.locale}
            render={_props => <UusiAsiaDialogContainer {..._props} />}
          />
        )}
      />
      <Route
        authenticated={!!user}
        exact
        path={`${path}/:ytunnus/:uuid`}
        render={() => {
          return (
            <BaseData
              locale={intl.locale}
              render={_props => <AsiaDialogContainer {..._props} />}
            />
          );
        }}
      />
    </Switch>
  );
};

export default Esittelijat;
