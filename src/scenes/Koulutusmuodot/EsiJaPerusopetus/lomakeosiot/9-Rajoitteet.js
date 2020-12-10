import React, { useCallback, useState } from "react";
import Rajoite from "./10-rajoite";
import { useChangeObjectsByAnchor } from "stores/muutokset";
import { v4 as uuidv4 } from "uuid";
import { filter } from "ramda";
import Lomake from "components/02-organisms/Lomake";
import { getAnchorPart } from "utils/common";
import { useAllSections } from "stores/lomakedata";
import { useChangeObjects } from "../../../../stores/muutokset";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import { useIntl } from "react-intl";

const constants = {
  formLocations: ["esiJaPerusopetus", "rajoitteet"]
};

const Rajoitteet = ({
  isRestrictionsModeOn,
  onChangesUpdate,
  render,
  sectionId
}) => {
  const { formatMessage } = useIntl();
  const [{ isRestrictionDialogVisible }] = useChangeObjects();
  const [osioidenData] = useAllSections();
  const [restrictionId, setRestrictionId] = useState(null);
  const [
    existingRajoiteChangeObjs,
    { removeRajoite, setRajoitelomakeChangeObjects, showNewRestrictionDialog }
  ] = useChangeObjectsByAnchor({
    anchor: "rajoitteet"
  });

  const onAddRestriction = useCallback(() => {
    setRestrictionId(uuidv4());
    showNewRestrictionDialog();
  }, [setRestrictionId, showNewRestrictionDialog]);

  const onModifyRestriction = useCallback(
    rajoiteId => {
      setRestrictionId(rajoiteId);
      const unsavedChangeObjs = filter(
        cObj => getAnchorPart(cObj.anchor, 1) === rajoiteId,
        existingRajoiteChangeObjs.unsaved
      );
      setRajoitelomakeChangeObjects(unsavedChangeObjs);
      showNewRestrictionDialog();
    },
    [
      existingRajoiteChangeObjs,
      setRajoitelomakeChangeObjects,
      showNewRestrictionDialog
    ]
  );

  const onRemoveRestriction = useCallback(
    rajoiteId => {
      removeRajoite(rajoiteId);
    },
    [removeRajoite]
  );

  return (
    <React.Fragment>
      {isRestrictionDialogVisible && (
        <Rajoite
          osioidenData={osioidenData}
          onChangesUpdate={onChangesUpdate}
          parentSectionId={sectionId}
          restrictionId={restrictionId}></Rajoite>
      )}
      {isRestrictionsModeOn && (
        <Lomake
          isInExpandableRow={false}
          anchor={sectionId}
          formTitle={formatMessage(rajoitteetMessages.rajoitteet)}
          functions={{
            onAddRestriction,
            onModifyRestriction,
            onRemoveRestriction
          }}
          noPadding={true}
          onChangesUpdate={onChangesUpdate}
          path={constants.formLocations}
          showCategoryTitles={true}></Lomake>
      )}
      {render ? render() : null}
    </React.Fragment>
  );
};

Rajoitteet.propTypes = {};

export default Rajoitteet;
