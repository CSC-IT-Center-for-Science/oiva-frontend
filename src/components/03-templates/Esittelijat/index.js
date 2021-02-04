import React from "react";
import { useUser } from "../../../stores/user";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useIntl } from "react-intl";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import BaseData from "basedata";
import Asiat from "../Asiat";
import Asiakirjat from "components/02-organisms/Asiakirjat";
import { MuutoksetContainer } from "stores/muutokset";

const Esittelijat = ({ koulutusmuoto, WizardContainer }) => {
  const { locale } = useIntl();
  const { path } = useRouteMatch();
  const [user] = useUser();

  return (
    <React.Fragment>
      <BreadcrumbsItem to={`/${koulutusmuoto.kebabCase}`}>
        {koulutusmuoto.kortinOtsikko}
      </BreadcrumbsItem>

      <article className="flex-1 flex-col flex">
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
            path={`${path}/:id/uusi/:page?`}
            render={() => (
              <BaseData
                locale={locale}
                koulutustyyppi={koulutusmuoto.koulutustyyppi}
                render={_props => {
                  return (
                    <MuutoksetContainer>
                      {/* UusiAsiaDialogContainer */}
                      <WizardContainer
                        kohteet={_props.kohteet}
                        koulutukset={_props.koulutukset}
                        koulutusalat={_props.koulutusalat}
                        koulutustyypit={_props.koulutustyypit}
                        lisatiedot={_props.lisatiedot}
                        maaraystyypit={_props.maaraystyypit}
                        muut={_props.muut}
                        opetuskielet={_props.opetuskielet}
                        organisaatio={_props.organisaatio}
                        role={"ESITTELIJA"}
                        viimeisinLupa={_props.viimeisinLupa}
                      />
                    </MuutoksetContainer>
                  );
                }}
              />
            )}
          />
          <Route
            authenticated={!!user}
            exact
            path={`${path}/:id/:uuid/:page?`}
            render={() => {
              return (
                <BaseData
                  locale={locale}
                  koulutustyyppi={koulutusmuoto.koulutustyyppi}
                  render={_props => {
                    return (
                      <MuutoksetContainer>
                        {/* AsiaDialogContainer */}
                        <WizardContainer
                          kohteet={_props.kohteet}
                          koulutukset={_props.koulutukset}
                          koulutusalat={_props.koulutusalat}
                          koulutustyypit={_props.koulutustyypit}
                          lisatiedot={_props.lisatiedot}
                          maaraystyypit={_props.maaraystyypit}
                          muut={_props.muut}
                          opetuskielet={_props.opetuskielet}
                          organisaatio={_props.organisaatio}
                          role={"ESITTELIJA"}
                          viimeisinLupa={_props.viimeisinLupa}
                        />
                      </MuutoksetContainer>
                    );
                  }}
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
