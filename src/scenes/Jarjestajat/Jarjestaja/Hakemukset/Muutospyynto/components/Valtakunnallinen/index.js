import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import CheckboxWithLabel from "../../../../../../../components/01-molecules/CheckboxWithLabel";
import { isInLupa } from "../../../../../../../css/label";
import * as R from "ramda";

const Valtakunnallinen = React.memo(props => {
  const name = "valtakunnallinen";
  const [isChecked, setIsChecked] = useState(false);
  const [isInitiallyChecked, setInitial] = useState(false);

  const handleChange = (payload, { isChecked }) => {
    return props.callback({ payload, isChecked });
  };

  useEffect(() => {
    setIsChecked(props.change.tila === "LISAYS" || (props.change.tila !== "POISTO" && props.isCheckedInitial));
  }, [props.change, props.data, props.isCheckedInitial]);

  // useEffect(() => {
  //   console.log(props.initialValues)
  //   console.log(props.values)
  //   setInitial(
  //     !!R.find(R.propEq("koodisto", "nuts1"), props.initialValues)
  //   );
  // }, [props.initialValues, props.values]);
  // console.log(isInitiallyChecked)

  return (
    <>
      <p className="pb-4">
        {props.intl.formatMessage(wizardMessages.areasInfo3)}
      </p>
      <CheckboxWithLabel
        name={`${name}-checkbox`}
        id={`${name}-checkbox`}
        isChecked={isChecked}
        labelStyles={Object.assign({}, isInLupa, { fontSize: "0.8rem" })}
        onChanges={handleChange}
      >
        {props.intl.formatMessage(wizardMessages.responsibilities)}
      </CheckboxWithLabel>
    </>
  );
});

Valtakunnallinen.defaultProps = {
  change: {}
};

Valtakunnallinen.propTypes = {
  isCheckedInitial: PropTypes.bool,
  callback: PropTypes.func,
  change: PropTypes.object,
  initialValues: PropTypes.array,
  values: PropTypes.array
};

export default injectIntl(Valtakunnallinen);
