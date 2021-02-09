import React from "react";
import { useUser } from "../../../stores/user";
import { Route, useRouteMatch } from "react-router-dom";
import { useIntl } from "react-intl";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import BaseData from "basedata";
import Asiakirjat from "components/02-organisms/Asiakirjat";
import { MuutoksetContainer } from "stores/muutokset";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import { LocalizedSwitch } from "modules/i18n/index";
import Asiat from "../Asiat/index";

const Esittelijat = ({ koulutusmuoto, WizardContainer }) => {
  const { formatMessage, locale } = useIntl();
  const { path } = useRouteMatch();
  const [user] = useUser();

  const koulutusmuotoUrl = localizeRouteKey(
    locale,
    AppRoute[koulutusmuoto.pascalCase],
    formatMessage
  );

  return (
    <React.Fragment>
      <BreadcrumbsItem to={koulutusmuotoUrl}>
        {koulutusmuoto.kortinOtsikko}
      </BreadcrumbsItem>

      <article className="flex-1 flex-col flex">
        <LocalizedSwitch>
          <Route
            authenticated={!!user}
            exact
            path={AppRoute.AsianhallintaAvoimet}
            render={() => (
              <Asiat koulutusmuoto={koulutusmuoto} path={path} user={user} />
            )}
          />
          <Route
            authenticated={!!user}
            exact
            path={AppRoute.AsianhallintaPaatetyt}
            render={() => (
              <Asiat koulutusmuoto={koulutusmuoto} path={path} user={user} />
            )}
          />
          {/* <Route
            authenticated={!!user}
            exact
            path={`${path}/:uuid`}
            render={() => <Asiakirjat koulutusmuoto={koulutusmuoto} />}
          /> */}
          <Route
            authenticated={!!user}
            exact
            path={AppRoute.UusiHakemusPath}
            render={() => (
              <BaseData
                locale={locale}
                koulutustyyppi={koulutusmuoto.koulutustyyppi}
                render={_props => {
                  console.info(_props, "_props");
                  return (
                    <MuutoksetContainer>
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
          {/* <Route
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
          /> */}
          <Route path="*">
            <div>Asianhallintapuolen oletuspolku</div>
          </Route>
        </LocalizedSwitch>
      </article>
    </React.Fragment>
  );
};

export default Esittelijat;
