import React from "react";
import PropTypes from "prop-types";
import CheckboxWithLabel from "../01-molecules/CheckboxWithLabel";
import { isInLupa, isAdded, isRemoved } from "../../css/label";
// import Dropdown from "../00-atoms/Dropdown/Dropdown";

const SelectableItem = props => {
  const handleCheckboxChange = () => {
    props.onChanges(props.item);
  };

  // const handleSelectChange = () => {
  //   props.onChanges(props.item, true);
  // };

  const handleSubCheckboxChange = () => {
    props.onChanges(props.item, true);
  };

  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" }
  // ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <CheckboxWithLabel
          name={`checkbox-with-label-${props.item.code}`}
          isChecked={props.item.shouldBeSelected}
          onChanges={handleCheckboxChange}
          labelStyles={Object.assign(
            {},
            props.item.isAdded ? isAdded : {},
            props.item.isRemoved ? isRemoved : {},
            props.item.isInLupa ? isInLupa : {}
          )}
        >
          <span>{props.item.code}</span>
          <span className="ml-4 leading-none">{props.item.title}</span>
          {/* <span className="ml-10">
              {props.item.isInLupa ? "LUPA" : ""}
            </span>
            <span className="ml-10">
              {props.item.isRemoved ? "POISTETTU" : ""}
            </span>
            <span className="ml-10">
              {props.item.isAdded ? "LISÄTTY" : ""}
            </span> */}
        </CheckboxWithLabel>
        <div className="w-48">
          {/* <Dropdown
            options={options}
            isDisabled={!props.item.shouldBeSelected}
          /> */}
        </div>
      </div>
      {props.item.subItems && props.item.subItems.length > 0 && (
        <div className="p-4">
          <CheckboxWithLabel
            name={`sub-item-${props.item.code}`}
            isChecked={props.item.subItems[0].shouldBeSelected}
            onChanges={handleSubCheckboxChange}
          >
            <span style={{ marginLeft: 8 }}>
              <span className="ml-4" style={{ marginLeft: 8 }}>
                {props.item.subItems[0].code}
              </span>
              <span className="ml-4">{props.item.subItems[0].title}</span>
            </span>
          </CheckboxWithLabel>
        </div>
      )}
    </div>
  );
};

SelectableItem.propTypes = {
  item: PropTypes.object,
  onChanges: PropTypes.func
};

export default SelectableItem;
