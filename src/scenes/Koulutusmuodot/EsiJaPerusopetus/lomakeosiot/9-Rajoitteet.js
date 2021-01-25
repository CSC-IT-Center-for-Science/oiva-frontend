import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import { useIntl } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import Lomake from "components/02-organisms/Lomake";
import { useAllSections } from "stores/lomakedata";
import { useChangeObjects } from "../../../../stores/muutokset";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import Rajoite from "./10-Rajoite";

const constants = {
  formLocations: ["esiJaPerusopetus", "rajoitteet"]
};

const Rajoitteet = ({
  isPreviewModeOn,
  isRestrictionsModeOn,
  onChangesUpdate,
  render,
  sectionId
}) => {
  const dialogSectionId = "rajoitelomake";

  const { formatMessage } = useIntl();
  const [{ isRestrictionDialogVisible }] = useChangeObjects();
  const [osioidenData] = useAllSections();
  const [restrictionId, setRestrictionId] = useState(null);
  const [
    changeObjects,
    { setChanges, setRajoitelomakeChangeObjects, showNewRestrictionDialog }
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
    [sectionId, setRajoitelomakeChangeObjects, showNewRestrictionDialog]
  );

  const onRemoveRestriction = useCallback(
    rajoiteId => {
      setChanges([], `${sectionId}_${rajoiteId}`);
    },
    [sectionId, setChanges]
  );

  return (
    <React.Fragment>
      {isRestrictionDialogVisible && !isPreviewModeOn && (
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
          changeObjects={changeObjects}
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
      {render ? render() : null}
    </React.Fragment>
  );
};

Rajoitteet.propTypes = {
  isPreviewModeOn: PropTypes.bool
};

export default Rajoitteet;
