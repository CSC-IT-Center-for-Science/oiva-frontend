import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { AppRoute, AppLanguage } from "const";
import { LocalizedRouter, LocalizedSwitch } from "modules/i18n/index";
import Home from "scenes/Home/index";
import { useGlobalSettings } from "stores/appStore";
import { getRaw } from "basedata";
import { backendRoutes } from "stores/utils/backendRoutes";
import translations from "i18n/locales";
import { AppLayout } from "modules/layout";
import Tilastot from "scenes/Tilastot/components/index";
import JarjestamisJaYllapitamisluvat from "scenes/JarjestamisJaYllapitamisluvat/index";

// Koulutusmuodot
import AmmatillinenKoulutus from "scenes/Koulutusmuodot/AmmatillinenKoulutus/index";
import EsiJaPerusopetus from "scenes/Koulutusmuodot/EsiJaPerusopetus/index";
import VapaaSivistystyo from "scenes/Koulutusmuodot/VapaaSivistystyo/index";
import Lukio from "scenes/Koulutusmuodot/Lukiokoulutus/index";

export const Oiva = () => {
  const [{ isDebugModeOn }] = useGlobalSettings();
  const [isSessionDialogVisible, setSessionDialogVisible] = useState(false);

  // See the file: .env.development.local
  const isBackendTheSourceOfLocalizations = !process.env.USE_LOCAL_TRANSLATIONS;

  const [messages, setMessages] = useState();

  useEffect(() => {
    if (isBackendTheSourceOfLocalizations) {
      getRaw("lokalisaatio", backendRoutes.kaannokset.path, []).then(result => {
        const combinedMessages = Object.assign({}, result, translations);
        setMessages(combinedMessages);
        // localforage.setItem("lokalisaatio", combinedMessages).then(result => {
        // });
      });
    } else {
      setMessages(translations);
    }
  }, [isBackendTheSourceOfLocalizations]);

  return (
    <LocalizedRouter
      RouterComponent={BrowserRouter}
      languages={AppLanguage}
      localesByLang={messages}
    >
      <AppLayout localesByLang={messages}>
        <LocalizedSwitch>
          <Route exact path={AppRoute.Home}>
            <Home />
          </Route>
          <Route exact path={AppRoute.EsiJaPerusopetus}>
            <EsiJaPerusopetus />
          </Route>
          <Route exact path={AppRoute.Lukiokoulutus}>
            <Lukio />
          </Route>
          <Route exact path={AppRoute.AmmatillinenKoulutus}>
            <AmmatillinenKoulutus />
          </Route>
          <Route exact path={AppRoute.VapaaSivistystyo}>
            <VapaaSivistystyo />
          </Route>
          <Route exact path={AppRoute.JarjestamisJaYllapitamisluvat}>
            <JarjestamisJaYllapitamisluvat />
          </Route>
          <Route exact path={AppRoute.Tilastot}>
            <Tilastot />
          </Route>
          <Route path="*">
            <div>Error view</div>
          </Route>
        </LocalizedSwitch>
      </AppLayout>
    </LocalizedRouter>
  );
};
