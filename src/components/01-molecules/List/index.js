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

const StyledListItemIcon = withStyles({
  root: {
    minWidth: "1rem"
  }
})(ListItemIcon);

const StyledFiberManualRecordIcon = withStyles({
  root: {
    color: "#000000",
    transform: "scale(0.3)",
  }
})(FiberManualRecordIcon);

const List = ({ items }) => {
  const itemsToRender = addIndex(map)(
    (item, index) => (
      <ListItem disableGutters={true} key={`list-item-${index}`}>
        <StyledListItemIcon>
          <StyledFiberManualRecordIcon />
        </StyledListItemIcon>
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
