import React from "react";
import {
  List as MaterialUIList,
  ListItem,
  ListItemIcon
} from "@material-ui/core";
import { addIndex, map } from "ramda";
import { withStyles } from "@material-ui/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const StyledList = withStyles({
  root: {
    listStyle: "circle"
  }
})(MaterialUIList);

const StyledFiberManualRecordIcon = withStyles({
  root: {
    transform: "scale(0.5)"
  }
})(FiberManualRecordIcon);

const List = ({ items }) => {
  const itemsToRender = addIndex(map)(
    (item, index) => (
      <ListItem disableGutters={true} key={`list-item-${index}`}>
        <ListItemIcon>
          <StyledFiberManualRecordIcon />
        </ListItemIcon>
        {item.content}
      </ListItem>
    ),
    items
  );

  return (
    <StyledList dense={true} disablePadding={true}>
      {itemsToRender}
    </StyledList>
  );
};

export default List;
