import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { isEmpty, prop } from "ramda";
import Loading from "../../../modules/Loading";
import BaseData from "basedata";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { parseLupa } from "utils/lupaParser";
import Jarjestaja from "components/03-templates/Jarjestaja";
import { parseVSTLupa } from "scenes/Koulutusmuodot/VapaaSivistystyo/utils/lupaParser";
import { MuutoksetContainer } from "stores/muutokset";

const JarjestajaSwitch = ({
  JarjestamislupaJSX,
  kohteet,
  koulutusmuoto,
  lupa,
  lupaUuid,
  organisation,
  path,
  user,
  ytunnus,
  kielet,
  tulevatLuvat,
  UusiAsiaDialogContainer,
  voimassaOlevaLupa
}) => {
  const { formatMessage, locale } = useIntl();

  /**
   * Vapaan sivistystyön luvat täytyy parsia eri tavalla. Siksi tämä ehto.
   */
  const parseLupaFn =
    lupa && lupa.koulutustyyppi === "3" ? parseVSTLupa : parseLupa;

  const lupakohteet = useMemo(() => {
    return !lupa
      ? {}
      : parseLupaFn({ ...lupa }, formatMessage, locale.toUpperCase());
  }, [lupa, formatMessage, locale, parseLupaFn]);

  return (
    <React.Fragment>
      <BreadcrumbsItem to={`/${koulutusmuoto.kebabCase}`}>
        {koulutusmuoto.paasivunOtsikko}
      </BreadcrumbsItem>
      <Switch>
        <Route
          authenticated={!!user}
          exact
          path={`${path}/hakemukset-ja-paatokset/uusi/:page`}
          render={() => (
            <BaseData
              locale={locale}
              koulutustyyppi={koulutusmuoto.koulutustyyppi}
              render={_props => {
                return (
                  <UusiAsiaDialogContainer
                    kohteet={_props.kohteet}
                    koulutukset={_props.koulutukset}
                    koulutusalat={_props.koulutusalat}
                    koulutustyypit={_props.koulutustyypit}
                    lisatiedot={_props.lisatiedot}
                    maaraystyypit={_props.maaraystyypit}
                    muut={_props.muut}
                    opetuskielet={_props.opetuskielet}
                    organisaatio={_props.organisaatio}
                    viimeisinLupa={_props.viimeisinLupa}
                  />
                );
              }}
            />
          )}
        />
        <Route
          path={`${path}`}
          render={props => {
            /**
             * Varmistetaan, että ollaan aikeissa näyttää halutun järjestäjän
             * tiedot vertaamalla haussa käytettyä y-tunnusta luvan
             * y-tunnukseen, mikäli haussa käytettiin y-tunnusta. Toinen
             * vaihtoehto on, että haku on tehty lupaUuid:llä, jolloin
             * vertaamme sitä luvan vastaavaan tietoon.
             * */
            if (
              (lupa &&
                ytunnus &&
                ytunnus === prop("jarjestajaYtunnus", lupa)) ||
              (lupaUuid &&
                lupaUuid === prop("uuid", lupa) &&
                !isEmpty(lupakohteet))
            ) {
              return (
                <Jarjestaja
                  JarjestamislupaJSX={JarjestamislupaJSX}
                  kohteet={kohteet}
                  koulutusmuoto={koulutusmuoto}
                  lupakohteet={lupakohteet}
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
  path: PropTypes.string,
  user: PropTypes.object
};

export default JarjestajaSwitch;
