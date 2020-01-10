import React from "react";
import {Helmet} from "react-helmet";
import {BreadcrumbsItem} from "react-breadcrumbs-dynamic";
import {PropTypes} from "prop-types";
import {COLORS} from "../../modules/styles";
import ProfileMenu from "../Jarjestajat/Jarjestaja/components/ProfileMenu";
import {FullWidthWrapper} from "../../modules/elements";
import AvoimetAsiat from "./components/AvoimetAsiat";
import {Route} from "react-router-dom";
import {useIntl} from "react-intl";
import common from "../../i18n/definitions/common";

const Esittelijat = ({match, user}) => {
  const intl = useIntl();
  const t = intl.formatMessage;
  const routes = [
    {
      path: `${match.url}/avoimet`,
      text: t(common.asiatOpen),
      authenticated: !!user
    }
  ];

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Oiva | ${t(common.asiat)}`}</title>
      </Helmet>
      <div className="mx-auto px-4 sm:px-0 w-11/12 lg:w-3/4">
        <BreadcrumbsItem to="/">{t(common.frontpage)}</BreadcrumbsItem>
        <BreadcrumbsItem to="/asiat">{t(common.asiat)}</BreadcrumbsItem>
        <div className="mx-auto w-full mb-16">
          <h1>{t(common.asiat)}</h1>
        </div>
        <ProfileMenu routes={routes}/>
      </div>
      <FullWidthWrapper backgroundColor={COLORS.BG_GRAY} className="mt-4">
        <div className="mx-auto lg:w-3/4 pb-8 py-8">
          <Route
            path={`${match.url}/avoimet`}
            exact
            render={() => (
              <AvoimetAsiat/>
            )}
          />
          <Route
            path={`${match.url}`}
            exact
            render={() => (
              <AvoimetAsiat/>
            )}
          />
        </div>
      </FullWidthWrapper>
    </React.Fragment>
  )
};

Esittelijat.propTypes = {
  match: PropTypes.object,
  user: PropTypes.object
};

export default Esittelijat;
