import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import CheckboxWithLabel from "../../../../../../../components/01-molecules/CheckboxWithLabel";
import { isInLupa } from "../../../../../../../css/label";

const Valtakunnallinen = React.memo(props => {
  const name = "valtakunnallinen";
  const [isChecked, setIsChecked] = useState(false);

  const handleChanges = (payload, { isChecked }) => {
    return props.callback({ payload, isChecked });
  };

  useEffect(() => {
    setIsChecked(props.isCheckedInitial || props.changes.properties.isChecked);
  }, [props.changes, props.data, props.isCheckedInitial]);

  return (
    <React.Fragment>
      <p className="pb-4">
        {props.intl.formatMessage(wizardMessages.areasInfo3)}
      </p>
      <CheckboxWithLabel
        name={`${name}-checkbox`}
        id={`${name}-checkbox`}
        isChecked={isChecked}
        labelStyles={Object.assign({}, isInLupa, { fontSize: "0.8rem" })}
        onChanges={handleChanges}
      >
        {props.intl.formatMessage(wizardMessages.responsibilities)}
      </CheckboxWithLabel>
    </React.Fragment>
  );
});

Valtakunnallinen.defaultProps = {
  changes: {}
};

Valtakunnallinen.propTypes = {
  isCheckedInitial: PropTypes.bool,
  callback: PropTypes.func,
  changes: PropTypes.object
};

export default injectIntl(Valtakunnallinen);
