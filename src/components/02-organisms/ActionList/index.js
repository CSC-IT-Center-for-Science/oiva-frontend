import React, { useMemo } from "react";
import PropTypes from "prop-types";
import * as R from "ramda";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const ActionList = React.memo(props => {
  const { removalCallback } = props;

  const handleRemoval = useMemo(() => {
    return item => {
      if (removalCallback) {
        return removalCallback(props.payload, {
          item,
          remove: true
        });
      } else {
        console.error("ActionList: removal callback function is missing.");
      }
      return false;
    };
  }, [props.payload, removalCallback]);

  const items = useMemo(() => {
    return R.addIndex(R.map)(
      (item, index) => (
        <ListItem key={`action-list-item-${index}`}>
          <ListItemText
            primary={item.title}
            secondary={item.secondaryText ? item.secondaryText : null}
          />
          {item.availableActions &&
          R.includes("remove", item.availableActions) ? (
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  return handleRemoval(item);
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </ListItemSecondaryAction>
          ) : null}
        </ListItem>
      ),
      props.items
    );
  }, [handleRemoval, props.items]);

  return (
    <React.Fragment>
      {props.title && <h4 className="pt-4">{props.title}</h4>}
      {props.info && <p className="pt-4">{props.info}</p>}
      <List dense={true}>{items}</List>
    </React.Fragment>
  );
});

ActionList.defaultProps = {
  items: []
};

ActionList.propTypes = {
  info: PropTypes.string,
  items: PropTypes.array,
  payload: PropTypes.object,
  removalCallback: PropTypes.func,
  title: PropTypes.string
};

export default ActionList;
