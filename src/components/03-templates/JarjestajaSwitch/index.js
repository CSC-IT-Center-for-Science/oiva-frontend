import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { isEmpty, prop } from "ramda";
import Loading from "../../../modules/Loading";
import BaseData from "basedata";
import { parseLupa } from "utils/lupaParser";
import Jarjestaja from "components/03-templates/Jarjestaja";
import { parseVSTLupa } from "scenes/Koulutusmuodot/VapaaSivistystyo/utils/lupaParser";
import { AppRoute } from "const/index";

const JarjestajaSwitch = ({
  JarjestamislupaJSX,
  kohteet,
  koulutusmuoto,
  lupa,
  lupaUuid,
  organisation,
  user,
  tulevatLuvat,
  voimassaOlevaLupa,
  WizardContainer
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
      <Switch>
        <Route
          authenticated={!!user}
          exact
          path={AppRoute.UusiHakemus}
          render={() => (
            <BaseData
              locale={locale}
              koulutustyyppi={koulutusmuoto.koulutustyyppi}
              render={_props => {
                return (
                  <WizardContainer
                    kohteet={_props.kohteet}
                    koulutukset={_props.koulutukset}
                    koulutusalat={_props.koulutusalat}
                    koulutusmuoto={koulutusmuoto}
                    koulutustyypit={_props.koulutustyypit}
                    lisatiedot={_props.lisatiedot}
                    maaraystyypit={_props.maaraystyypit}
                    muut={_props.muut}
                    organisaatio={_props.organisaatio}
                    viimeisinLupa={_props.viimeisinLupa}
                    role="KJ"
                  />
                );
              }}
            />
          )}
        />
        <Route
          path="*"
          render={() => {
            /**
             * Varmistetaan, että ollaan aikeissa näyttää halutun järjestäjän
             * tiedot vertaamalla haussa käytettyä oid:a luvan
             * järjestäjän oid:iin, mikäli haussa käytettiin oid:a. Toinen
             * vaihtoehto on, että haku on tehty lupaUuid:llä, jolloin
             * vertaamme sitä luvan vastaavaan tietoon.
             * */
            if (
              (lupa &&
                organisation &&
                organisation.oid === prop("jarjestajaOid", lupa)) ||
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
                  user={user}
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
  JarjestamislupaJSX: PropTypes.func,
  kohteet: PropTypes.array,
  koulutusmuoto: PropTypes.object,
  lupa: PropTypes.object,
  lupaUuid: PropTypes.string,
  organisation: PropTypes.object,
  tulevatLuvat: PropTypes.array,
  user: PropTypes.object,
  voimassaOlevaLupa: PropTypes.object,
  WizardContainer: PropTypes.func
};

export default JarjestajaSwitch;
