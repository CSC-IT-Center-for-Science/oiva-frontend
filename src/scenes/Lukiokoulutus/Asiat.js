import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { PropTypes } from "prop-types";
import AvoimetAsiat from "../AmmatillinenKoulutus/AvoimetAsiat";
import PaatetytAsiat from "../AmmatillinenKoulutus/PaatetytAsiat";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import common from "../../i18n/definitions/common";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import SimpleButton from "okm-frontend-components/dist/components/00-atoms/SimpleButton";
import UusiAsiaEsidialog from "../AmmatillinenKoulutus/UusiAsiaEsidialog";
import { last, split } from "ramda";

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

const Asiat = ({ path, user }) => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const tabKey = last(split("/", location.pathname));

  const [isEsidialogVisible, setIsEsidialogVisible] = useState(false);
  const t = intl.formatMessage;

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{`Oiva | ${t(common.asiat)}`}</title>
      </Helmet>

      {isEsidialogVisible && (
        <UusiAsiaEsidialog
          isVisible={isEsidialogVisible}
          onClose={() => setIsEsidialogVisible(false)}
          onSelect={selectedItem =>
            history.push(`/asiat/${selectedItem.value}/uusi`)
          }></UusiAsiaEsidialog>
      )}

      <div
        className="flex flex-col justify-end w-full h-40 mx-auto"
        style={{ maxWidth: "90rem", borderTop: "0.05rem solid #E3E3E3" }}>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="w-full flex flex-row justify-between">
              <h1 className="mb-5">{t(common.asiat)}</h1>
              <div className="pt-3 my-auto">
                <SimpleButton
                  aria-label={t(common.luoUusiAsia)}
                  color="primary"
                  variant="contained"
                  text={t(common.luoUusiAsia)}
                  size="large"
                  onClick={() => setIsEsidialogVisible(true)}
                />
              </div>
            </div>
            <OivaTabs
              value={tabKey}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, val) => {
                history.push(val);
              }}>
              <OivaTab
                label={t(common.asiatOpen)}
                aria-label={t(common.asiatReady)}
                to={"avoimet"}
                value={"avoimet"}
              />
              <OivaTab
                label={t(common.asiatReady)}
                aria-label={t(common.asiatReady)}
                to={"paatetyt"}
                value={"paatetyt"}
              />
            </OivaTabs>
          </div>
        </div>
      </div>

      <div
        className="flex-1 flex w-full"
        style={{ borderTop: "0.05rem solid #E3E3E3" }}>
        <div className="flex-1 flex flex-col w-full mx-auto py-12">
          <div
            className="flex-1 bg-white"
            style={{ border: "0.05rem solid #E3E3E3" }}>
            <Switch>
              <Route
                authenticated={!!user}
                path={`${path}/avoimet`}
                render={() => <AvoimetAsiat />}
              />
              <Route
                authenticated={!!user}
                path={`${path}/paatetyt`}
                render={() => <PaatetytAsiat />}
              />
            </Switch>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

Asiat.propTypes = {
  path: PropTypes.string,
  user: PropTypes.object
};

export default Asiat;
