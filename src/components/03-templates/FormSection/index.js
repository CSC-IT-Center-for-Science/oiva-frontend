import React, { useCallback } from "react";
import PropTypes from "prop-types";

import Section from "../Section";
const FormSection = React.memo(
  ({
    children,
    code,
    id,
    muutoshakemus,
    render,
    runOnChanges,
    runOnStateUpdate,
    title
  }) => {
    const updateChanges = useCallback(
      payload => {
        runOnChanges(payload.anchor, payload.changes);
      },
      [runOnChanges]
    );

    const updateState = useCallback(
      (data, sectionId) => {
        runOnStateUpdate(sectionId || id, data);
      },
      [id, runOnStateUpdate]
    );

    const removeChanges = useCallback(
      (...payload) => {
        return updateChanges({ anchor: payload[1], changes: [] });
      },
      [updateChanges]
    );

    return (
      <Section code={code} title={title}>
        {!!render
          ? render({
              muutoshakemus,
              onChangesRemove: removeChanges,
              onChangesUpdate: updateChanges,
              onStateUpdate: updateState,
              sectionId: id
            })
          : null}
        {children}
      </Section>
    );
  }
);

FormSection.propTypes = {
  id: PropTypes.string,
  code: PropTypes.number,
  muutoshakemus: PropTypes.object,
  runOnChanges: PropTypes.func,
  runOnStateUpdate: PropTypes.func,
  title: PropTypes.string
};

export default FormSection;
