import React, { useState } from "react";
import { LanguageSwitcher } from "../../../../modules/i18n";
import PropTypes from "prop-types";
import common from "../../../../i18n/definitions/common";
import logo_sv from "../../../../static/images/oiva-logo-sv-tekstilla.svg";
import logo_fi from "../../../../static/images/oiva-logo-fi-tekstilla.svg";
import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import close_icon from "static/images/close-icon.svg";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { addIndex, last, map, split, values } from "ramda";
import { AppRoute } from "const/index";
import { getKoulutusmuodot, localizeRouteKey } from "../../../../utils/common";
import AuthenticationLink from "../AuthenticationLink";
import OrganisationLink from "../OrganisationLink";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  root: {
    marginTop: "0.6rem",
    paddingLeft: 0,
    textTransform: "none",
    color: "#ffffff"
  }
}));

const MobileMenu = ({
  localesByLang,
  onCloseMenu,
  organisationLink,
  authenticationLink
}) => {
  const classes = useStyles();
  const { formatMessage, locale } = useIntl();
  const koulutusmuodot = getKoulutusmuodot(formatMessage);
  const [jarjestamisluvatMenuVisible, setjarjestamisluvatMenuVisible] =
    useState(true);

  const AppRouteTitlesMobile = [
    { route: AppRoute.Tilastot, translationKey: "common.statistics" },
    { route: AppRoute.Yhteydenotto, translationKey: "common.yhteydenotto" },
    {
      route: AppRoute.Saavutettavuusseloste,
      translationKey: "common.saavutettavuusseloste"
    }
  ];

  return (
    <nav>
      <span className="flex-1 flex align-top" style={{ height: "4.562rem" }}>
        <Button
          className={classes.root}
          style={{ fontSize: "0.9375rem" }}
          onClick={onCloseMenu}>
          <img
            className="mb-1 inline-block"
            style={{ paddingRight: "0.625rem" }}
            alt={`${formatMessage(common.sulje)}`}
            src={close_icon}
          />
          {formatMessage(common.sulje)}
        </Button>

        <span className="ml-auto pt-5 px-5">
          <LanguageSwitcher localesByLang={localesByLang} showBorder={false} />
        </span>
      </span>
      <NavLink
        onClick={onCloseMenu}
        to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}
        className="block">
        <img
          alt={`${formatMessage(common.opetusJaKulttuuriministerio)} logo`}
          src={locale === "sv" ? logo_sv : logo_fi}
          className="max-w-sm py-6 px-5"
        />
      </NavLink>
      <div className={jarjestamisluvatMenuVisible ? "bg-green-600" : ""}>
        <div
          className={
            jarjestamisluvatMenuVisible
              ? "font-medium inline-block bg-green-700"
              : "font-medium inline-block"
          }
          style={{
            width: "100%",
            height: "2.875rem"
          }}
          onClick={() => {
            setjarjestamisluvatMenuVisible(!jarjestamisluvatMenuVisible);
          }}>
          <div className="flex py-2">
            <NavLink
              onClick={onCloseMenu}
              style={{
                fontSize: "1.0625rem"
              }}
              to={localizeRouteKey(
                locale,
                AppRoute.JarjestamisJaYllapitamisluvat,
                formatMessage
              )}
              className="text-white font-medium block">
              <span className="pl-5 pr-3">
                {formatMessage(common.jarjestamisJaYllapitamisluvat)}
              </span>
            </NavLink>
            <button className="pr-5">
              {jarjestamisluvatMenuVisible ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </button>
          </div>
        </div>
        {jarjestamisluvatMenuVisible ? (
          <div className="bg-green-600">
            {" "}
            {addIndex(map)((koulutusmuoto, index) => {
              const route = AppRoute.getKoulutusmuodonEtusivu(
                koulutusmuoto.kebabCase
              );
              const routeToKoulutusmuodonEtusivu = localizeRouteKey(
                locale,
                route.key,
                formatMessage,
                {
                  koulutusmuoto: koulutusmuoto.kebabCase
                }
              );
              return (
                <NavLink
                  key={index}
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: "2.875rem"
                  }}
                  to={routeToKoulutusmuodonEtusivu}
                  className="text-white pl-10 pr-5 font-medium block"
                  activeClassName="bg-green-700"
                  onClick={onCloseMenu}>
                  {koulutusmuoto.paasivunOtsikko}
                </NavLink>
              );
            }, values(koulutusmuodot))}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="font-medium pb-6">
        {map(route => {
          return (
            <NavLink
              key={route.translationKey}
              style={{
                fontSize: "1.0625rem",
                lineHeight: "2.875rem"
              }}
              to={localizeRouteKey(locale, route.route, formatMessage)}
              className="text-white px-5 block"
              activeClassName="bg-green-700"
              onClick={onCloseMenu}>
              {formatMessage(common[last(split(".", route.translationKey))])}
            </NavLink>
          );
        }, AppRouteTitlesMobile)}
      </div>

      <div className="flex-1 flex flex-row justify-start px-5 items-center">
        {!!authenticationLink && (
          <AuthenticationLink
            authenticationLink={authenticationLink}
            navLinkClasses="w-2/5"
          />
        )}
        {organisationLink.path && (
          <OrganisationLink
            organisationLink={organisationLink}
            formatMessage={formatMessage}
            navLinkClasses="pt-1 ml-auto"
          />
        )}
      </div>
    </nav>
  );
};

MobileMenu.propTypes = {
  authenticationLink: PropTypes.object,
  localesByLang: PropTypes.object,
  onCloseMenu: PropTypes.func,
  organisationLink: PropTypes.object
};

export default MobileMenu;
