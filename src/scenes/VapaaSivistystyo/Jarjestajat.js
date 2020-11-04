import React, { useEffect } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import { Helmet } from "react-helmet";
import education from "../../i18n/definitions/education";
import { useIntl } from "react-intl";
import { find, head, map, toUpper, values, prop, descend, sort } from "ramda";
import { resolveVSTOppilaitosNameFromLupa } from "../../modules/helpers";
import { koulutustyypitMap } from "../../utils/constants";
import { useLuvat } from "../../stores/luvat";
import Loading from "../../modules/Loading";

const Jarjestajat = ({ vstTyypit }) => {
  const intl = useIntl();
  const byYllapitaja = descend(prop('yllapitaja'));
  // Let's fetch LUVAT
  const [luvat, luvatActions] = useLuvat();
  useEffect(() => {
    const abortController = luvatActions.load([
      {
        key: "koulutustyyppi",
        value: koulutustyypitMap.VAPAASIVISTYSTYO
      }
    ]);
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [luvatActions]);

  const tableData = luvat.fetchedAt ? sort(byYllapitaja,
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
    }, luvat.data)) : [];

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{intl.formatMessage(education.vstEducation)} - Oiva</title>
      </Helmet>

      <BreadcrumbsItem to="/vapaa-sivistystyo">
        {intl.formatMessage(education.vstEducation)}
      </BreadcrumbsItem>
      {luvat.isLoading === false && !luvat.isErroneous && (
        <Jarjestajaluettelo tableData={tableData} vstTyypit={vstTyypit} luvat={luvat.data}/>
      )}
      {luvat.isLoading && <Loading />}
    </React.Fragment>
  );
};

export default Jarjestajat;
