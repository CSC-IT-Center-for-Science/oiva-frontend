import React, { useCallback } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import { getAnchorPart } from "../../../utils/common";
import { find } from "ramda";

const ErityisetKoulutustehtavat = ({
  onChangesRemove,
  onChangesUpdate,
  poErityisetKoulutustehtavat,
  sectionId
}) => {
  const [state, actions] = useEsiJaPerusopetus();
  const intl = useIntl();

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  const onAddButtonClick = useCallback((addBtn) => {
    actions.createTextBoxChangeObject(sectionId, getAnchorPart(addBtn.anchor, 1));
  }, [actions, sectionId]);

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
    [onChangesUpdate]
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
      title={"Erityiset koulutustehtävät"}>
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={state.changeObjects[sectionId]}
        data={{
          onAddButtonClick,
          poErityisetKoulutustehtavat
        }}
        onChangesUpdate={onChanges}
        path={["esiJaPerusopetus", "erityisetKoulutustehtavat"]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
};

ErityisetKoulutustehtavat.propTypes = {
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  poErityisetKoulutustehtavat: PropTypes.array,
  sectionId: PropTypes.string
};

export default ErityisetKoulutustehtavat;
