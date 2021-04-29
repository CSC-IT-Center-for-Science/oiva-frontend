import React, { useEffect, useMemo } from "react";
import Table from "../../02-organisms/Table";
import { generateAvoimetAsiatTableStructure } from "../../../utils/asiatUtils";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../../../modules/Loading";
import { useMuutospyynnot } from "../../../stores/muutospyynnot";
import common from "../../../i18n/definitions/common";
import { includes, length, path } from "ramda";

const KorjattavatAsiat = ({ koulutusmuoto }) => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const [muutospyynnot, muutospyynnotActions] = useMuutospyynnot();

  useEffect(() => {
    const isForced = includes("force=", location.search);
    let abortController = muutospyynnotActions.loadByStates(
      ["KORJAUKSESSA"],
      ["korjauksessa"],
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
    return muutospyynnot.korjauksessa &&
      muutospyynnot.korjauksessa.fetchedAt &&
      muutospyynnot.korjauksessa.data !== null
      ? generateAvoimetAsiatTableStructure(
          muutospyynnot.korjauksessa.data,
          intl,
          history,
          koulutusmuoto.kebabCase
        )
      : [];
  }, [intl, koulutusmuoto.kebabCase, muutospyynnot.korjauksessa, history]);

  if (
    muutospyynnot.korjauksessa &&
    muutospyynnot.korjauksessa.isLoading === false &&
    muutospyynnot.korjauksessa.fetchedAt &&
    length(path(["korjauksessa", "data"], muutospyynnot))
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
    muutospyynnot.korjauksessa &&
    muutospyynnot.korjauksessa.isLoading === false &&
    muutospyynnot.korjauksessa.fetchedAt &&
    length(path(["korjauksessa", "data"], muutospyynnot)) === 0
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

export default KorjattavatAsiat;
