import React, { useCallback, useState } from "react";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import { useIntl } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import Lomake from "components/02-organisms/Lomake";
import { useAllSections } from "stores/lomakedata";
import { useChangeObjects } from "../../../../stores/muutokset";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import Rajoite from "./10-Rajoite";
import { getAnchorPart } from "utils/common";
import { filter } from "ramda";

const constants = {
  formLocations: ["esiJaPerusopetus", "rajoitteet"]
};

const Rajoitteet = ({
  isRestrictionsModeOn,
  onChangesUpdate,
  render,
  sectionId
}) => {
  const dialogSectionId = "rajoitelomake";

  const { formatMessage } = useIntl();
  const [
    { isAlirajoitedialogiVisible, isRestrictionDialogVisible }
  ] = useChangeObjects();
  const [osioidenData] = useAllSections();
  const [restrictionId, setRestrictionId] = useState(null);
  const [
    changeObjects,
    {
      setChanges,
      setRajoitelomakeChangeObjects,
      showAlirajoitedialogi,
      showNewRestrictionDialog
    }
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const onAddRestriction = useCallback(() => {
    setRestrictionId(uuidv4());
    showNewRestrictionDialog();
  }, [setRestrictionId, showNewRestrictionDialog]);

  const onModifyRestriction = useCallback(
    rajoiteId => {
      setRestrictionId(rajoiteId);
      setRajoitelomakeChangeObjects(rajoiteId, sectionId, dialogSectionId);
      showNewRestrictionDialog();
    },
    [
      sectionId,
      setRajoitelomakeChangeObjects,
      showAlirajoitedialogi,
      showNewRestrictionDialog
    ]
  );

  const onRemoveRestriction = useCallback(
    rajoiteId => {
      const updatedChangeObjects = filter(changeObj => {
        return getAnchorPart(changeObj.anchor, 1) !== rajoiteId;
      }, changeObjects);
      setChanges(updatedChangeObjects, sectionId);
    },
    [changeObjects, sectionId, setChanges]
  );

  return (
    <React.Fragment>
      {render ? render() : null}
      {isRestrictionDialogVisible && (
        <Rajoite
          osioidenData={osioidenData}
          onChangesUpdate={onChangesUpdate}
          parentSectionId={sectionId}
          restrictionId={restrictionId}
          sectionId={dialogSectionId}
        ></Rajoite>
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
          showCategoryTitles={true}
        ></Lomake>
      )}
    </React.Fragment>
  );
};

Rajoitteet.propTypes = {};

export default Rajoitteet;
