import React, { useEffect, useMemo } from "react";
import Table from "../../02-organisms/Table";
import { generateAvoimetAsiatTableStructure } from "../../../utils/asiatUtils";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../../../modules/Loading";
import { useMuutospyynnot } from "../../../stores/muutospyynnot";
import common from "../../../i18n/definitions/common";
import { includes, length, path } from "ramda";

const AvoimetAsiat = ({ koulutusmuoto }) => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const [muutospyynnot, muutospyynnotActions] = useMuutospyynnot();

  useEffect(() => {
    const isForced = includes("force=", location.search);
    let abortController = muutospyynnotActions.loadByStates(
      ["AVOIN", "VALMISTELUSSA", "ESITTELYSSA"],
      ["avoimet"],
      false,
      isForced,
      koulutusmuoto.koulutustyyppi
    );

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [koulutusmuoto.koulutustyyppi, location.search, muutospyynnotActions]);

  const tableStructure = useMemo(() => {
    return muutospyynnot.avoimet &&
      muutospyynnot.avoimet.fetchedAt &&
      muutospyynnot.avoimet.data !== null
      ? generateAvoimetAsiatTableStructure(
          muutospyynnot.avoimet.data,
          intl,
          history,
          koulutusmuoto.kebabCase
        )
      : [];
  }, [intl, koulutusmuoto.kebabCase, muutospyynnot.avoimet, history]);

  if (
    muutospyynnot.avoimet &&
    muutospyynnot.avoimet.isLoading === false &&
    muutospyynnot.avoimet.fetchedAt &&
    length(path(["avoimet", "data"], muutospyynnot))
  ) {
    return (
      <div
        style={{
          borderBottom: "0.05rem solid #E3E3E3"
        }}
      >
        <Table
          structure={tableStructure}
          sortedBy={{ columnIndex: 5, order: "desc" }}
        />
      </div>
    );
  } else if (
    muutospyynnot.avoimet &&
    muutospyynnot.avoimet.isLoading === false &&
    muutospyynnot.avoimet.fetchedAt &&
    length(path(["avoimet", "data"], muutospyynnot)) === 0
  ) {
    return (
      <div
        className="flex justify-center text-tummanharmaa text-base items-center"
        style={{ height: "100%" }}
      >
        {intl.formatMessage(common.eiAvoimiaAsioita)}
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default AvoimetAsiat;
