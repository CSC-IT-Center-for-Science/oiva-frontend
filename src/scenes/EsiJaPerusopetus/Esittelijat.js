import React from "react";
import { useUser } from "../../stores/user";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useIntl } from "react-intl";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { Typography } from "@material-ui/core";

import BaseData from "basedata";
import Asiat from "./Asiat";
import Asiakirjat from "components/02-organisms/Asiakirjat";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import AsiaDialogContainer from "./AsiaDialogContainer";

import commonMessages from "../../i18n/definitions/common";
import educationMessages from "../../i18n/definitions/education";
import { MuutoksetContainer } from "../AmmatillinenKoulutus/store";
import { koulutustyypitMap } from "utils/constants";

const Esittelijat = () => {
  const { formatMessage, locale } = useIntl();
  const { path } = useRouteMatch();
  const [user] = useUser();
  const scope = "po-esittelijan-lupanakyma";

  return (
    <React.Fragment>
      <BreadcrumbsItem to="/esi-ja-perusopetus/asianhallinta/avoimet">
        {formatMessage(commonMessages.asianhallinta)}
      </BreadcrumbsItem>

      <article className="px-16">
        <Typography component="h1" variant="h1">
          {formatMessage(commonMessages.asianhallinta)}
        </Typography>
        <Typography
          component="h2"
          style={{ fontSize: "1.25rem" }}
          className="pb-4 mt--12">
          {formatMessage(educationMessages.preAndBasicEducation)}
        </Typography>

        <Switch>
          <Route
            authenticated={!!user}
            exact
            path={`${path}/avoimet`}
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
            render={() => <Asiakirjat koulutustyyppi={"esi-ja-perusopetus"} />}
          />
          <Route
            authenticated={!!user}
            exact
            path={`${path}/:id/uusi`}
            render={() => (
              <BaseData
                locale={locale}
                koulutustyyppi={koulutustyypitMap.ESI_JA_PERUSOPETUS}
                render={_props => (
                  <MuutoksetContainer scope={scope}>
                    <UusiAsiaDialogContainer {..._props} />
                  </MuutoksetContainer>
                )}
              />
            )}
          />
          <Route
            authenticated={!!user}
            exact
            path={`${path}/:id/:uuid`}
            render={() => {
              return (
                <BaseData
                  locale={locale}
                  koulutustyyppi={koulutustyypitMap.ESI_JA_PERUSOPETUS}
                  render={_props => (
                    <MuutoksetContainer scope={scope}>
                      <AsiaDialogContainer {..._props} />
                    </MuutoksetContainer>
                  )}
                />
              );
            }}
          />
        </Switch>
      </article>
    </React.Fragment>
  );
};

export default Esittelijat;
