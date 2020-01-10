import React, { useEffect, useState } from "react";
import WizardActions from "./WizardActions";
import PropTypes from "prop-types";

const WizardPage = props => {
  const [isSavingEnabled, setIsSavingEnabled] = useState(false);
  const { onSave } = props;

  const save = (options) => {
    // setIsSavingEnabled(false); // todo: fix by enabling again when changes
    onSave(options);
  };

  useEffect(() => {
    setIsSavingEnabled(true);
  }, [props.changeObjects]);

  return (
    <div>
      {props.children}
      <WizardActions
        pageNumber={props.pageNumber}
        onPrev={props.onPrev}
        onNext={props.onNext}
        onSave={save}
        isSavingEnabled={isSavingEnabled}
      />
    </div>
  );
};

WizardPage.defaultProps = {
  changes: []
};

WizardPage.propTypes = {
  lupa: PropTypes.object,
  changeObjects: PropTypes.object,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  pageNumber: PropTypes.number
};

export default WizardPage;
