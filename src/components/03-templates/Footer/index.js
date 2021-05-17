import React from "react";
import { useIntl } from "react-intl";
import logo_fi from "../../../static/images/okm-logo.svg";
import logo_sv from "../../../static/images/OKM_Sve_1rivi_logot_ISO.jpg";
import common from "../../../i18n/definitions/common";
import { Link } from "react-router-dom";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";

const Footer = () => {
  const { formatMessage, locale } = useIntl();

  const links = (
    <div className="mt-8 md:flex justify-between lg:justify-start">
      <p className="lg:mr-10">
        <Link
          to={localizeRouteKey(locale, AppRoute.Yhteydenotto, formatMessage)}
          className="underline text-green-500">
          {formatMessage(common.yhteydenotto)}
        </Link>
      </p>
      <p>
        <Link
          to={localizeRouteKey(
            locale,
            AppRoute.Saavutettavuusseloste,
            formatMessage
          )}
          className="underline text-green-500">
          {formatMessage(common.saavutettavuusseloste)}
        </Link>
      </p>
    </div>
  );

  return (
    <div className="flex justify-center lg:justify-start bg-white border-gray-300 border-t pt-12 pl-12 pr-12 pb-16">
      <div className="flex flex-col items-baseline lg:flex-1 lg:flex-row max-w-8xl mx-auto">
        <div className="flex flex-1 flex-col justify-center text-center lg:text-left lg:pr-8">
          <img
            alt={`${formatMessage(common.opetusJaKulttuuriministerio)} logo`}
            src={locale === "sv" ? logo_sv : logo_fi}
            className="max-w-sm"
          />
          {/* Visible on mobile screen size */}
          <div className="sm:hidden">
            <p>{formatMessage(common.okmAddress)} | </p>
            <p className="mt-1">
              {formatMessage(common.phoneNumber)} |{" "}
              <a
                href={formatMessage(common.okmLinkUrl)}
                className="text-green-500">
                www.minedu.fi
              </a>
            </p>
          </div>
          {/* Visible on breakpoint sm and bigger */}
          <div className="hidden sm:block">
            <p>
              {formatMessage(common.okmAddress)} |{" "}
              {formatMessage(common.phoneNumber)} |{" "}
              <a
                href={formatMessage(common.okmLinkUrl)}
                className="text-green-500 underline">
                {formatMessage(common.okmLinkText)}
              </a>
            </p>
          </div>
          <div className="block lg:hidden">{links}</div>
        </div>
        <div className="hidden lg:flex justify-end lg:block lg:flex-1 pl-8">
          {links}
        </div>
      </div>
    </div>
  );
};

export default Footer;
