import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import education from "../../../i18n/definitions/education";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import { getAnchorPart } from "../../../utils/common";
import { find } from "ramda";

const constants = {
  formLocations: ["esiJaPerusopetus", "erityisetKoulutustehtavat"]
}

const ErityisetKoulutustehtavat = ({
  onChangesUpdate,
  lisatiedot,
  poErityisetKoulutustehtavat,
  sectionId
}) => {
  const [state, actions] = useEsiJaPerusopetus();
  const intl = useIntl();

  const onAddButtonClick = useCallback(
    addBtn => {
      actions.createTextBoxChangeObject(
        sectionId,
        getAnchorPart(addBtn.anchor, 1)
      );
    },
    [actions, sectionId]
  );

  const onChanges = useCallback(
    ({anchor, changes}) => {
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
        onChangesUpdate({anchor: anchor, changes: changes});
      }
    },
    [actions, onChangesUpdate, sectionId]
  );

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={{
        onAddButtonClick,
        poErityisetKoulutustehtavat,
        lisatiedot
      }}
      path={constants.formLocations}
      showCategoryTitles={true}
      rowTitle={intl.formatMessage(education.erityisetKoulutustehtavat)}></Lomake>
  );
};

ErityisetKoulutustehtavat.propTypes = {
  lisatiedot: PropTypes.array,
  poErityisetKoulutustehtavat: PropTypes.array,
  sectionId: PropTypes.string
};

export default ErityisetKoulutustehtavat;
