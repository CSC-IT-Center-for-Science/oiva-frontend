import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { heights, autocompleteShortStyles } from "../../../css/autocomplete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CheckIcon from "@material-ui/icons/Check";
import * as R from "ramda";

/**
 * Multiselect wraps a Autocomplete https://material-ui.com/components/autocomplete
 * Sends value to callback.
 * @param props
 * @returns {*}
 * @constructor
 */

// TODO:
// 1 If group is selected, show only group as selected
// 2 If option is selected when it's group was already selected, unselect option,
// deselect group but show all other options selected in that group
// (or is not going to work, select it and deselect group?)
// 3 Required styles

const Multiselect = React.memo(props => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const orderOptions = values => {
    return values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed));
  };

  const optionStyles = {
    ...(props.height === heights.SHORT ? autocompleteShortStyles : null)
  };

  const handleSelectChange = (event, value, selected, groupItem) => {
    // Removed by X in a chip, go through selected group if one needed to be removed
    if (!groupItem) {
      const newSelectedGroups = R.filter(groupval => {
        return R.includes(
          { label: groupval, value: groupval, group: groupval },
          value
        );
      }, selectedGroups);
      setSelectedGroups(newSelectedGroups);
      // Then set value and call call back
      setValue(value);
      props.callback(props.payload, {
        value: Array.isArray(value) ? orderOptions(value) : value
      });
    } else if (!selected) {
      // group clicked, adds group into selected groups
      setSelectedGroups([...selectedGroups, groupItem]);

      setValue(value);
      props.callback(props.payload, {
        value: Array.isArray(value) ? orderOptions(value) : value
      });
    } else {
      // group was already selected, removes group from selected groups
      let newArray = selectedGroups;
      newArray.splice(newArray.indexOf(groupItem), 1);
      setSelectedGroups(newArray);
      // ..., removes group from values groups
      const newValue = R.filter(val => {
        return val.value !== groupItem;
      }, value);

      setValue(newValue);
      props.callback(props.payload, {
        value: Array.isArray(newValue) ? orderOptions(newValue) : newValue
      });
    }
  };

  // shown options with grouping
  useEffect(() => {
    setOptions(
      props.options && props.options[0].group
        ? props.options
        : props.options &&
            props.options.map(option => {
              // if first option does not have a group, use first letters as groups
              const firstLetter = option.label && option.label[0].toUpperCase();
              return {
                ...option,
                group: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter
              };
            })
    );
  }, [props.options]);

  // add selected groups from values
  useEffect(() => {
    if (props.options && props.options[0].group) {
      const groups =
        props.value &&
        R.filter(option => {
          return option.label === option.group;
        }, props.value);
      if (groups)
        setSelectedGroups(
          R.map(prop => {
            return prop.label;
          }, groups)
        );
    }
  }, [props.value, props.options]);

  // custom group headers with selecting and unselecting
  const renderGroup = params => {
    const selected = selectedGroups
      ? selectedGroups.includes(params.key)
      : false;
    return [
      <div
        key={params.key}
        className={`pl-3 pr-4 py-2 w-full flex flex-row justify-between cursor-pointer hover:bg-gray-100 ${selected &&
          "bg-gray-200"}`}
        onClick={() => {
          handleSelectChange(
            null,
            [
              ...value,
              { label: params.key, value: params.key, group: params.key }
            ],
            selected,
            params.key
          );
        }}>
        <span>{params.key}</span>
        {selected && <CheckIcon />}
      </div>,
      params.children
    ];
  };

  return (
    <React.Fragment>
      <Autocomplete
        id={props.id}
        aria-label={props.ariaLabel}
        autoComplete={true}
        autosize={props.autosize}
        multiple={props.isMulti}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label={props.title}
            placeholder={props.placeholder}
            required={props.isRequired}
          />
        )}
        groupBy={option => option.group}
        renderGroup={renderGroup}
        renderOption={(option, { selected }) => (
          <div className="w-full flex flex-row justify-between">
            <span>{option.label}</span>
            <CheckIcon
              style={{ visibility: selected ? "visible" : "hidden" }}
            />
          </div>
        )}
        getOptionSelected={(option, value) => option.label === value.label}
        value={value}
        onChange={handleSelectChange}
        options={options}
        getOptionLabel={option => option && option.label}
        styles={optionStyles}
        width={props.width}
        required={props.isRequired}
        disableCloseOnSelect
        disableClearable
        disabled={props.isDisabled}
      />
    </React.Fragment>
  );
});

Multiselect.defaultProps = {
  isMulti: true,
  isRequired: false,
  isValid: true,
  value: [],
  isSearch: false,
  minChars: 3,
  width: "100%",
  autoSize: false
};

Multiselect.propTypes = {
  id: PropTypes.string,
  /** aria-label as string */
  ariaLabel: PropTypes.string,
  /** If multiple selection is possible as boolean */
  isMulti: PropTypes.bool,
  /** If required as boolean */
  isRequired: PropTypes.bool,
  /** If valid as boolean */
  isValid: PropTypes.bool,
  /** Callback function for value change */
  callback: PropTypes.func,
  /** Option for selection as array (with possible groups) */
  options: PropTypes.array,
  /** Custom object defined by user. */
  payload: PropTypes.object,
  /** Place holder text */
  placeholder: PropTypes.string,
  /** Value as array */
  value: PropTypes.array,
  /** Height as string (css) */
  height: PropTypes.string,
  /** Width as string (css), default 100% */
  width: PropTypes.string,
  /** If autosizing by text widh, default false */
  autosize: PropTypes.bool,
  /** Label as string */
  title: PropTypes.string,
  /** If disabled as boolean */
  isDisabled: PropTypes.bool
};

export default Multiselect;
