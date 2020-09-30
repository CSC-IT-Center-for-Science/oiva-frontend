import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Section from "components/03-templates/Section";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";

const FormSection = ({ children, code, render, sectionId, title }) => {
  const [, actions] = useEsiJaPerusopetus();

  const updateChanges = useCallback(payload => {
    actions.setChangeObjects(payload.anchor, payload.changes);
  }, [actions]);

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
            sectionId
          })
        : null}
      {children}
    </Section>
  );
};

FormSection.propTypes = {
  code: PropTypes.number,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

FormSection.customName = "FormSection";

export default FormSection;
