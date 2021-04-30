import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { PropTypes } from "prop-types";
import KorjattavatAsiat from "../KorjattavatAsiat/index";
import PaatetytAsiat from "../PaatetytAsiat";
import { Route, useHistory, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import SimpleButton from "components/00-atoms/SimpleButton";
import UusiAsiaEsidialog from "../UusiAsiaEsidialog";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import commonMessages from "../../../i18n/definitions/common";
import Typography from "@material-ui/core/Typography";
import BaseData from "basedata";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import { LocalizedSwitch } from "modules/i18n/index";
import AvoimetAsiat from "../AvoimetAsiat/index";
import { includes, isEmpty, path, prop, startsWith } from "ramda";
import Asiakirjat from "components/02-organisms/Asiakirjat/index";
import { useMuutospyynnot } from "stores/muutospyynnot";
import Loading from "modules/Loading";

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

const Asiat = props => {
  const {
    koulutusmuoto,
    user,
    UusiAsiaEsidialog: ParametrinaAnnettuEsidialog
  } = props;
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const location = useLocation();
  const [muutospyynnot, muutospyynnotActions] = useMuutospyynnot();

  useEffect(() => {
    const isForced = includes("force=", location.search);
    let abortController = muutospyynnotActions.loadByStates(
      ["KORJAUKSESSA"],
      ["korjauksessa"],
      false,
      isForced,
      koulutusmuoto.koulutustyyppi
    );

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [koulutusmuoto.koulutustyyppi, location.search, muutospyynnotActions]);

  const avoimetPath = localizeRouteKey(
    locale,
    AppRoute.AsianhallintaAvoimet,
    formatMessage,
    {
      koulutusmuoto: koulutusmuoto.kebabCase
    }
  );
  const paatetytPath = localizeRouteKey(
    locale,
    AppRoute.AsianhallintaPaatetyt,
    formatMessage,
    {
      koulutusmuoto: koulutusmuoto.kebabCase
    }
  );
  const korjauksessaPath = localizeRouteKey(
    locale,
    AppRoute.AsianhallintaKorjattavat,
    formatMessage,
    {
      koulutusmuoto: koulutusmuoto.kebabCase
    }
  );

  const tabKey = startsWith(avoimetPath, location.pathname)
    ? avoimetPath
    : startsWith(paatetytPath, location.pathname)
    ? paatetytPath
    : startsWith(korjauksessaPath, location.pathname)
    ? korjauksessaPath
    : null;

  const [isEsidialogVisible, setIsEsidialogVisible] = useState(false);
  const t = formatMessage;

  const asianhallintaUrl = localizeRouteKey(
    locale,
    AppRoute.Asianhallinta,
    formatMessage,
    { koulutusmuoto: koulutusmuoto.kebabCase }
  );

  const korjauksessaOlevatAsiat = prop("korjauksessa", muutospyynnot);

  if (prop("fetchedAt", korjauksessaOlevatAsiat)) {
    return (
      <React.Fragment>
        <BreadcrumbsItem to={asianhallintaUrl}>
          {formatMessage(commonMessages.asianhallinta)}
        </BreadcrumbsItem>

        <Helmet htmlAttributes={{ lang: locale }}>
          <title>{`Oiva | ${t(common.asiat)}`}</title>
        </Helmet>

        {isEsidialogVisible && (
          <BaseData
            keys={esidialoginHakuavaimet}
            locale={locale}
            koulutustyyppi={koulutusmuoto.koulutustyyppi}
            render={_props => {
              // Voi olla, että esidialogi on annettu koulutusmuodon
              // tiedoissa (src/scenes/Koulutusmuodot/[koulutusmuoto]/index),
              // jolloin käytetään annettua esidialogia. Muutoin käytetään
              // koulutusmuodoille yhteistä esidialogia.
              return ParametrinaAnnettuEsidialog ? (
                <ParametrinaAnnettuEsidialog
                  isVisible={isEsidialogVisible}
                  koulutustyyppi={koulutusmuoto.koulutustyyppi}
                  onClose={() => setIsEsidialogVisible(false)}
                  organisations={_props.organisaatiot}
                  onSelect={(selectedItem, selectedLanguage) => {
                    const url = localizeRouteKey(
                      locale,
                      AppRoute.UusiHakemus,
                      formatMessage,
                      {
                        id: selectedItem.value,
                        koulutusmuoto: koulutusmuoto.kebabCase,
                        page: 1,
                        language: prop("value", selectedLanguage)
                      }
                    );
                    history.push(url);
                  }}
                ></ParametrinaAnnettuEsidialog>
              ) : (
                <UusiAsiaEsidialog
                  isVisible={isEsidialogVisible}
                  koulutustyyppi={koulutusmuoto.koulutustyyppi}
                  onClose={() => setIsEsidialogVisible(false)}
                  organisations={_props.organisaatiot}
                  onSelect={selectedItem =>
                    history.push(
                      localizeRouteKey(
                        locale,
                        AppRoute.UusiHakemus,
                        formatMessage,
                        {
                          id: selectedItem.value,
                          koulutusmuoto: koulutusmuoto.kebabCase,
                          page: 1,
                          language: "fi"
                        }
                      )
                    )
                  }
                ></UusiAsiaEsidialog>
              );
            }}
          />
        )}

        <LocalizedSwitch>
          {!tabKey && (
            <Route
              path={AppRoute.Asia}
              render={() => <Asiakirjat koulutusmuoto={koulutusmuoto} />}
            />
          )}
          <Route path="*">
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
                      style={{
                        fontSize: "1.25rem",
                        padding: 0,
                        fontWeight: 400
                      }}
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
                    value={tabKey}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, val) => {
                      history.push(val);
                    }}
                  >
                    <OivaTab
                      label={t(common.asiatOpen)}
                      aria-label={t(common.asiatReady)}
                      to={avoimetPath}
                      value={avoimetPath}
                    />
                    <OivaTab
                      label={t(common.asiatReady)}
                      aria-label={t(common.asiatReady)}
                      to={paatetytPath}
                      value={paatetytPath}
                    />
                    {!isEmpty(
                      path(["korjauksessa", "data"], muutospyynnot)
                    ) && (
                      <OivaTab
                        label={t(common.asiatKorjauksessa)}
                        aria-label={t(common.asiatKorjauksessa)}
                        to={korjauksessaPath}
                        value={korjauksessaPath}
                      />
                    )}
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
                      path={AppRoute.AsianhallintaAvoimet}
                      render={() => (
                        <AvoimetAsiat koulutusmuoto={koulutusmuoto} />
                      )}
                    />
                    <Route
                      authenticated={!!user}
                      path={AppRoute.AsianhallintaPaatetyt}
                      render={() => (
                        <PaatetytAsiat koulutusmuoto={koulutusmuoto} />
                      )}
                    />
                    <Route
                      authenticated={!!user}
                      path={AppRoute.AsianhallintaKorjattavat}
                      render={() => (
                        <KorjattavatAsiat
                          korjauksessaOlevatAsiat={korjauksessaOlevatAsiat}
                          koulutusmuoto={koulutusmuoto}
                        />
                      )}
                    />
                  </LocalizedSwitch>
                </div>
              </div>
            </div>
          </Route>
        </LocalizedSwitch>
      </React.Fragment>
    );
  } else {
    return <Loading />;
  }
};

Asiat.propTypes = {
  user: PropTypes.object
};

export default Asiat;
