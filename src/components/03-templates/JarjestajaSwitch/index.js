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

const JarjestajaSwitch = ({
  JarjestamislupaJSX,
  koulutusmuoto,
  lupa,
  lupaUuid,
  organisation,
  path,
  user,
  ytunnus,
  kielet,
  tulevatLuvat,
  voimassaOlevaLupa
}) => {
  const intl = useIntl();

  /**
   * Vapaan sivistystyön luvat täytyy parsia eri tavalla. Siksi tämä ehto.
   */
  const parseLupaFn =
    lupa && lupa.koulutustyyppi === "3" ? parseVSTLupa : parseLupa;

  const lupakohteet = useMemo(() => {
    return !lupa
      ? {}
      : parseLupaFn({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase());
  }, [lupa, intl, parseLupaFn]);

  return (
    <React.Fragment>
      <BreadcrumbsItem to={`/${koulutusmuoto.kebabCase}`}>
        {koulutusmuoto.sivunOtsikko}
      </BreadcrumbsItem>
      <Switch>
        <Route
          exact
          path={`${path}/hakemukset-ja-paatokset/uusi/:page`}
          render={props => {
            if (!isEmpty(lupakohteet) && lupa) {
              return (
                <BaseData
                  locale={intl.locale}
                  render={_props => (
                    <div>TODO: Avataan uusi tyhjä KJ-puolen lomake</div>
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
            if (lupakohteet && lupa) {
              return (
                <BaseData
                  locale={intl.locale}
                  render={_props => <div>TODO: Avataan KJ-puolen lomake</div>}
                />
              );
            }
            return <Loading />;
          }}
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
