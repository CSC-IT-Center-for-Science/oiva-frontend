import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";
import { useIntl } from "react-intl";
import { v4 as uuidv4 } from "uuid";
import Lomake from "components/02-organisms/Lomake";
import { useAllSections } from "stores/lomakedata";
import { useChangeObjects } from "stores/muutokset";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import Rajoitedialogi from "components/02-organisms/Rajoitedialogi/index";

const constants = {
  formLocations: ["rajoitteet"]
};

const Rajoitteet = ({
  maaraykset,
  isPreviewModeOn,
  isRestrictionsModeOn,
  kohdevaihtoehdot,
  koulutustyyppi,
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
      {render ? render() : null}
      {isRestrictionDialogVisible && !isPreviewModeOn && (
        <Rajoitedialogi
          kohdevaihtoehdot={kohdevaihtoehdot}
          koulutustyyppi={koulutustyyppi}
          osioidenData={osioidenData}
          onChangesUpdate={onChangesUpdate}
          parentSectionId={sectionId}
          restrictionId={restrictionId}
          sectionId={dialogSectionId}
        ></Rajoitedialogi>
      )}
      {isRestrictionsModeOn && !isPreviewModeOn && (
        <div className="pt-8">
          <Lomake
            isInExpandableRow={false}
            anchor={sectionId}
            changeObjects={changeObjects}
            data={{ restrictions: maaraykset }}
            formTitle={formatMessage(rajoitteetMessages.rajoitteet)}
            functions={{
              onAddRestriction,
              onModifyRestriction,
              onRemoveRestriction
            }}
            mode={"listaus"}
            noPadding={true}
            onChangesUpdate={onChangesUpdate}
            path={constants.formLocations}
            showCategoryTitles={true}
          ></Lomake>
        </div>
      )}
    </React.Fragment>
  );
};

Rajoitteet.propTypes = {
  isPreviewModeOn: PropTypes.bool,
  kohdevaihtoehdot: PropTypes.array.isRequired
};

export default Rajoitteet;
