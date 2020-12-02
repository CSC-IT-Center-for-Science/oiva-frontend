import React, { useCallback } from "react";
import Lomake from "../../../../components/02-organisms/Lomake";
import Rajoite from "./10-rajoite";
import { useChangeObjects } from "../../../../stores/muutokset";

const constants = {
  formLocations: ["esiJaPerusopetus", "rajoitteet"]
}

const Rajoitteet = ({ onChangesUpdate, sectionId }) => {
  const [state, actions] = useChangeObjects();

  const onAddRestriction = useCallback(
    payload => {
      console.info(payload);
      actions.showNewRestrictionDialog();
    },
    [actions]
  );

  return (
    <React.Fragment>
      {state.isRestrictionDialogVisible && (
        <Rajoite
          onChangesUpdate={onChangesUpdate}
          parentSectionId={sectionId}></Rajoite>
      )}
      <Lomake
        isInExpandableRow={false}
        anchor={sectionId}
        data={{
          changeObjects: state.changeObjects,
          onAddRestriction
        }}
        noPadding={true}
        onChangesUpdate={onChangesUpdate}
        path={constants.formLocations}
        showCategoryTitles={true}></Lomake>
    </React.Fragment>
  );
};

Rajoitteet.propTypes = {};

export default Rajoitteet;
