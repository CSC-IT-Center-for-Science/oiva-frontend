import React, { useEffect } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useLuvat } from "stores/luvat";
import { Helmet } from "react-helmet";
import Loading from "modules/Loading";
import { useIntl } from "react-intl";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import { PropTypes } from "prop-types";

const Jarjestajat = ({
  koulutusmuoto,
  Jarjestajaluettelo,
  paasivunOtsikko
}) => {
  const { formatMessage, locale } = useIntl();
  const [luvat, luvatActions] = useLuvat();

  // Let's fetch LUVAT
  useEffect(() => {
    const abortController = luvatActions.load(
      [
        koulutusmuoto.koulutustyyppi
          ? { key: "koulutustyyppi", value: koulutusmuoto.koulutustyyppi }
          : null
      ].filter(Boolean)
    );
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [koulutusmuoto.koulutustyyppi, luvatActions]);

  const koulutusmuotoUrl = localizeRouteKey(
    locale,
    AppRoute[koulutusmuoto.pascalCase],
    formatMessage
  );

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>{paasivunOtsikko} - Oiva</title>
      </Helmet>

      <BreadcrumbsItem to={koulutusmuotoUrl}>{paasivunOtsikko}</BreadcrumbsItem>

      {luvat.isLoading === false && !luvat.isErroneous && (
        <Jarjestajaluettelo koulutusmuoto={koulutusmuoto} luvat={luvat.data} />
      )}

      {luvat.isLoading && <Loading />}
    </React.Fragment>
  );
};

Jarjestajat.propTypes = {
  Jarjestajaluettelo: PropTypes.func,
  koulutusmuoto: PropTypes.object,
  paasivunOtsikko: PropTypes.string
};

export default Jarjestajat;
