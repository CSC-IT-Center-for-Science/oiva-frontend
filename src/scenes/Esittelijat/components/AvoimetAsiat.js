import React, { useEffect, useMemo } from "react";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import { generateAvoimetAsiatTableStructure } from "../modules/asiatUtils";
import { useIntl } from "react-intl";
import { PropTypes } from "prop-types";
import { useMuutospyynnotEsittelijaAvoimet } from "../../../stores/muutospyynnotEsittelijaAvoimet";
import { useMuutospyynnotEsittelijaValmistelussa } from "../../../stores/muutospyynnotEsittelijaValmistelussa";
import * as R from "ramda";
import { useLocation } from "react-router-dom";
import Loading from "../../../modules/Loading";

const AvoimetAsiat = props => {
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
          props.history
        )
      : [];
  }, [
    intl.formatMessage,
    muutospyynnotEsittelijaAvoimet.data,
    muutospyynnotEsittelijaValmistelussa.data,
    props.history
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
AvoimetAsiat.propTypes = {
  intl: PropTypes.object,
  history: PropTypes.object
};

export default AvoimetAsiat;
