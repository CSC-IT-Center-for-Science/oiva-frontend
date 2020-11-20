import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { isEmpty, prop } from "ramda";
import Loading from "../../../modules/Loading";
import BaseData from "basedata";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import education from "../../../i18n/definitions/education";
import { parseLupa } from "utils/lupaParser";
import Jarjestaja from "components/03-templates/Jarjestaja";

const JarjestajaSwitch = ({
  JarjestamislupaJSX,
  koulutusmuoto,
  lupa,
  organisation,
  path,
  user,
  ytunnus,
  kielet,
  tulevatLuvat,
  voimassaOlevaLupa
}) => {
  const intl = useIntl();

  const lupaKohteet = useMemo(() => {
    return !lupa
      ? {}
      : parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase());
  }, [lupa, intl]);

  return (
    <React.Fragment>
      <BreadcrumbsItem to={`/${koulutusmuoto.kebabCase}`}>
        {intl.formatMessage(education.preAndBasicEducation)}
      </BreadcrumbsItem>
      <Switch>
        <Route
          exact
          path={`${path}/hakemukset-ja-paatokset/uusi/:page`}
          render={props => {
            if (!isEmpty(lupaKohteet) && lupa) {
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
            if (lupaKohteet && lupa) {
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
            if (
              lupa &&
              ytunnus === prop("jarjestajaYtunnus", lupa) &&
              !isEmpty(lupaKohteet)
            ) {
              return (
                <Jarjestaja
                  JarjestamislupaJSX={JarjestamislupaJSX}
                  lupakohteet={lupaKohteet}
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
