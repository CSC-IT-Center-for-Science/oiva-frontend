import React, { useEffect, useMemo } from "react";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { generatePaatetytAsiatTableStructure } from "../modules/asiatUtils";
import { useIntl } from "react-intl";
import { useMuutospyynnotEsittelijaPaatetty } from "../../../stores/muutospyynnotEsittelijaPaatetty";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../../../modules/Loading";
import * as R from "ramda";

const PaatetytAsiat = () => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const [
    muutospyynnotEsittelijaPaatetty,
    muutospyynnotEsittelijaPaatettyActions
  ] = useMuutospyynnotEsittelijaPaatetty();

  useEffect(() => {
    const isForced = R.includes("force=", location.search);
    let abortController = muutospyynnotEsittelijaPaatettyActions.load(isForced);

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [location.search, muutospyynnotEsittelijaPaatettyActions]);

  const tableStructure = useMemo(() => {
    return !!muutospyynnotEsittelijaPaatetty.data
      ? generatePaatetytAsiatTableStructure(
          muutospyynnotEsittelijaPaatetty.data,
          intl.formatMessage,
          history
        )
      : [];
  }, [history, intl.formatMessage, muutospyynnotEsittelijaPaatetty.data]);

  if (
    muutospyynnotEsittelijaPaatetty.isLoading === false &&
    muutospyynnotEsittelijaPaatetty.fetchedAt
  ) {
    return (
      <div
        style={{
          borderBottom: "0.05rem solid #E3E3E3"
        }}>
        <Table
          structure={tableStructure}
          sortedBy={{ columnIndex: 5, order: "descending" }}
        />
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default PaatetytAsiat;
