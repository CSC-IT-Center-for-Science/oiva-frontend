import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Section from "../Section";
import { equals } from "ramda";

const FormSection = React.memo(
  ({ children, code, id, render, runOnChanges, title }) => {
    const updateChanges = useCallback(
      payload => {
        runOnChanges(payload.anchor, payload.changes);
      },
      [runOnChanges]
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
              onChangesRemove: removeChanges,
              onChangesUpdate: updateChanges,
              sectionId: id
            })
          : null}
        {children}
      </Section>
    );
  },
  (cp, np) => {
    console.info(cp, np, equals(cp, np));
    return false;
  }
);

FormSection.propTypes = {
  id: PropTypes.string,
  code: PropTypes.number,
  runOnChanges: PropTypes.func,
  title: PropTypes.string
};

FormSection.customName = "FormSection";

export default FormSection;
