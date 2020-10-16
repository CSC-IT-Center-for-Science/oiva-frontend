import React, { useCallback } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import education from "../../../i18n/definitions/education";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import { find } from "ramda";

const MuutEhdot = ({
  onChangesRemove,
  onChangesUpdate,
  lisatiedot,
  poMuutEhdot,
  sectionId
}) => {
  const [state, actions] = useEsiJaPerusopetus();
  const intl = useIntl();

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

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
    <ExpandableRowRoot
      anchor={sectionId}
      key={`expandable-row-root`}
      changes={state.changeObjects[sectionId]}
      hideAmountOfChanges={true}
      isExpanded={true}
      messages={changesMessages}
      onChangesRemove={onChangesRemove}
      onUpdate={onChanges}
      sectionId={sectionId}
      showCategoryTitles={true}
      title={intl.formatMessage(education.muutEhdotTitle)}>
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={state.changeObjects[sectionId]}
        data={{
          lisatiedot,
          onAddButtonClick,
          poMuutEhdot
        }}
        onChangesUpdate={onChanges}
        path={["esiJaPerusopetus", "muutEhdot"]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
};

MuutEhdot.propTypes = {
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  poMuutEhdot: PropTypes.array,
  sectionId: PropTypes.string
};

export default MuutEhdot;
