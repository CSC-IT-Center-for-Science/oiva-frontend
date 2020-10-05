import React from "react";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import Lomake from "../../../components/02-organisms/Lomake";

const Rajoitteet = ({ onChangesUpdate }) => {
  const [state] = useEsiJaPerusopetus();
  const sectionId = "rajoitteet";

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={state.changeObjects[sectionId]}
      data={{}}
      onChangesUpdate={onChangesUpdate}
      path={["esiJaPerusopetus", "rajoitteet"]}
      showCategoryTitles={true}></Lomake>
  );
};

Rajoitteet.propTypes = {};

export default Rajoitteet;
