import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { PropTypes } from "prop-types";
import PaatetytAsiat from "../PaatetytAsiat";
import { Route, useHistory, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import SimpleButton from "components/00-atoms/SimpleButton";
import UusiAsiaEsidialog from "../UusiAsiaEsidialog";
import { last, split } from "ramda";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import commonMessages from "../../../i18n/definitions/common";
import Typography from "@material-ui/core/Typography";
import BaseData from "basedata";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import { LocalizedSwitch } from "modules/i18n/index";
import AvoimetAsiat from "../AvoimetAsiat/index";

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
    marginTop: "0.3em"
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

const esidialoginHakuavaimet = ["organisaatiot"];

const Asiat = ({ koulutusmuoto, path, user }) => {
  const { formatMessage, locale } = useIntl();
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const avoimetUrl = localizeRouteKey(
    locale,
    AppRoute.AsianhallintaAvoimet,
    formatMessage,
    {
      koulutusmuoto: koulutusmuoto.kebabCase
    }
  );
  const paatetytUrl = localizeRouteKey(
    locale,
    AppRoute.AsianhallintaPaatetyt,
    formatMessage,
    {
      koulutusmuoto: koulutusmuoto.kebabCase
    }
  );

  const [isEsidialogVisible, setIsEsidialogVisible] = useState(false);
  const t = intl.formatMessage;

  const asianhallintaUrl = localizeRouteKey(
    locale,
    AppRoute.Asianhallinta,
    formatMessage,
    { koulutusmuoto: koulutusmuoto.kebabCase }
  );

  return (
    <React.Fragment>
      <BreadcrumbsItem to={asianhallintaUrl}>
        {intl.formatMessage(commonMessages.asianhallinta)}
      </BreadcrumbsItem>

      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{`Oiva | ${t(common.asiat)}`}</title>
      </Helmet>

      {isEsidialogVisible && (
        <BaseData
          keys={esidialoginHakuavaimet}
          locale={intl.locale}
          koulutustyyppi={koulutusmuoto.koulutustyyppi}
          render={_props => {
            return (
              <UusiAsiaEsidialog
                isVisible={isEsidialogVisible}
                onClose={() => setIsEsidialogVisible(false)}
                organisations={_props.organisaatiot}
                onSelect={selectedItem =>
                  history.push(
                    `/${koulutusmuoto.kebabCase}/asianhallinta/${selectedItem.value}/uusi/1`
                  )
                }
              ></UusiAsiaEsidialog>
            );
          }}
        />
      )}

      <div className="flex flex-col justify-end mx-auto w-4/5 max-w-8xl mt-12">
        <div className="flex items-center">
          <div className="flex-1">
            <Typography component="h1" variant="h1">
              {t(common.asianhallinta)}
            </Typography>
            <div className="w-full flex flex-row justify-between">
              <Typography
                component="h2"
                variant="h2"
                style={{ fontSize: "1.25rem", padding: 0, fontWeight: 400 }}
              >
                {koulutusmuoto.paasivunOtsikko}
              </Typography>
              <div>
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
              value={location.pathname}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, val) => {
                history.push(val);
              }}
            >
              <OivaTab
                label={t(common.asiatOpen)}
                aria-label={t(common.asiatReady)}
                to={avoimetUrl}
                value={avoimetUrl}
              />
              <OivaTab
                label={t(common.asiatReady)}
                aria-label={t(common.asiatReady)}
                to={paatetytUrl}
                value={paatetytUrl}
              />
            </OivaTabs>
          </div>
        </div>
      </div>

      <div className="flex-1 flex bg-gray-100 border-t border-solid border-gray-300">
        <div className="flex mx-auto w-4/5 max-w-8xl py-12">
          <div className="flex-1 bg-white">
            <LocalizedSwitch>
              <Route
                authenticated={!!user}
                params={{
                  koulutusmuoto: koulutusmuoto.kebabCase
                }}
                path={AppRoute.AsianhallintaAvoimet}
                render={() => <AvoimetAsiat koulutusmuoto={koulutusmuoto} />}
              />
              <Route
                authenticated={!!user}
                params={{
                  koulutusmuoto: koulutusmuoto.kebabCase
                }}
                path={AppRoute.AsianhallintaPaatetyt}
                render={() => <PaatetytAsiat koulutusmuoto={koulutusmuoto} />}
              />
            </LocalizedSwitch>
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
