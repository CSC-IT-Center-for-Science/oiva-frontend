import React from "react";
import PropTypes from "prop-types";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Slot from "../../../00-atoms/Slot/Slot";

/**
 * @module Components/01-molecules
 */

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0,0,0,.125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    }
  },
  expanded: {
    margin: "auto"
  }
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0,0,0,.03)",
    borderBottom: "1px solid rgba(0,0,0,.125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    },
    alignItems: "center"
  },
  expanded: {}
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = "ExpansionPanelSummary";

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(0)
  }
}))(MuiExpansionPanelDetails);
// className="flex items-center cursor-pointer bg-grey-light hover:bg-grey p-2"
/**
 * The row can be expanded and shrinked. The div marked with data-slot="content" attribute is visible when the row is expanded.
 */
const ExpandableRow = props => {
  return (
    <ExpansionPanel
      defaultExpanded={props.shouldBeExpanded}
      onChange={props.onToggle}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        id={`${props.id}-summary`}
      >
        <div className="flex-1">
          <Slot slot="title">{props.children}</Slot>
        </div>
        <Slot slot="info">{props.children}</Slot>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Slot slot="content">{props.children}</Slot>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

ExpandableRow.defaultProps = {
  shouldBeExpanded: false
};

ExpandableRow.propTypes = {
  id: PropTypes.string,
  onToggle: PropTypes.func,
  /**
   * Shrinking and expanding works via this property.
   */
  shouldBeExpanded: PropTypes.bool
};

export default ExpandableRow;
