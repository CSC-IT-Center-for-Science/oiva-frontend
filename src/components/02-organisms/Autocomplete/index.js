import React, { useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import chroma from "chroma-js";
import { heights, autocompleteShortStyles } from "../../../css/autocomplete";

const Autocomplete = React.memo(props => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const orderOptions = values => {
    return values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed));
  };

  const optionStyles = {
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
    multiValue: styles => {
      const color = chroma("#c3dafe");
      return {
        ...styles,
        backgroundColor: color.css()
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
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
  };

  const handleSelectChange = (value, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        value = options.filter(v => v.isFixed);
        break;
      default:
        break;
    }
    props.callback(props.payload, {
      value: Array.isArray(value) ? orderOptions(value) : value
    });
  };

  useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  const searchFilter = (option, searchText) => {
    return option.data.label.toLowerCase().includes(searchText.toLowerCase());
  };

  return (
    <React.Fragment>
      {props.title && <h4 className="py-2">{props.title}</h4>}
      <Select
        autosize={false}
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
      />
    </React.Fragment>
  );
});

Autocomplete.defaultProps = {
  isMulti: true,
  placeholder: "Valitse...",
  value: []
};

Autocomplete.propTypes = {
  isMulti: PropTypes.bool,
  name: PropTypes.string,
  callback: PropTypes.func,
  options: PropTypes.array,
  payload: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  height: PropTypes.string,
  title: PropTypes.string
};

export default injectIntl(Autocomplete);
