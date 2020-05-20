import React, {useCallback, useEffect, useMemo, useState} from "react";
import Table from "okm-frontend-components/dist/components/02-organisms/Table";
import ConfirmDialog from "okm-frontend-components/dist/components/02-organisms/ConfirmDialog";
import { generateAvoimetAsiatTableStructure } from "../modules/asiatUtils";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import Loading from "../../../modules/Loading";
import { useMuutospyynnot } from "../../../stores/muutospyynnot";
import * as R from "ramda";
import common from "../../../i18n/definitions/common";
import ProcedureHandler from "../../../components/02-organisms/procedureHandler";

const AvoimetAsiat = () => {
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const [muutospyynnot, muutospyynnotActions] = useMuutospyynnot();
  const [isPaatettyConfirmationDialogVisible, setPaatettyConfirmationDialogVisible] =
    useState(false);
  const [rowActionTargetId, setRowActionTargetId] = useState(null);

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

  const onPaatettyActionClicked = (row) => {
    setRowActionTargetId(row.id);
    setPaatettyConfirmationDialogVisible(true);
  }

  const triggerPaatettyActionProcedure = useCallback( async () => {
    const timestamp = new Date().getTime();
    await new ProcedureHandler().run(
      "muutospyynnot.tilanmuutos.paatetyksi",
      [rowActionTargetId]
    );
    setPaatettyConfirmationDialogVisible(false);
    setRowActionTargetId(null);
    history.push("?force=" + timestamp);
  },[rowActionTargetId]);

  const tableStructure = useMemo(() => {
    return muutospyynnot.avoimet && muutospyynnot.avoimet.fetchedAt
      ? generateAvoimetAsiatTableStructure(
          muutospyynnot.avoimet.data,
          intl.formatMessage,
          history,
          onPaatettyActionClicked
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
        <ConfirmDialog
          content={intl.formatMessage(common.asiaPaatettyConfirmationDialogContent)}
          title={intl.formatMessage(common.asiaPaatettyConfirmationDialogTitle)}
          isConfirmDialogVisible={isPaatettyConfirmationDialogVisible}
          handleCancel={() => setPaatettyConfirmationDialogVisible(false)}
          handleOk={triggerPaatettyActionProcedure}
          onClose={() => setPaatettyConfirmationDialogVisible(false)}
          yesMessage={intl.formatMessage(common.asiaPaatettyConfirmationDialogOk)}
          noMessage={intl.formatMessage(common.cancel)}
        />
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default AvoimetAsiat;
