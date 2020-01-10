import React from "react";
import PropTypes from "prop-types";
import Icon from "../../00-atoms/Icon";
import Slot from "../../00-atoms/Slot/Slot";

const ButtonWithIcon = props => {
  return (
    <button type="button">
      {props.icon && (
        <div className="mr-4">
          <Slot slot="icon">
            <Icon />
          </Slot>
        </div>
      )}
      {props.title && <Slot slot="title" />}
    </button>
  );
};

ButtonWithIcon.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string
};

export default ButtonWithIcon;
