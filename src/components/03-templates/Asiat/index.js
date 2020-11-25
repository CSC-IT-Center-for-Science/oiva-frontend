import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { PropTypes } from "prop-types";
import AvoimetAsiat from "../AvoimetAsiat";
import PaatetytAsiat from "../PaatetytAsiat";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import SimpleButton from "components/00-atoms/SimpleButton";
import UusiAsiaEsidialog from "../UusiAsiaEsidialog";
import { last, split } from "ramda";
import { Typography } from "@material-ui/core";

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

const Asiat = ({ koulutusmuoto, path, user }) => {
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
            history.push(
              `/${koulutusmuoto.kebabCase}/asianhallinta/${selectedItem.value}/uusi`
            )
          }></UusiAsiaEsidialog>
      )}

      <div className="flex flex-col justify-end h-40 mx-auto w-4/5">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="w-full flex flex-row justify-between">
              <Typography component="h2" variant="h2">{t(common.asiat)}</Typography>
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

      <div className="flex-1 flex bg-gray-100 border-t border-solid border-gray-300">
        <div className="flex mx-auto w-4/5 py-12">
          <div className="flex-1 bg-white">
            <Switch>
              <Route
                authenticated={!!user}
                path={`${path}/avoimet`}
                render={() => <AvoimetAsiat koulutusmuoto={koulutusmuoto} />}
              />
              <Route
                authenticated={!!user}
                path={`${path}/paatetyt`}
                render={() => <PaatetytAsiat koulutusmuoto={koulutusmuoto} />}
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
