import React from "react";
import WizardActions from "./WizardActions";
import PropTypes from "prop-types";

/**
 * WizardPage renders the given content and passes the related actions forward
 * for proper handling.
 *
 * @param {*} props 
 */
const WizardPage = props => {
  function preview() {
    props.onAction("preview");
  }

  function save() {
    props.onAction("save");
  }

  function send() {
    props.onAction("send");
  }

  return (
    <div>
      {props.children}
      <WizardActions
        pageNumber={props.pageNumber}
        onPrev={props.onPrev}
        onNext={props.onNext}
        onPreview={preview}
        onSend={send}
        onSave={save}
        isSavingEnabled={props.isSavingEnabled}
      />
    </div>
  );
};

WizardPage.propTypes = {
  isSavingEnabled: PropTypes.bool,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onAction: PropTypes.func,
  pageNumber: PropTypes.number
};

export default WizardPage;
