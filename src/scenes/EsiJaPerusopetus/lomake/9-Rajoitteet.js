import React, { useCallback } from "react";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import Lomake from "../../../components/02-organisms/Lomake";

const Rajoitteet = ({ onChangesUpdate }) => {
  const [state, actions] = useEsiJaPerusopetus();
  const sectionId = "rajoitteet";

  const onAddCriterion = useCallback(
    payload => {
      console.info(payload);
      actions.addCriterion(payload.metadata.rajoiteId);
    },
    [actions]
  );

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={state.changeObjects[sectionId]}
      data={{
        rajoiteId: "eka",
        changeObjects: state.changeObjects,
        onAddCriterion
      }}
      onChangesUpdate={onChangesUpdate}
      path={["esiJaPerusopetus", "rajoitteet"]}
      showCategoryTitles={true}></Lomake>
  );
};

Rajoitteet.propTypes = {};

export default Rajoitteet;
