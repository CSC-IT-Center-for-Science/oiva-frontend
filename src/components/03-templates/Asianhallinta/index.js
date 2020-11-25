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
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Esittelijat from "../Esittelijat/index";

const Asianhallinta = ({
  AsiaDialogContainer,
  koulutusmuoto,
  paasivunOtsikko,
  UusiAsiaDialogContainer
}) => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();

  return (
    <React.Fragment>
      <BreadcrumbsItem to={`/${koulutusmuoto.kebabCase}`}>
        {paasivunOtsikko}
      </BreadcrumbsItem>
      {location.pathname === "/asianhallinta" ? (
        <div className="flex-1 bg-gray-100">
          <div className="border border-gray-300 max-w-7xl m-auto bg-white mt-12 px-64 py-12">
            <h1>{intl.formatMessage(common.asianhallinta)}</h1>
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
          <Route
            path={`/${koulutusmuoto.kebabCase}/asianhallinta`}
            render={() => (
              <Esittelijat
                AsiaDialogContainer={AsiaDialogContainer}
                koulutusmuoto={koulutusmuoto}
                paasivunOtsikko={paasivunOtsikko}
                UusiAsiaDialogContainer={UusiAsiaDialogContainer}
              />
            )}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default Asianhallinta;
