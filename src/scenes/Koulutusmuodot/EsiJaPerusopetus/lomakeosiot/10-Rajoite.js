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
import {
  useChangeObjects,
  useChangeObjectsByAnchor,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "stores/muutokset";

const constants = {
  formLocation: ["esiJaPerusopetus", "rajoite"],
  // Kohdevaihtoehtoja käytetään rajoitteita tehtäessä.
  // Kohteet vaihtelevat koulutusmuodoittain.
  kohdevaihtoehdot: [
    {
      label: "Opetus, jota lupa koskee",
      value: "opetustehtavat"
    },
    {
      label: "Kunnat, joissa opetusta järjestetään",
      value: "toimintaalue"
    },
    { label: "Opetuskieli", value: "opetuskielet" },
    {
      label: "Opetuksen järjestämismuodot",
      value: "opetuksenJarjestamismuodot"
    },
    {
      label: "Erityinen koulutustehtävä",
      value: "erityisetKoulutustehtavat"
    },
    {
      label: "Opiskelijamäärät",
      value: "opiskelijamaarat"
    },
    {
      label: "Muut koulutuksen järjestämiseen liittyvät ehdot",
      value: "muutEhdot"
    },
    {
      label: "Oppilaitokset",
      value: "oppilaitokset"
    }
  ]
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

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  console.info(rajoitelomakeChangeObjs, sectionId, changeObjects);

  const lisaaKohdennus = useCallback(
    ({ metadata }) => {
      actions.lisaaKohdennus(
        sectionId,
        metadata.kohdennusId,
        metadata.rajoiteId,
        metadata.kohdennusindeksipolku
      );
    },
    [actions, sectionId]
  );

  const onAddCriterion = useCallback(
    ({ metadata }) => {
      actions.addCriterion(
        sectionId,
        metadata.kohdennusId,
        metadata.rajoiteId,
        metadata.kohdennusindeksipolku
      );
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
          minWidth: "32rem",
          height: "100%",
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
        <div className="m-10">
          <Lomake
            anchor={`${sectionId}_${restrictionId}`}
            changeObjects={changeObjects}
            data={{
              kohdevaihtoehdot: constants.kohdevaihtoehdot,
              osioidenData,
              rajoiteId: restrictionId,
              sectionId
            }}
            functions={{
              lisaaKohdennus,
              onAddCriterion,
              onRemoveCriterion
            }}
            isInExpandableRow={false}
            isSavingState={false}
            path={constants.formLocation}
            showCategoryTitles={true}
          ></Lomake>
        </div>
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
