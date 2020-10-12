import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../components/02-organisms/Lomake";
import common from "../../../i18n/definitions/common";
import education from "../../../i18n/definitions/education";
import { equals } from "ramda";

const OpetuksenJarjestamismuoto = React.memo(
  ({
    changeObjects,
    onChangesRemove,
    onChangesUpdate,
    opetuksenJarjestamismuodot,
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
        title={intl.formatMessage(education.opetuksenJarjestamismuodot)}>
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={changeObjects}
          data={{
            opetuksenJarjestamismuodot
          }}
          onChangesUpdate={onChangesUpdate}
          path={["esiJaPerusopetus", "opetuksenJarjestamismuoto"]}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    );
  },
  (currentProps, nextProps) => {
    return equals(currentProps.changeObjects, nextProps.changeObjects);
  }
);

OpetuksenJarjestamismuoto.defaultProps = {
  changeObjects: []
};

OpetuksenJarjestamismuoto.propTypes = {
  changeObjects: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  opetuksenJarjestamismuodot: PropTypes.array,
  sectionId: PropTypes.string
};

export default OpetuksenJarjestamismuoto;
