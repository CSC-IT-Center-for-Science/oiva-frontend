import React, { useState, useEffect } from "react";
import TextBox from "../../../../00-atoms/TextBox";
import * as R from "ramda";

export const CategorizedListTextBox = ({
  changeObj = {},
  parentComponent,
  parentChangeObj,
  propsObj,
  payload,
  onChanges,
  idSuffix
}) => {
  const [value, setValue] = useState();
  let isDisabled = false;
  if (parentComponent) {
    isDisabled =
      R.includes(parentComponent.name, [
        "CheckboxWithLabel",
        "RadioButtonWithLabel"
      ]) &&
      ((!parentComponent.properties.isChecked &&
        R.isEmpty(parentChangeObj.properties)) ||
        !parentChangeObj.properties.isChecked);
  }

  useEffect(() => {
    const initialValue =
      R.path(["properties", "value"], changeObj) ||
      propsObj.value ||
      propsObj.defaultValue ||
      "";
    setValue(initialValue);
  }, [changeObj, propsObj.defaultValue, propsObj.value]);

  return (
    <div className={`w-full ${payload.component.styleClasses}`}>
      <TextBox
        id={`textbox-${idSuffix}`}
        isDisabled={isDisabled}
        isHidden={isDisabled}
        onChanges={onChanges}
        payload={payload}
        placeholder={propsObj.placeholder}
        isReadOnly={propsObj.isReadOnly}
        title={propsObj.title}
        value={value}
      />
    </div>
  );
};

export default CategorizedListTextBox;
