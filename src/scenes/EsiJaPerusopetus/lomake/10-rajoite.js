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
import Lomake from "../../../components/02-organisms/Lomake";
import PropTypes from "prop-types";
import {
  useChangeObjects,
  useChangeObjectsByAnchor,
  useChangeObjectsByMultipleAnchorsWithoutUnderRemoval
} from "../../AmmatillinenKoulutus/store";
import { find, filter, startsWith, includes, map, flatten } from "ramda";
import { getAnchorPart } from "../../../utils/common";

const constants = {
  formLocation: ["esiJaPerusopetus", "rajoite"]
}

const Rajoite = ({ onChangesUpdate, parentSectionId, restrictionId }) => {
  const [state, actions] = useChangeObjects();
  const intl = useIntl();
  const sectionId = "rajoitelomake";
  const [changeObjectsByAnchor] = useChangeObjectsByMultipleAnchorsWithoutUnderRemoval({
    anchors: [
        "opetustehtavat",
        "opetuskielet",
        "toimintaalue",
        "opetuksenJarjestamismuodot",
        "erityisetKoulutustehtavat",
        "opiskelijamaarat",
        "muutEhdot",
        "rajoitelomake"]
  });

  const [rajoitelomakeChangeObjs] = useChangeObjectsByAnchor({
    anchor: "rajoitelomake"
  });

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

  const revertChangesAndCloseDialog = () => {
    actions.closeRestrictionDialog();
  }

  const acceptChangesAndCloseDialog = () => {
      actions.acceptRestriction(
        sectionId,
        restrictionId,
        parentSectionId
      );
  }

  const onChanges = useCallback((anchor, changes) => {
    /**
     * Poistetaan väärän tyyppiset rajoitteet kohteilta. Kohdetta vaihdettaessa
     * storeen jää edellisen kohteen rajoituksen mukaisia muutosobjekteja, joita
     * ei tarvita. Koska tämä koodi suoritetaan jokaisella muutoksella, riittää että löydetään yksi
     * poistettava rajoitus.
     */
      // TODO: opiskelijamäärät ja määräaika erikoistapauksia, koska niistä syntyy tällä hetkellä kaksi rajoitusta
    // Ensin tarkistetaan kohteen rajoitteet
    const firstKohdeChangeObj = find(obj => startsWith(`${sectionId}.${restrictionId}.asetukset.kohde`, obj.anchor), changes || []);
    const firstKohdeType = firstKohdeChangeObj.properties.value.value;

    const kohdeRestrictionToBeRemoved = filter(obj => startsWith(`${sectionId}.${restrictionId}.asetukset.rajoitus`, obj.anchor)
      && obj.properties.metadata.section !== firstKohdeType, changes);

    if (kohdeRestrictionToBeRemoved.length) {
      actions.setChanges(filter(obj => obj.anchor !== kohdeRestrictionToBeRemoved[0].anchor, changes), anchor);
      return;
    }

    // Jos kohteessa ei ollut poistettavaa rajoitetta, tarkistetaan loput rajoitekriteerit
    const kohdeChangeObjs = filter(obj => !startsWith(`${sectionId}.${restrictionId}.asetukset.kohde`, obj.anchor) &&
      startsWith(`${sectionId}.${restrictionId}.asetukset`, obj.anchor) &&
      !includes("rajoitus", obj.anchor), changes);

    const otherRestrictions = flatten(map(kohdeChangeObj => {
      const kohdeInd = getAnchorPart(kohdeChangeObj.anchor, 3);
      return filter(obj => startsWith(`${sectionId}.${restrictionId}.asetukset.${kohdeInd}.rajoitus`, obj.anchor) &&
        obj.properties.metadata.section !== kohdeChangeObj.properties.value.value, changes);
    }, kohdeChangeObjs))

    if (otherRestrictions.length) {
      actions.setChanges(filter(obj => obj.anchor !== otherRestrictions[0].anchor, changes), anchor);
      return;
    }

    // Jos rajoitekriteereistäkään ei löytynyt poistettavaa, asetetaan muutokset normaalisti
    actions.setChanges(changes, anchor);
  }, [actions]);
  return (
    <Dialog
      open={state.isRestrictionDialogVisible}
      PaperProps={{ style: { overflowY: "auto", height: "80%" } }}>
      <DialogTitle onClose={actions.closeRestrictionDialog}>
        Lisää rajoite luvalle
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <Typography className="pb-8">
          Aloita valitsemalla rajoituksen kohde. Valinnan jälkeen voit tehdä
          tarvittavat rajoitukset haluamallasi tavalla
        </Typography>
        <Lomake
          isInExpandableRow={false}
          anchor={sectionId}
          data={{
            changeObjects: changeObjectsByAnchor,
            onAddCriterion,
            onRemoveCriterion,
            rajoiteId: restrictionId,
            sectionId
          }}
          noPadding={true}
          onChanges={onChanges}
          onChangesUpdate={onChangesUpdate}
          path={constants.formLocation}
          showCategoryTitles={true}></Lomake>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button
              onClick={() => revertChangesAndCloseDialog()}
              color="primary"
              variant="outlined">
              {intl.formatMessage(common.cancel)}
            </Button>
          </div>
          <Button
            onClick={() => {acceptChangesAndCloseDialog(rajoitelomakeChangeObjs)}}
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
