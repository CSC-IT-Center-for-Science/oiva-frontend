import React, { useEffect } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useLuvat } from "../../stores/luvat";
import Jarjestajaluettelo from "./components/Jarjestajaluettelo";
import { Helmet } from "react-helmet";
import common from "../../i18n/definitions/common";
import education from "../../i18n/definitions/education";
import Loading from "../../modules/Loading";
import { useIntl } from "react-intl";

const Jarjestajat = React.memo(() => {
  const intl = useIntl();
  const [luvat, luvatActions] = useLuvat();

  // Let's fetch LUVAT
  useEffect(() => {
    const abortController = luvatActions.load();
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [luvatActions]);

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>
          Oiva | {intl.formatMessage(education.vocationalEducation)}
        </title>
      </Helmet>

      <BreadcrumbsItem to="/">
        {intl.formatMessage(common.frontpage)}
      </BreadcrumbsItem>
      <BreadcrumbsItem to="/jarjestajat">
        {intl.formatMessage(education.vocationalEducation)}
      </BreadcrumbsItem>

      {luvat.isLoading === false && !luvat.isErroneous && (
        <Jarjestajaluettelo luvat={luvat.data} />
      )}
      {luvat.isLoading && <Loading />}
    </React.Fragment>
  );
});

export default Jarjestajat;
