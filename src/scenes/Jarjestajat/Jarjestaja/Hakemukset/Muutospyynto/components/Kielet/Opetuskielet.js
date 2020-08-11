import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";

const Opetuskielet = React.memo(props => {
  const intl = useIntl();
  const sectionId = "kielet_opetuskielet";
  const { onChangesRemove, onChangesUpdate } = props;

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return (
    <React.Fragment>
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        changes={props.changeObjects.kielet.opetuskielet}
        hideAmountOfChanges={true}
        messages={changesMessages}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        sectionId={sectionId}
        title={intl.formatMessage(wizardMessages.teachingLanguages)}
        isExpanded={true}>
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={props.changeObjects.kielet.opetuskielet}
          data={{
            opetuskielet: props.opetuskielet
          }}
          onChangesUpdate={onChangesUpdate}
          path={["kielet", "opetuskielet"]}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    </React.Fragment>
  );
});

Opetuskielet.propTypes = {
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  opetuskielet: PropTypes.array
};

export default Opetuskielet;
