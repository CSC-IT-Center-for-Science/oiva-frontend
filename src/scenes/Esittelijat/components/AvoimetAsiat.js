import React, { useEffect, useMemo } from "react";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { generateAvoimetAsiatTableStructure } from "../modules/asiatUtils";
import { useIntl } from "react-intl";
import { useMuutospyynnotEsittelijaAvoimet } from "../../../stores/muutospyynnotEsittelijaAvoimet";
import { useMuutospyynnotEsittelijaValmistelussa } from "../../../stores/muutospyynnotEsittelijaValmistelussa";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../../../modules/Loading";
import * as R from "ramda";

const AvoimetAsiat = () => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const [
    muutospyynnotEsittelijaAvoimet,
    muutospyynnotEsittelijaAvoimetActions
  ] = useMuutospyynnotEsittelijaAvoimet();
  const [
    muutospyynnotEsittelijaValmistelussa,
    muutospyynnotEsittelijaValmistelussaActions
  ] = useMuutospyynnotEsittelijaValmistelussa();

  useEffect(() => {
    const isForced = R.includes("force=", location.search);
    let abortController = muutospyynnotEsittelijaAvoimetActions.load(isForced);

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [location.search, muutospyynnotEsittelijaAvoimetActions]);

  useEffect(() => {
    const isForced = R.includes("force=", location.search);
    let abortController = muutospyynnotEsittelijaValmistelussaActions.load(
      isForced
    );

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [location.search, muutospyynnotEsittelijaValmistelussaActions]);

  const tableStructure = useMemo(() => {
    const avoinData = muutospyynnotEsittelijaAvoimet.data || [];
    const valmistelussaData = muutospyynnotEsittelijaValmistelussa.data || [];
    return !!muutospyynnotEsittelijaAvoimet.data &&
      !!muutospyynnotEsittelijaValmistelussa.data
      ? generateAvoimetAsiatTableStructure(
          R.concat(avoinData, valmistelussaData),
          intl.formatMessage,
          history
        )
      : [];
  }, [
    intl.formatMessage,
    muutospyynnotEsittelijaAvoimet.data,
    muutospyynnotEsittelijaValmistelussa.data,
    history
  ]);

  if (
    muutospyynnotEsittelijaAvoimet.isLoading === false &&
    muutospyynnotEsittelijaValmistelussa.isLoading === false &&
    muutospyynnotEsittelijaAvoimet.fetchedAt &&
    muutospyynnotEsittelijaValmistelussa.fetchedAt
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
