import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, makeStyles } from "@material-ui/core";
import HorizontalLayout from "./HorizontalLayout";
import VerticalLayout from "./VerticalLayout";
import { NavLink } from "react-router-dom";
import * as R from "ramda";
import "../../../css/tailwind.css";
import { useIntl } from "react-intl";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import education from "i18n/definitions/education";
import common from "i18n/definitions/common";
import { LanguageSwitcher } from "modules/i18n/index";

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: "none"
  }
}));

const defaultProps = {
  direction: "horizontal",
  theme: {
    backgroundColor: "vihrea",
    color: "white",
    hoverColor: "green-600"
  }
};

const Navigation = ({
  direction = defaultProps.direction,
  localesByLang,
  theme = defaultProps.theme
}) => {
  const { formatMessage, locale } = useIntl();
  const classes = useStyles(theme);

  const level1Links = [
    {
      path: AppRoute.JarjestamisJaYllapitamisluvat,
      text: formatMessage(education.preAndBasicEducation)
    }
  ];

  const links = [
    {
      path: AppRoute.EsiJaPerusopetus,
      text: formatMessage(education.preAndBasicEducation)
    },
    {
      path: AppRoute.Lukiokoulutus,
      text: formatMessage(education.highSchoolEducation)
    },
    {
      path: AppRoute.AmmatillinenKoulutus,
      text: formatMessage(education.vocationalEducation)
    },
    {
      path: AppRoute.VapaaSivistystyo,
      text: formatMessage(education.vstEducation)
    },
    { path: AppRoute.Tilastot, text: formatMessage(common.statistics) }
  ];

  const items = R.addIndex(R.map)((link, index) => {
    const bgColorClass = `bg-${theme.hoverColor}`;
    const mdBgHoverClass = `md:${bgColorClass}`;

    const className = `px-4 font-medium uppercase
      py-2 flex-1 tracking-wider min-w-200 lg:max-w-xxs sm:min-w-initial mx-4
      hover-${bgColorClass} hover:text-${theme.color} visited:text-${theme.color} text-${theme.color} text-center flex-wrap whitespace-no-wrap`;

    return link.url ? (
      <a href={link.url} key={`link-${index}`} className={className}>
        {link.text}
      </a>
    ) : (
      <NavLink
        key={`link-${index}`}
        exact={link.isExact}
        activeClassName={`${mdBgHoverClass} ml-xxs`}
        to={localizeRouteKey(locale, link.path, formatMessage)}
        className={className}
      >
        {link.text}
      </NavLink>
    );
  }, links);

  return (
    <React.Fragment>
      {(!direction || direction === "horizontal") && (
        <AppBar position="static" classes={classes}>
          <Toolbar
            variant="dense"
            className={`flex flex-wrap text-black text-sm overflow-auto hide-scrollbar bg-${theme.backgroundColor}`}
            disableGutters={true}
          >
            <HorizontalLayout items={items}></HorizontalLayout>
          </Toolbar>

          <div className="">
            <LanguageSwitcher localesByLang={localesByLang} />
          </div>
        </AppBar>
      )}
      {direction === "vertical" && (
        <VerticalLayout items={items}></VerticalLayout>
      )}
    </React.Fragment>
  );
};

Navigation.propTypes = {
  links: PropTypes.array,
  direction: PropTypes.string,
  theme: PropTypes.object
};

export default Navigation;
