import React from "react";
import { useIntl } from "react-intl";
import {
  NavLink,
  Route,
  Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import common from "../../../i18n/definitions/common";
import education from "../../../i18n/definitions/education";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Esittelijat from "../Esittelijat/index";
import { Typography } from "@material-ui/core";
import { ROLE_ESITTELIJA } from "modules/constants";

const Asianhallinta = ({
  AsiaDialogContainer,
  koulutusmuoto,
  UusiAsiaDialogContainer
}) => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();

  return (
    <React.Fragment>
      {location.pathname === "/asianhallinta" ? (
        <div className="flex-1 bg-gray-100">
          <div className="border border-gray-300 max-w-7xl m-auto bg-white mt-12 px-64 py-12">
            <Typography component="h1" variant="h1">
              {intl.formatMessage(common.asianhallinta)}
            </Typography>
            <p>{intl.formatMessage(common.asianhallintaInfoText)}</p>
            <div className="grid grid-cols-3 gap-4 justify-items-auto pt-12">
              <NavLink
                className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                to={"/asianhallinta/esijaperusopetus"}
                exact={true}
                style={{ textDecoration: "none", color: "inherit" }}>
                {intl.formatMessage(education.preAndBasicEducation)}
                <ArrowForwardIcon className="ml-4" />
              </NavLink>
              <NavLink
                className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                to={"/asianhallinta/lukio"}
                exact={true}
                style={{ textDecoration: "none", color: "inherit" }}>
                {intl.formatMessage(education.highSchoolEducation)}
                <ArrowForwardIcon className="ml-4" />
              </NavLink>
              <NavLink
                className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                to={"/asianhallinta/ammatillinen"}
                exact={true}
                style={{ textDecoration: "none", color: "inherit" }}>
                {intl.formatMessage(education.vocationalEducation)}
                <ArrowForwardIcon className="ml-4" />
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}

      <Router history={history}>
        <Switch>
          {sessionStorage.getItem("role") === ROLE_ESITTELIJA ? (
          <Route
            path={`/${koulutusmuoto.kebabCase}/asianhallinta`}
            render={() => (
              <Esittelijat
                AsiaDialogContainer={AsiaDialogContainer}
                koulutusmuoto={koulutusmuoto}
                UusiAsiaDialogContainer={UusiAsiaDialogContainer}
              />
            )}
          />) : null}
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default Asianhallinta;
