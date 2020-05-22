import React from "react";
import Asiat from "./components/Asiat";
import Asiakirjat from "./components/Asiakirjat";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import { useUser } from "../../stores/user";

const Esittelijat = React.memo(() => {
  const { path } = useRouteMatch();
  const { user } = useUser();

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
        render={() => <UusiAsiaDialogContainer />}
      />
      <Route
        authenticated={!!user}
        exact
        path={`${path}/:ytunnus/:uuid`}
        render={() => <UusiAsiaDialogContainer />}
      />
    </Switch>
  );
});

export default Esittelijat;
