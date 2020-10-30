import React from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import { Helmet } from "react-helmet";
import education from "../../i18n/definitions/education";
import { useIntl } from "react-intl";
import { find, head, map, toUpper, values, prop, descend, sort } from "ramda";
import { resolveVSTOppilaitosNameFromLupa } from "../../modules/helpers";

const Jarjestajat = ({ luvat, vstTyypit }) => {
  const intl = useIntl();
  const byYllapitaja = descend(prop('yllapitaja'));
  const tableData = sort(byYllapitaja,
    map(lupa => {
      const oppilaitostyyppiKoodistosta = find(tyyppi => tyyppi.koodiarvo === lupa.oppilaitostyyppi, vstTyypit);
      const localeUpper = toUpper(intl.locale);
      return {
        yllapitaja: lupa.jarjestaja.nimi[intl.locale] || head(values(lupa.jarjestaja.nimi)),
        oppilaitos: resolveVSTOppilaitosNameFromLupa(lupa, intl.locale),
        oppilaitostyyppi: oppilaitostyyppiKoodistosta ? oppilaitostyyppiKoodistosta.metadata[localeUpper].nimi : "",
        toiminnot: ["info"],
        ytunnus: lupa.jarjestajaYtunnus
      };
    }, luvat));

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{intl.formatMessage(education.vstEducation)} - Oiva</title>
      </Helmet>

      <BreadcrumbsItem to="/vapaa-sivistystyo">
        {intl.formatMessage(education.vstEducation)}
      </BreadcrumbsItem>

      <Jarjestajaluettelo tableData={tableData} vstTyypit={vstTyypit} luvat={luvat}/>
    </React.Fragment>
  );
};

export default Jarjestajat;
