import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import { equals } from "ramda";

const MuutEhdot = React.memo(
  ({ changeObjects, onChangesRemove, onChangesUpdate, poMuutEhdot }) => {
    const intl = useIntl();
    const sectionId = "poMuutEhdot";

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
        title={"Muut koulutukseen liittyvät ehdot"}>
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={changeObjects}
          data={{
            poMuutEhdot
          }}
          onChangesUpdate={onChangesUpdate}
          path={["esiJaPerusopetus", "muutEhdot"]}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    );
  },
  (currentProps, nextProps) => {
    return equals(currentProps.changeObjects, nextProps.changeObjects);
  }
);

MuutEhdot.propTypes = {
  changeObjects: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  poMuutEhdot: PropTypes.array
};

export default MuutEhdot;
