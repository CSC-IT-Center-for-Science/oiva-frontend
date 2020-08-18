import React from "react";
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation
} from "react-router-dom";
import { useUser } from "../../stores/user";
import { useIntl } from "react-intl";
import AvoimetAsiat from "./components/AvoimetAsiat";
import PaatetytAsiat from "./components/PaatetytAsiat";
import common from "../../i18n/definitions/common";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import Asiakirjat from "./components/Asiakirjat";

const OivaTab = withStyles(theme => ({
  root: {
    minWidth: 0,
    textTransform: "none",
    color: "#333 !important",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    padding: 0,
    marginRight: "2rem",
    marginLeft: "0.3em",
    marginTop: "0.3em",
    "&:focus": {
      outline: "0.2rem solid #d1d1d1"
    }
  }
}))(props => <Tab {...props} />);

const OivaTabs = withStyles(() => ({
  root: {},
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: "0.3rem !important",
    "& > div": {
      width: "100%",
      backgroundColor: "#4C7A61"
    }
  }
}))(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const Asialuettelo = () => {
  const intl = useIntl();
  const [user] = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div
        className="flex flex-col justify-end w-full mx-auto px-3 lg:px-8"
        style={{ maxWidth: "90rem" }}>
        <div className="flex items-center">
          {(pathname === "/asiat/luettelo/avoimet" ||
            pathname === "/asiat/luettelo/paatetyt") && (
            <OivaTabs
              value={pathname}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, path) => navigate(path)}>
              <OivaTab
                label={intl.formatMessage(common.asiatOpen)}
                aria-label={intl.formatMessage(common.asiatReady)}
                to={"avoimet"}
                value={"/asiat/luettelo/avoimet"}
              />
              <OivaTab
                label={intl.formatMessage(common.asiatReady)}
                aria-label={intl.formatMessage(common.asiatReady)}
                to={"paatetyt"}
                value={"/asiat/luettelo/paatetyt"}
              />
            </OivaTabs>
          )}
        </div>
      </div>

      <div
        className="flex-1 flex w-full bg-gray-100"
        style={{ borderTop: "0.05rem solid #E3E3E3" }}>
        <div
          style={{ maxWidth: "90rem" }}
          className="flex-1 flex flex-col w-full mx-auto px-3 lg:px-8 py-12">
          <div
            className="flex-1 bg-white"
            style={{ border: "0.05rem solid #E3E3E3" }}>
            <Routes>
              <Route
                authenticated={!!user}
                path="avoimet"
                element={<AvoimetAsiat user={user} />}
              />
              <Route
                authenticated={!!user}
                path="paatetyt"
                element={<PaatetytAsiat user={user} />}
              />
              <Route
                authenticated={!!user}
                path=":uuid"
                element={<Asiakirjat />}
              />
              <Route path="/" element={<Navigate to={"avoimet"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Asialuettelo;
