import React, { useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa";
import ClearIcon from "@material-ui/icons/Clear";

const defaultProps = {
  forChangeObject: {},
  isReadOnly: false,
  text: "[text is missing]",
  variant: "contained",
  color: "primary",
  size: "large",
  disabled: false,
  icon: null,
  iconStyles: {},
  iconContainerStyles: {},
  shouldHaveFocusAt: null
};

const SimpleButton = ({
  ariaLabel,
  color = defaultProps.color,
  disabled = defaultProps.disabled,
  forChangeObject = defaultProps.forChangeObject,
  fullAnchor,
  icon = defaultProps.icon,
  iconContainerStyles = defaultProps.iconContainerStyles,
  iconStyles = defaultProps.iconStyles,
  id,
  isReadOnly = defaultProps.isReadOnly,
  onClick,
  onFocus,
  shouldHaveFocusAt = defaultProps.shouldHaveFocusAt,
  size = defaultProps.size,
  styleAsALink,
  text = defaultProps.text,
  variant = defaultProps.variant
}) => {
  const simpleButtonRef = useRef(null);

  const baseClasses =
    "inline-block no-underline text-white hover:text-gray-100 normal-case font-normal";

  const handleClick = event => {
    if (!!onClick) {
      onClick({ forChangeObject, fullAnchor }, {}, event);
    } else {
      console.warn("SimpleButton: käsittelijä 'onClick' puuttuu", fullAnchor);
    }
  };

  useEffect(() => {
    if (shouldHaveFocusAt) {
      simpleButtonRef.current.focus();
    }
  }, [shouldHaveFocusAt]);

  return (
    <React.Fragment>
      {!isReadOnly && (
        <Button
          aria-label={ariaLabel}
          color={color}
          disabled={disabled}
          disableElevation
          disableRipple
          id={id}
          onClick={handleClick}
          ref={simpleButtonRef}
          size={size}
          variant={variant}
        >
          {icon && (
            <span style={iconContainerStyles}>
              {icon === "FaPlus" && <FaPlus style={iconStyles} />}
              {icon === "ClearIcon" && <ClearIcon style={iconStyles} />}
            </span>
          )}
          {styleAsALink ? <span className={baseClasses}>{text}</span> : text}
        </Button>
      )}
    </React.Fragment>
  );
};

SimpleButton.propTypes = {
  ariaLabel: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  id: PropTypes.string,
  isReadOnly: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  text: PropTypes.string,
  variant: PropTypes.string,
  icon: PropTypes.string,
  iconStyles: PropTypes.object,
  iconContainerStyles: PropTypes.object,
  shouldHaveFocusAt: PropTypes.number
};

export default SimpleButton;
