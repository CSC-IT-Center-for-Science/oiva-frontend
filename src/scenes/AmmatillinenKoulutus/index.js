import React from "react";
import { PropTypes } from "prop-types";
import { Typography } from "@material-ui/core";
import commonMessages from "../../i18n/definitions/common";
import educationMessages from "../../i18n/definitions/education";
import { useIntl } from "react-intl";
import { Breadcrumbs, BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import {
  NavLink,
  Route,
  Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { COLORS } from "modules/styles";
import Jarjestajat from "scenes/AmmatillinenKoulutus/Jarjestajat";
import AsianhallintaCard from "./AsianhallintaCard";
import BaseData from "basedata";
import JarjestajaSwitch from "./JarjestajaSwitch";
import { useUser } from "stores/user";
import Asianhallinta from "./Asianhallinta";

export default function AmmatillinenKoulutus({ organisation }) {
  const history = useHistory();
  const { formatMessage, locale } = useIntl();
  const location = useLocation();
  const [userState] = useUser();
  const { data: user } = userState;

  return (
    <div>
      <div className="mx-auto max-w-9xl">
        <BreadcrumbsItem to="/">Oiva</BreadcrumbsItem>
        <div className="flex flex-col min-h-screen mx-auto bg-white mb-8 pb-8">
          <article className="px-16">
            <nav
              tabIndex="0"
              className="breadcumbs-nav py-8"
              aria-label={formatMessage(commonMessages.breadCrumbs)}>
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
            {location.pathname === "/ammatillinenkoulutus" ? (
              <React.Fragment>
                <Typography component="h1" variant="h1" className="py-4">
                  {formatMessage(educationMessages.vocationalEducation)}
                </Typography>
                <Typography component="p" className="pb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  blandit tincidunt tincidunt. Praesent luctus sapien ac justo
                  accumsan, sit amet imperdiet erat maximus. Praesent eu
                  elementum justo. Praesent ut nunc ut turpis molestie
                  consectetur nec in lectus. Aenean pellentesque mattis
                  sagittis. Pellentesque sollicitudin erat eros, ac dignissim
                  tortor ultrices in. Vestibulum malesuada turpis sollicitudin
                  lacus tincidunt, eu hendrerit ante porttitor. Nam facilisis
                  lectus nunc, tincidunt scelerisque tellus egestas vitae.
                  Nullam auctor a libero sed ultricies. Morbi viverra erat ut
                  faucibus ornare. Mauris ut euismod dui.
                </Typography>
                {!!user ? (
                  <section>
                    <Typography component="h2" variant="h2" className="py-4">
                      {formatMessage(commonMessages.asianhallinta)}
                    </Typography>
                    <AsianhallintaCard></AsianhallintaCard>
                  </section>
                ) : null}
                <section className="pt-12">
                  <Jarjestajat />
                </section>
              </React.Fragment>
            ) : null}
          </article>

          <Router history={history}>
            <Switch>
              <Route
                path="/ammatillinenkoulutus/asianhallinta"
                component={Asianhallinta}
              />
              <Route
                path="/ammatillinenkoulutus/koulutuksenjarjestajat/:id"
                render={props => {
                  return (
                    <BaseData
                      locale={locale}
                      render={_props => {
                        return (
                          <JarjestajaSwitch
                            lupa={_props.lupa}
                            path={props.match.path}
                            ytunnus={_props.ytunnus}
                            user={user}
                            kielet={_props.kielet}
                            organisation={organisation}
                            tulevatLuvat={_props.tulevatLuvat}
                            voimassaOlevaLupa={_props.voimassaOlevaLupa}
                          />
                        );
                      }}
                    />
                  );
                }}
              />
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
}

AmmatillinenKoulutus.propTypes = {
  organisation: PropTypes.object
};
