import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import common from "i18n/definitions/common";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import Lomake from "components/02-organisms/Lomake";
import PropTypes from "prop-types";
import { useChangeObjects, useChangeObjectsByAnchor } from "stores/muutokset";

const constants = {
  formLocation: ["esiJaPerusopetus", "rajoite"]
};

const Rajoite = ({
  osioidenData,
  sectionId,
  parentSectionId,
  restrictionId
}) => {
  const [state, actions] = useChangeObjects();
  const intl = useIntl();

  const [rajoitelomakeChangeObjs] = useChangeObjectsByAnchor({
    anchor: sectionId
  });

  const onAddCriterion = useCallback(
    payload => {
      actions.addCriterion(sectionId, payload.metadata.rajoiteId);
    },
    [actions, sectionId]
  );

  const onRemoveCriterion = useCallback(
    anchor => {
      actions.removeCriterion(sectionId, anchor);
    },
    [actions, sectionId]
  );

  const revertChangesAndCloseDialog = () => {
    actions.closeRestrictionDialog();
  };

  const acceptChangesAndCloseDialog = () => {
    actions.acceptRestriction(sectionId, restrictionId, parentSectionId);
  };

  return (
    <Dialog
      open={state.isRestrictionDialogVisible}
      PaperProps={{
        style: {
          overflowY: "auto",
          minHeight: "30%",
          minWidth: "32rem",
          width: "80%",
          maxWidth: "88rem"
        }
      }}
    >
      <DialogTitle onClose={actions.closeRestrictionDialog}>
        Lisää rajoite luvalle
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        {/* <Typography component="p" variant="p">
          Aloita valitsemalla rajoituksen kohde. Valinnan jälkeen voit tehdä
          tarvittavat rajoitukset haluamallasi tavalla
        </Typography> */}
        <Lomake
          isInExpandableRow={false}
          anchor={sectionId}
          data={{
            osioidenData,
            rajoiteId: restrictionId,
            sectionId
          }}
          functions={{
            onAddCriterion,
            onRemoveCriterion
          }}
          isSavingState={false}
          path={constants.formLocation}
          showCategoryTitles={true}
        ></Lomake>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button
              onClick={() => revertChangesAndCloseDialog()}
              color="primary"
              variant="outlined"
            >
              {intl.formatMessage(common.cancel)}
            </Button>
          </div>
          <Button
            onClick={() => {
              acceptChangesAndCloseDialog(rajoitelomakeChangeObjs);
            }}
            color="primary"
            variant="contained"
          >
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
