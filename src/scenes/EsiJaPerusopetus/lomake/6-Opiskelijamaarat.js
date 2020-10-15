import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import education from "../../../i18n/definitions/education";

const Opiskelijamaarat = ({
  changeObjects,
  lisatiedot,
  onChangesRemove,
  onChangesUpdate,
  sectionId
}) => {
  const intl = useIntl();

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      key={`expandable-row-root`}
      changes={changeObjects}
      hideAmountOfChanges={true}
      isExpanded={true}
      messages={changesMessages}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      sectionId={sectionId}
      showCategoryTitles={true}
      title={intl.formatMessage(education.oppilasOpiskelijamaarat)}>
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={changeObjects}
        data={{
          lisatiedot
        }}
        onChangesUpdate={onChangesUpdate}
        path={["esiJaPerusopetus", "opiskelijamaarat"]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
};

Opiskelijamaarat.propTypes = {
  changeObjects: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  poMuutEhdot: PropTypes.array
};

export default Opiskelijamaarat;
