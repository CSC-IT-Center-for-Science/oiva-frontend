import React from "react";
import PropTypes from "prop-types";
import Section from "components/03-templates/Section";

const FormSection = ({ children, code, render, sectionId, title }) => {
  return (
    <Section code={code} title={title}>
      {render
        ? render({
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

export default FormSection;
