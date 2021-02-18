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

const MobileMenu = ({
  localesByLang,
  onCloseMenu,
  organisationLink,
  authenticationLink
}) => {
  const { formatMessage, locale } = useIntl();
  const koulutusmuodot = getKoulutusmuodot(formatMessage);
  const [
    jarjestamisluvatMenuVisible,
    setJarjestamisluvatMenuVisible
  ] = useState(false);

  const AppRouteTitlesMobile = [
    { route: AppRoute.Tilastot, translationKey: "common.statistics" },
    {
      route: AppRoute.Tietosuojailmoitus,
      translationKey: "common.tietosuojailmoitus"
    },
    { route: AppRoute.Yhteydenotto, translationKey: "common.yhteydenotto" },
    {
      route: AppRoute.Saavutettavuusseloste,
      translationKey: "common.saavutettavuusseloste"
    }
  ];

  return (
    <React.Fragment>
      <span
        className="flex-1 flex align-top pt-5 px-5"
        style={{ height: "4.562rem" }}
      >
        <span>
          <span
            className="cursor-pointer"
            style={{ fontSize: "0.9375rem" }}
            onClick={onCloseMenu}
          >
            <img
              className="mb-1 inline-block"
              style={{ paddingRight: "0.625rem" }}
              alt={`${formatMessage(common.sulje)}`}
              src={close_icon}
            />
            {formatMessage(common.sulje)}
          </span>
        </span>

        <span className="ml-auto">
          <LanguageSwitcher localesByLang={localesByLang} showBorder={false} />
        </span>
      </span>
      <NavLink to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}>
        <img
          alt={`${formatMessage(common.opetusJaKulttuuriministerio)} logo`}
          src={locale === "sv" ? logo_sv : logo_fi}
          className="lg:w-fit-content max-w-sm pb-6 px-5"
        />
      </NavLink>
      <div className={jarjestamisluvatMenuVisible ? "bg-green-600" : ""}>
        <span
          className="px-5 pt-3 font-medium inline-block"
          onClick={() =>
            setJarjestamisluvatMenuVisible(!jarjestamisluvatMenuVisible)
          }
          style={{
            width: "100%",
            height: "2.875rem"
          }}
        >
          <div className="cursor-pointer">
            <span style={{ paddingRight: "0.625rem" }}>
              {formatMessage(common.jarjestamisJaYllapitamisluvat)}
            </span>

            {jarjestamisluvatMenuVisible ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </div>
        </span>
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
                >
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
            >
              {formatMessage(common[last(split(".", route.translationKey))])}
            </NavLink>
          );
        }, AppRouteTitlesMobile)}
      </div>

      <div className="flex-1 flex flex-row justify-start px-5">
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
            navLinkClasses="pt-3 ml-auto"
          />
        )}
      </div>
    </React.Fragment>
  );
};

MobileMenu.propTypes = {
  localesByLang: PropTypes.object,
  onCloseMenu: PropTypes.func
};

export default MobileMenu;
