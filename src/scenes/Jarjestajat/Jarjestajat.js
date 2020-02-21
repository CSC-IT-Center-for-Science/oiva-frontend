import React, { useEffect } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useLuvat } from "../../stores/luvat";
import LuvatList from "./components/LuvatList";
import { PropTypes } from "prop-types";
import { Helmet } from "react-helmet";
import * as R from "ramda";
import common from "../../i18n/definitions/common";
import Loading from "../../modules/Loading";
import { useIntl } from "react-intl";

const Jarjestajat = React.memo(({ history }) => {
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
      <Helmet>
        <title>Oiva | Ammatillinen koulutus</title>
      </Helmet>

      <BreadcrumbsItem to="/">Etusivu</BreadcrumbsItem>
      <BreadcrumbsItem to="/jarjestajat">Ammatillinen koulutus</BreadcrumbsItem>

      <div className="mx-auto w-full sm:w-3/4 mb-16">
        <h1>{intl.formatMessage(common.ammatillisenKoulutuksenJarjestajat)}</h1>
        {luvat.isLoading === false && !luvat.isErroneous && (
          <React.Fragment>
            <p className="my-4">
              {intl.formatMessage(common.voimassaOlevatJarjestamisluvat, {
                amount: R.length(luvat.data)
              })}
            </p>

            <LuvatList history={history} luvat={luvat.data} />
          </React.Fragment>
        )}
        {luvat.isLoading && <Loading />}
      </div>
    </React.Fragment>
  );
});

Jarjestajat.propTypes = {
  history: PropTypes.object
};

export default Jarjestajat;
