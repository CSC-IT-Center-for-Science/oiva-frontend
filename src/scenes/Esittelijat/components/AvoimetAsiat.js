import React, { useEffect, useMemo } from "react";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { generateAvoimetAsiatTableStructure } from "../modules/asiatUtils";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../../../modules/Loading";
import { useMuutospyynnot } from "../../../stores/muutospyynnot";
import * as R from "ramda";

const AvoimetAsiat = () => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const [muutospyynnot, muutospyynnotActions] = useMuutospyynnot();

  useEffect(() => {
    const isForced = R.includes("force=", location.search);
    let abortController = muutospyynnotActions.loadByStates(
      ["AVOIN", "VALMISTELUSSA", "ESITTELYSSA"],
      ["avoimet"],
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
    return muutospyynnot.avoimet && muutospyynnot.avoimet.fetchedAt
      ? generateAvoimetAsiatTableStructure(
          muutospyynnot.avoimet.data,
          intl.formatMessage,
          history
        )
      : [];
  }, [intl.formatMessage, muutospyynnot.avoimet, history]);

  if (
    muutospyynnot.avoimet &&
    muutospyynnot.avoimet.isLoading === false &&
    muutospyynnot.avoimet.fetchedAt
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

export default AvoimetAsiat;
