import React, { useEffect, useState } from "react";
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
import AsianhallintaCard from "./AsianhallintaCard";
import Asianhallinta from "scenes/AmmatillinenKoulutus/Asianhallinta";
import BaseData from "basedata";
import JarjestajaSwitch from "./JarjestajaSwitch";
import { useUser } from "stores/user";
import Jarjestajat from "./Jarjestajat";
import { map } from "ramda";
import {
  resolveLocalizedOrganizerName,
  resolveVSTOppilaitosNameFromLupa
} from "modules/helpers";

export default function VapaaSivistystyo({ vstLuvat }) {
  const intl = useIntl();
  const { formatMessage, locale } = useIntl();
  const history = useHistory();
  const location = useLocation();
  const [userState] = useUser();
  const [luvat, setLuvat] = useState([]);
  const [allDataLength, setAllDataLength] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [vstYllapitajaFilter, setVstYllapitajaFilter] = useState("");
  const { data: user } = userState;

  // useEffect(() => {
  //   if (vstLuvat) {
  //     const filteredLuvat =
  //       vstYllapitajaFilter.length > 0
  //         ? map(lupa => {
  //             const nimi = resolveLocalizedOrganizerName(lupa, intl.locale);
  //             const oppilaitosnimi =
  //               resolveVSTOppilaitosNameFromLupa(lupa, intl.locale) || "";
  //             if (nimi) {
  //               return (
  //                 nimi
  //                   .toLocaleLowerCase()
  //                   .includes(vstYllapitajaFilter.toLocaleLowerCase()) ||
  //                 oppilaitosnimi
  //                   .toLocaleLowerCase()
  //                   .includes(vstYllapitajaFilter.toLocaleLowerCase())
  //               );
  //             } else {
  //               return false;
  //             }
  //           }, filteredLuvat)
  //         : [];
  //     if (vstOppilaitostyyppiFilter) {
  //       filteredLuvat = filteredLuvat.filter(
  //         lupa => lupa.oppilaitostyyppi === vstOppilaitostyyppiFilter
  //       );
  //     }
  //     setLuvat(filteredLuvat);
  //     setAllDataLength(luvatRaw.data.length);
  //     setFilteredDataLength(filteredLuvat.length);
  //   }
  // }, [vstLuvat, vstYllapitajaFilter, vstOppilaitostyyppiFilter, intl.locale]);

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
            {location.pathname === "/vapaa-sivistystyo" ? (
              <React.Fragment>
                <Typography component="h1" variant="h1" className="py-4">
                  {formatMessage(educationMessages.vstEducation)}
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
                <section>
                  <Typography component="h2" variant="h2" className="py-4">
                    {formatMessage(commonMessages.asianhallinta)}
                  </Typography>
                  <AsianhallintaCard></AsianhallintaCard>
                </section>
                <section className="pt-12">
                  <Jarjestajat luvat={vstLuvat} />
                </section>
              </React.Fragment>
            ) : null}
          </article>

          <Router history={history}>
            <Switch>
              <Route
                path="/vapaa-sivistystyo/asianhallinta"
                component={Asianhallinta}
              />
              <Route
                path="/vapaa-sivistystyo/koulutuksenjarjestajat/:ytunnus"
                render={props => (
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
                        />
                      );
                    }}
                  />
                )}
              />
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
}
