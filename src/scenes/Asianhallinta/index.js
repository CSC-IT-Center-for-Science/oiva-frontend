import React from "react";
import { useIntl } from "react-intl";
import { NavLink, useLocation } from "react-router-dom";
import common from "../../i18n/definitions/common";
import education from "../../i18n/definitions/education";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Breadcrumbs, BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { COLORS } from "modules/styles";

const Asianhallinta = () => {
  const intl = useIntl();
  const location = useLocation();

  return (
    <React.Fragment>
      <nav
        tabIndex="0"
        className="breadcumbs-nav py-4 border-b pl-8"
        aria-label={intl.formatMessage(common.breadCrumbs)}>
        <Breadcrumbs
          hideIfEmpty={true}
          separator={<b> / </b>}
          item={NavLink}
          finalItem={"b"}
          finalProps={{
            style: {
              fontWeight: 400,
              color: COLORS.BLACK
            }
          }}
        />
      </nav>
      <BreadcrumbsItem to="/">Oiva</BreadcrumbsItem>
      <BreadcrumbsItem to="/asianhallinta">
        {intl.formatMessage(common.asianhallinta)}
      </BreadcrumbsItem>
      {location.pathname === "/asianhallinta" ? (
        <div className="flex-1 bg-gray-100">
          <div className="border border-gray-300 max-w-7xl m-auto bg-white mt-12 px-64 py-12">
            <h1>{intl.formatMessage(common.asianhallinta)}</h1>
            <p>{intl.formatMessage(common.asianhallintaInfoText)}</p>
            <div className="grid grid-cols-3 gap-4 justify-items-auto pt-12">
              <NavLink
                className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                to={"/esi-ja-perusopetus/asianhallinta/avoimet"}
                exact={true}
                style={{ textDecoration: "none", color: "inherit" }}>
                {intl.formatMessage(education.preAndBasicEducation)}
                <ArrowForwardIcon className="ml-4" />
              </NavLink>
              <NavLink
                className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                to={"/lukiokoulutus/asianhallinta/avoimet"}
                exact={true}
                style={{ textDecoration: "none", color: "inherit" }}>
                {intl.formatMessage(education.highSchoolEducation)}
                <ArrowForwardIcon className="ml-4" />
              </NavLink>
              <NavLink
                className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                to={"/ammatillinenkoulutus/asianhallinta/avoimet"}
                exact={true}
                style={{ textDecoration: "none", color: "inherit" }}>
                {intl.formatMessage(education.vocationalEducation)}
                <ArrowForwardIcon className="ml-4" />
              </NavLink>
              <NavLink
                className="font-semibold px-4 py-8 bg-white border border-gray-300 flex justify-center items-center"
                to={"/vapaa-sivistystyo/asianhallinta/avoimet"}
                exact={true}
                style={{ textDecoration: "none", color: "inherit" }}>
                {intl.formatMessage(education.vstEducation)}
                <ArrowForwardIcon className="ml-4" />
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Asianhallinta;
