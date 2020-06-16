import React, { useEffect, useMemo } from "react";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { generatePaatetytAsiatTableStructure } from "../modules/asiatUtils";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../../../modules/Loading";
import { useMuutospyynnot } from "../../../stores/muutospyynnot";
import * as R from "ramda";

const PaatetytAsiat = () => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const [muutospyynnot, muutospyynnotActions] = useMuutospyynnot();

  useEffect(() => {
    const isForced = R.includes("force=", location.search);
    let abortController = muutospyynnotActions.loadByStates(
      ["PAATETTY"],
      ["paatetyt"],
      false,
      isForced
    );

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [location.search, muutospyynnotActions]);

  const tableStructure = useMemo(() => {
    return !!muutospyynnot.paatetyt && muutospyynnot.paatetyt.fetchedAt
      ? generatePaatetytAsiatTableStructure(
          muutospyynnot.paatetyt.data,
          intl,
          history
        )
      : [];
  }, [history, intl, muutospyynnot.paatetyt]);

  if (
    muutospyynnot.paatetyt &&
    muutospyynnot.paatetyt.isLoading === false &&
    muutospyynnot.paatetyt.fetchedAt
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
