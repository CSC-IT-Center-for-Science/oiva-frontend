import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import common from "i18n/definitions/common";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import Lomake from "../../../components/02-organisms/Lomake";
import PropTypes from "prop-types";

const Rajoite = ({ onChangesUpdate, parentSectionId }) => {
  const [state, actions] = useEsiJaPerusopetus();
  const intl = useIntl();
  const sectionId = "rajoitelomake";
  const restrictionId = "eka";

  const onAddCriterion = useCallback(
    payload => {
      actions.addCriterion(sectionId, payload.metadata.rajoiteId);
    },
    [actions]
  );

  const onRemoveCriterion = useCallback(
    anchor => {
      actions.removeCriterion(sectionId, anchor);
    },
    [actions]
  );

  return (
    <Dialog
      open={state.isRestrictionDialogVisible}
      PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle onClose={actions.closeRestrictionDialog}>
        Lisää rajoite luvalle
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <Typography className="pb-8">
          Aloita valitsemalla rajoituksen kohde. Valinnan jälkeen voit tehdä
          tarvittavat rajoitukset haluamallasi tavalla
        </Typography>
        <Lomake
          anchor={sectionId}
          changeObjects={state.changeObjects[sectionId]}
          data={{
            changeObjects: state.changeObjects,
            onAddCriterion,
            onRemoveCriterion,
            rajoiteId: restrictionId,
            sectionId
          }}
          noPadding={true}
          onChangesUpdate={onChangesUpdate}
          path={["esiJaPerusopetus", "rajoite"]}
          showCategoryTitles={true}></Lomake>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button
              onClick={actions.closeRestrictionDialog}
              color="primary"
              variant="outlined">
              {intl.formatMessage(common.cancel)}
            </Button>
          </div>
          <Button
            onClick={() => {
              console.info("Hyväksytään ja suljetaan rajoitedialogi.");
              actions.acceptRestriction(
                sectionId,
                restrictionId,
                parentSectionId
              );
              actions.closeRestrictionDialog();
            }}
            color="primary"
            variant="contained">
            {intl.formatMessage(common.accept)}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

Rajoite.propTypes = {
  parentSectionId: PropTypes.string
};

export default Rajoite;
