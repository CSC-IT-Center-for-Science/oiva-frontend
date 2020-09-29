import React, { useCallback } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";

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

  const onAddButtonClick = useCallback(
    payload => {
      actions.addAClick(sectionId, payload.anchor);
    },
    [actions, sectionId]
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
      onUpdate={onChangesUpdate}
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
        onChangesUpdate={onChangesUpdate}
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
