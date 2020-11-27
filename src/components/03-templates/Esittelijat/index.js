import React from "react";
import { useUser } from "../../../stores/user";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useIntl } from "react-intl";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { Typography } from "@material-ui/core";
import BaseData from "basedata";
import Asiat from "../Asiat";
import Asiakirjat from "components/02-organisms/Asiakirjat";
import commonMessages from "i18n/definitions/common";
import { MuutoksetContainer } from "../../../stores/muutokset";

const Esittelijat = ({
  AsiaDialogContainer,
  koulutusmuoto,
  paasivunOtsikko,
  UusiAsiaDialogContainer
}) => {
  const { formatMessage, locale } = useIntl();
  const { path } = useRouteMatch();
  const [user] = useUser();
  const scope = "esittelijan-lupanakyma";

  return (
    <React.Fragment>
      <BreadcrumbsItem to={`/${koulutusmuoto.kebabCase}/asianhallinta/avoimet`}>
        {formatMessage(commonMessages.asiat) + " " + koulutusmuoto.kortinOtsikko}
      </BreadcrumbsItem>

      <article className="flex-1 flex-col flex">
        <div className="mx-auto w-4/5">
          <Typography component="h1" variant="h1">
            {formatMessage(commonMessages.asiat)}
          </Typography>
          <Typography
            component="h2"
            style={{ fontSize: "1.25rem" }}
            className="pb-4 mt--12">
            {koulutusmuoto.kortinOtsikko}
          </Typography>
        </div>

        <Switch>
          <Route
            authenticated={!!user}
            exact
            path={`${path}/avoimet`}
            render={() => (
              <Asiat koulutusmuoto={koulutusmuoto} path={path} user={user} />
            )}
          />
          <Route
            authenticated={!!user}
            exact
            path={`${path}/paatetyt`}
            render={() => (
              <Asiat koulutusmuoto={koulutusmuoto} path={path} user={user} />
            )}
          />
          <Route
            authenticated={!!user}
            exact
            path={`${path}/:uuid`}
            render={() => <Asiakirjat koulutusmuoto={koulutusmuoto} />}
          />
          <Route
            authenticated={!!user}
            exact
            path={`${path}/:id/uusi`}
            render={() => (
              <BaseData
                locale={locale}
                koulutustyyppi={koulutusmuoto.koulutustyyppi}
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
                  koulutustyyppi={koulutusmuoto.koulutustyyppi}
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
