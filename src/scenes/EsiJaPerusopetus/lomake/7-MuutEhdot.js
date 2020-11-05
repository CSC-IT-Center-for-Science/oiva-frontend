import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import education from "../../../i18n/definitions/education";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import { find } from "ramda";

const constants = {
  formLocations: ["esiJaPerusopetus", "muutEhdot"]
}

const MuutEhdot = ({
  onChangesUpdate,
  lisatiedot,
  poMuutEhdot,
  sectionId
}) => {
  const [state, actions] = useEsiJaPerusopetus();
  const intl = useIntl();

  const onAddButtonClick = useCallback(
    koodiarvo => {
      actions.createTextBoxChangeObject(sectionId, koodiarvo);
    },
    [actions, sectionId]
  );

  const onChanges = useCallback(
    ({ anchor, changes }) => {
      const removeBtnClickedChangeObject = find(
        change => change.properties && change.properties.textBoxDelete,
        changes
      );
      if (removeBtnClickedChangeObject) {
        actions.removeTextBoxChangeObject(
          sectionId,
          removeBtnClickedChangeObject.anchor
        );
      } else {
        onChangesUpdate({ anchor: anchor, changes: changes });
      }
    },
    [actions, onChangesUpdate, sectionId]
  );

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={{
        lisatiedot,
        onAddButtonClick,
        poMuutEhdot
      }}
      path={constants.formLocations}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(education.muutEhdotTitle)}></Lomake>
  );
};

MuutEhdot.propTypes = {
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  poMuutEhdot: PropTypes.array,
  sectionId: PropTypes.string
};

export default MuutEhdot;
