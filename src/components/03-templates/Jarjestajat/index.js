import React, { useEffect } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useLuvat } from "stores/luvat";
import { Helmet } from "react-helmet";
import Loading from "modules/Loading";
import { useIntl } from "react-intl";

const Jarjestajat = ({
  koulutusmuoto,
  Jarjestajaluettelo,
  paasivunOtsikko
}) => {
  const intl = useIntl();
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

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{paasivunOtsikko} - Oiva</title>
      </Helmet>

      <BreadcrumbsItem to={`/${koulutusmuoto.kebabCase}`}>
        {paasivunOtsikko}
      </BreadcrumbsItem>

      {luvat.isLoading === false && !luvat.isErroneous && (
        <Jarjestajaluettelo luvat={luvat.data} />
      )}

      {luvat.isLoading && <Loading />}
    </React.Fragment>
  );
};

export default Jarjestajat;
