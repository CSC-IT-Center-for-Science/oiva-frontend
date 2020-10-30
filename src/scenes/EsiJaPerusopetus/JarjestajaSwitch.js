import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";
import Loading from "../../modules/Loading";
import BaseData from "basedata";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import education from "../../i18n/definitions/education";

const JarjestajaSwitch = ({ lupa, path }) => {
  const intl = useIntl();

  const lupaKohteet = useMemo(() => {
    return !lupa
      ? {}
      : parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase());
  }, [lupa, intl]);

  return (
    <React.Fragment>
      <BreadcrumbsItem to="/esi-ja-perusopetus">
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
      </Switch>
    </React.Fragment>
  );
};

JarjestajaSwitch.propTypes = {
  path: PropTypes.string,
  ytunnus: PropTypes.string,
  user: PropTypes.object
};

export default JarjestajaSwitch;
