import React, { useCallback, useState } from "react";
import Lomake from "../../../components/02-organisms/Lomake";
import Rajoite from "./10-rajoite";
import { useChangeObjects, useChangeObjectsByAnchor } from "../../AmmatillinenKoulutus/store";
import { v4 as uuidv4 } from 'uuid';
import { getAnchorPart } from "../../../utils/common";
import { filter } from "ramda";

const constants = {
  formLocations: ["esiJaPerusopetus", "rajoitteet"]
}



const Rajoitteet = ({ onChangesUpdate, sectionId }) => {
  const [state, actions] = useChangeObjects();
  const [restrictionId, setRestrictionId] = useState(null);
  const [existingRajoiteChangeObjs] = useChangeObjectsByAnchor({
    anchor: "rajoitteet"
  });

  const onAddRestriction = useCallback(
    payload => {
      setRestrictionId(uuidv4())
      actions.showNewRestrictionDialog();
    },
    [actions]
  );

  const onModifyRestriction = useCallback(
    payload => {
      setRestrictionId(getAnchorPart(payload.anchor,1));
      const unsavedChangeObjs = filter(cObj => getAnchorPart(cObj.anchor, 1) === restrictionId, existingRajoiteChangeObjs.unsaved);
      actions.setRajoitelomakeChangeObjects(unsavedChangeObjs);
      actions.showNewRestrictionDialog();
    }, [actions, existingRajoiteChangeObjs]
  )

  const onRemoveRestriction = useCallback(
    payload => {
      const restrictionId = getAnchorPart(payload.anchor, 1);
      actions.removeRajoite(restrictionId);
    }, [restrictionId]
  )

  return (
    <React.Fragment>
      {state.isRestrictionDialogVisible && (
        <Rajoite
          onChangesUpdate={onChangesUpdate}
          parentSectionId={sectionId}
          restrictionId={restrictionId}></Rajoite>
      )}
      <Lomake
        isInExpandableRow={false}
        anchor={sectionId}
        data={{
          changeObjects: state.changeObjects,
          onAddRestriction,
          onModifyRestriction,
          onRemoveRestriction
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
