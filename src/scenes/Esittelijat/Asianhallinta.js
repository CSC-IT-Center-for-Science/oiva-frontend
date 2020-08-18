import React, { useState } from "react";
import Asiat from "./components/Asiat";
import Asiakirjat from "./components/Asiakirjat";
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation
} from "react-router-dom";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import { useUser } from "../../stores/user";
import BaseData from "scenes/BaseData";
import { useIntl } from "react-intl";
import AsiaDialogContainer from "./AsiaDialogContainer";
import AvoimetAsiat from "./components/AvoimetAsiat";
import PaatetytAsiat from "./components/PaatetytAsiat";
import { Helmet } from "react-helmet";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { PropTypes } from "prop-types";
import common from "../../i18n/definitions/common";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import SimpleButton from "okm-frontend-components/dist/components/00-atoms/SimpleButton";
import UusiAsiaEsidialog from "./UusiAsiaEsidialog";
import Asialuettelo from "./Asialuettelo";
// import UusiAsiaEsidialog from "./../UusiAsiaEsidialog";

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

const Asianhallinta = () => {
  const intl = useIntl();
  const [user] = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isEsidialogVisible, setIsEsidialogVisible] = useState(false);

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{`Oiva | ${intl.formatMessage(common.asiat)}`}</title>
      </Helmet>

      {isEsidialogVisible && (
        <UusiAsiaEsidialog
          isVisible={isEsidialogVisible}
          onClose={() => setIsEsidialogVisible(false)}
          onSelect={
            selectedItem => {
              return null;
            }
            // history.push(`asiat/${selectedItem.value}/uusi`)
          }></UusiAsiaEsidialog>
      )}

      <div
        className="flex flex-col justify-end w-full h-40 mx-auto px-3 lg:px-8"
        style={{ maxWidth: "90rem", borderTop: "0.05rem solid #E3E3E3" }}>
        <div className="flex items-center">
          <div className="flex-1">
            <BreadcrumbsItem to="/">
              {intl.formatMessage(common.frontpage)}
            </BreadcrumbsItem>
            <BreadcrumbsItem to="/asiat">
              {intl.formatMessage(common.asiat)}
            </BreadcrumbsItem>
            <div className="w-full flex flex-row justify-between">
              <h1 className="mb-5">{intl.formatMessage(common.asiat)}</h1>
              <div className="pt-3 my-auto">
                <SimpleButton
                  aria-label={intl.formatMessage(common.luoUusiAsia)}
                  color="primary"
                  variant="contained"
                  text={intl.formatMessage(common.luoUusiAsia)}
                  size="large"
                  onClick={() => setIsEsidialogVisible(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Routes>
        <Route
          authenticated={!!user}
          path="luettelo/*"
          element={<Asialuettelo user={user} />}
        />
        <Route path="/" element={<Navigate to={"luettelo"} />} />
      </Routes>

      {/* <Route
        authenticated={!!user}
        // path={`${path}/:ytunnus/uusi`}
        render={() => (
          <BaseData
            locale={intl.locale}
            render={_props => <UusiAsiaDialogContainer {..._props} />}
          />
        )}
      />
      <Route
        authenticated={!!user}
        // path={`${path}/:ytunnus/:uuid`}
        render={() => {
          return (
            <BaseData
              locale={intl.locale}
              render={_props => <AsiaDialogContainer {..._props} />}
            />
          );
        }}
      /> */}
    </React.Fragment>
  );
};

export default Asianhallinta;
