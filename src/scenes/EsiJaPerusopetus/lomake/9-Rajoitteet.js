import React, { useCallback } from "react";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import Lomake from "../../../components/02-organisms/Lomake";
import Rajoite from "./10-rajoite";

const Rajoitteet = ({ onChangesUpdate, sectionId }) => {
  const [state, actions] = useEsiJaPerusopetus();

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
        anchor={sectionId}
        changeObjects={state.changeObjects[sectionId]}
        data={{
          changeObjects: state.changeObjects,
          onAddRestriction
        }}
        noPadding={true}
        onChangesUpdate={onChangesUpdate}
        path={["esiJaPerusopetus", "rajoitteet"]}
        showCategoryTitles={true}></Lomake>
    </React.Fragment>
  );
};

Rajoitteet.propTypes = {};

export default Rajoitteet;
