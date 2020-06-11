import React from "react";
import { useIntl } from "react-intl";
import logo from "../../static/images/okm-logo.svg";
import common from "../../i18n/definitions/common";
import { Link } from "react-router-dom";

const Footer = () => {
  const intl = useIntl();

  const links = (
    <div className="mt-8 md:flex justify-between lg:justify-start">
      <p className="lg:mr-10">
        <Link to="tietosuojailmoitus" className="text-green-500">
          {intl.formatMessage(common.tietosuojailmoitus)}
        </Link>
      </p>
      <p className="lg:mr-10">
        <Link to="yleinen-sisaltosivu" className="text-green-500">
          {intl.formatMessage(common.yhteydenotto)}
        </Link>
      </p>
      <p>
        <Link to="saavutettavuusseloste" className="text-green-500">
          {intl.formatMessage(common.saavutettavuusseloste)}
        </Link>
      </p>
    </div>
  );

  return (
    <div className="flex justify-center lg:justify-start bg-white border-green-600 border-t-2 pt-12 pl-12 pr-12 pb-16">
      <div className="flex flex-col items-baseline lg:flex-1 lg:flex-row">
        <div className="flex flex-1 flex-col justify-center text-center lg:text-left lg:pr-8">
          <img alt="logo" src={logo} className="lg:w-fit-content" />
          {/* Visible on mobile screen size */}
          <div className="sm:hidden">
            <p>PL 29, 00023 {intl.formatMessage(common.valtioneuvosto)} | </p>
            <p className="mt-1">
              Puh. 029 533 0004 |{" "}
              <a href="http://www.minedu.fi" className="text-green-500">
                www.minedu.fi
              </a>
            </p>
          </div>
          {/* Visible on breakpoint sm and bigger */}
          <div className="hidden sm:block">
            <p>
              PL 29, 00023 {intl.formatMessage(common.valtioneuvosto)} | Puh.
              029 533 0004 |{" "}
              <a href="http://www.minedu.fi" className="text-green-500">
                www.minedu.fi
              </a>
            </p>
          </div>
          <div className="block lg:hidden">{links}</div>
        </div>
        <div className="hidden lg:flex justify-center lg:block lg:flex-1 pl-8">
          {links}
        </div>
      </div>
    </div>
  );
};

export default Footer;
