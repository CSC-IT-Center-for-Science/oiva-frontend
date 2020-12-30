import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import PropTypes from "prop-types";
import chroma from "chroma-js";
import {
  heights,
  autocompleteShortStyles,
  autocompleteWidthStyles
} from "../../../css/autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import InputLabel from "@material-ui/core/InputLabel";
import { equals, map } from "ramda";

/**
 * Autocomplete wraps a Select
 * Sends value to callback.
 * Two versions:
 *  [isSearch = false] autocomplete with arrow (list can be opened anytime)
 *  [isSearch = true] autocomplete with search icon (list opens when typed character >= minChars)
 * @param props
 * @returns {*}
 * @constructor
 */

const Autocomplete = React.memo(
  props => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState([]);
    const [, setMinCharacters] = useState(3);
    const [isOptionsShown, setIsOptionsShown] = useState(false);

    useEffect(() => {
      setValue(props.value);
    }, [props.value]);

    const orderOptions = values => {
      return values
        .filter(v => v.isFixed)
        .concat(values.filter(v => !v.isFixed));
    };

    const optionStyles = Object.assign(
      {},
      {
        ...(props.height === heights.SHORT ? autocompleteShortStyles : null),

        control:
          props.height === heights.SHORT
            ? autocompleteShortStyles.control
            : styles => ({
                ...styles,
                backgroundColor: "white"
              }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          const color = chroma("#c3dafe");
          return {
            ...styles,
            backgroundColor: isDisabled
              ? null
              : isSelected
              ? data.color
              : isFocused
              ? color.css()
              : null,
            color: isDisabled
              ? "#ccc"
              : isSelected
              ? chroma.contrast(color, "white") > 2
                ? "white"
                : "black"
              : data.color,
            cursor: isDisabled ? "not-allowed" : "default",

            ":active": {
              ...styles[":active"],
              backgroundColor:
                !isDisabled && (isSelected ? data.color : color.css())
            }
          };
        },
        indicatorSeparator: styles => ({ display: "none" }),
        menu: styles => ({ ...styles, zIndex: 999 }),
        multiValue: styles => {
          const color = chroma("#c3dafe");
          return {
            ...styles,
            backgroundColor: color.css()
          };
        },
        multiValueLabel: (styles, { data }) => ({
          ...styles,
          whiteSpace: "normal",
          color: data.color
        }),
        multiValueRemove: (styles, { data }) => ({
          ...styles,
          color: data.color,
          ":hover": {
            backgroundColor: data.color,
            color: "#666666"
          }
        })
      },
      props.short ? autocompleteWidthStyles : {}
    );

    const handleSelectChange = (value, { action, removedValue }) => {
      switch (action) {
        case "remove-value":
        case "pop-value":
          if (removedValue && removedValue.isFixed) {
            return;
          }
          break;
        case "clear":
          value = options.filter(v => v.isFixed);
          break;
        default:
          break;
      }
      props.callback(
        {
          forChangeObject: props.forChangeObject,
          fullAnchor: props.fullAnchor
        },
        {
          value: Array.isArray(value) ? orderOptions(value) : value || []
        }
      );
    };

    useEffect(() => {
      setOptions(props.options);
    }, [props.options]);

    useEffect(() => {
      setMinCharacters(3);
      props.minChars <= 0
        ? setMinCharacters(props.minChars)
        : props.isSearch && setMinCharacters(3);
    }, [props.isSearch, props.minChars]);

    const searchFilter = (option, searchText) => {
      return option.data.label.toLowerCase().includes(searchText.toLowerCase());
    };

    const DropdownIndicator = props => {
      return (
        <components.DropdownIndicator {...props}>
          <SearchIcon />
        </components.DropdownIndicator>
      );
    };

    const onInputChange = value => {
      value.length >= props.minChars
        ? setIsOptionsShown(true)
        : setIsOptionsShown(false);
    };

    return props.isVisible ? (
      <React.Fragment>
        {props.isPreviewModeOn || props.isReadOnly ? (
          <ul className="ml-8 list-disc mb-4">
            {map(
              value =>
                value ? <li key={value.value}>{value.label}</li> : null,
              value || []
            ).filter(Boolean)}
          </ul>
        ) : (
          <React.Fragment>
            {props.title && (
              <InputLabel
                required={props.isRequired}
                style={{ marginBottom: "0.2em" }}
              >
                {props.title}
              </InputLabel>
            )}
            {props.isSearch ? (
              <Select
                autosize={props.autosize}
                name={props.name}
                isMulti={props.isMulti}
                value={value}
                onChange={handleSelectChange}
                placeholder={props.placeholder}
                inputProps={{
                  id: "select-multiple"
                }}
                options={isOptionsShown ? options : []}
                getOptionLabel={option => `${option.label}`}
                getOptionValue={option => `${option.value}`}
                isSearchable={true}
                searchFilter={searchFilter}
                styles={optionStyles}
                components={props.isSearch && { DropdownIndicator }}
                hideSelectedOptions={props.isSearch}
                onInputChange={onInputChange}
                menuIsOpen={isOptionsShown}
                width={props.width}
                required={props.isRequired}
              />
            ) : (
              <Select
                autosize={props.autosize}
                name={props.name}
                isMulti={props.isMulti}
                value={value}
                onChange={handleSelectChange}
                placeholder={props.placeholder}
                inputProps={{
                  id: "select-multiple"
                }}
                options={options}
                getOptionLabel={option => `${option.label}`}
                getOptionValue={option => `${option.value}`}
                isSearchable={true}
                searchFilter={searchFilter}
                styles={optionStyles}
                hideSelectedOptions={props.hideSelectedOptions}
                width={props.width}
                required={props.isRequired}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    ) : null;
  },
  (cp, np) => {
    return (
      equals(cp.isPreviewModeOn, np.isPreviewModeOn) &&
      equals(cp.isValid, np.isValid) &&
      equals(cp.isVisible, np.isVisible) &&
      equals(cp.options, np.options) &&
      equals(cp.value, np.value) &&
      equals(cp.height, np.height) &&
      equals(cp.width, np.width) &&
      equals(cp.short, np.short)
    );
  }
);

Autocomplete.defaultProps = {
  isMulti: true,
  isRequired: false,
  isValid: true,
  isVisible: true,
  placeholder: "Valitse...",
  value: [],
  isSearch: false,
  minChars: 3,
  width: "100%",
  autoSize: false,
  hideSelectedOptions: true
};

Autocomplete.propTypes = {
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  isMulti: PropTypes.bool,
  isRequired: PropTypes.bool,
  isValid: PropTypes.bool,
  isVisible: PropTypes.bool,
  name: PropTypes.string,
  callback: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  height: PropTypes.string,
  isSearch: PropTypes.bool,
  minChars: PropTypes.number,
  width: PropTypes.string,
  autosize: PropTypes.bool,
  title: PropTypes.string,
  short: PropTypes.bool,
  hideSelectedOptions: PropTypes.bool
};

export default Autocomplete;
