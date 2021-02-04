import React from "react";
import { Helmet } from "react-helmet";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import homepage from "i18n/definitions/homepage";
import TilastotCard from "scenes/Tilastot/TilastotCard";
import { addIndex, map, values } from "ramda";
import Koulutusmuotokortti from "components/03-templates/Koulutusmuotokortti";
import { getKoulutusmuodot, localizeRouteKey } from "utils/common";
import { LocalizedRouter } from "modules/i18n";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppLanguage, AppRoute } from "const/index";
import { AppLayout } from "modules/layout";
import { LocalizedSwitch } from "modules/i18n/index";
import { Navigation } from "modules/navigation";

// Koulutusmuodot
import AmmatillinenKoulutus from "scenes/Koulutusmuodot/AmmatillinenKoulutus/index";
import EsiJaPerusopetus from "scenes/Koulutusmuodot/EsiJaPerusopetus/index";
import VapaaSivistystyo from "scenes/Koulutusmuodot/VapaaSivistystyo/index";
import Lukio from "scenes/Koulutusmuodot/Lukiokoulutus/index";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";

const JarjestamisJaYllapitamisluvat = ({
  localesByLang,
  organisation,
  user
}) => {
  const { formatMessage, locale } = useIntl();

  const koulutusmuodot = getKoulutusmuodot(formatMessage);

  return (
    <React.Fragment>
      <BreadcrumbsItem
        to={localizeRouteKey(
          locale,
          AppRoute.JarjestamisJaYllapitamisluvat,
          formatMessage
        )}
      >
        {formatMessage(common.jarjestamisJaYllapitamisluvat)}
      </BreadcrumbsItem>
      <LocalizedSwitch>
        <Route path={AppRoute.EsiJaPerusopetus}>
          <EsiJaPerusopetus />
        </Route>
        <Route path={AppRoute.Lukiokoulutus}>
          <Lukio />
        </Route>
        <Route path={AppRoute.AmmatillinenKoulutus}>
          <AmmatillinenKoulutus />
        </Route>
        <Route path={AppRoute.VapaaSivistystyo}>
          <VapaaSivistystyo />
        </Route>
        <Route path="*">
          <article className="px-8 py-16 md:px-12 lg:px-32 xxl:px-0 xxl:max-w-8xl mx-auto">
            <Helmet htmlAttributes={{ lang: locale }}>
              <title>Oiva - {formatMessage(common.frontpage)}</title>
            </Helmet>
            <section>
              <Typography component="h1" variant="h1" className="py-4">
                {formatMessage(common.jarjestamisJaYllapitamisluvat)}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-auto">
                {addIndex(map)(
                  (koulutusmuoto, index) => (
                    <Koulutusmuotokortti
                      key={`koulutusmuotokortti-${index}`}
                      koulutusmuoto={koulutusmuoto}
                    />
                  ),
                  values(koulutusmuodot)
                )}
              </div>
            </section>
          </article>
        </Route>
      </LocalizedSwitch>
    </React.Fragment>
  );
};

export default JarjestamisJaYllapitamisluvat;
