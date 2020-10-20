import React from "react";
import PropTypes from "prop-types";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Slot from "../../../00-atoms/Slot/Slot";

/**
 * @module Components/01-molecules
 */

const Accordion = withStyles({
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
})(MuiAccordion);

const AccordionSummary = withStyles({
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
})(props => <MuiAccordionSummary {...props} />);

AccordionSummary.muiName = "AccordionSummary";

const AccordionDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(0)
  }
}))(MuiAccordionDetails);
// className="flex items-center cursor-pointer bg-grey-light hover:bg-grey p-2"
/**
 * The row can be expanded and shrinked. The div marked with data-slot="content" attribute is visible when the row is expanded.
 */
const ExpandableRow = props => {
  return (
    <Accordion
      defaultExpanded={props.shouldBeExpanded}
      onChange={props.onToggle}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id={`${props.id}-summary`}
      >
        <div className="flex-1">
          <Slot slot="title">{props.children}</Slot>
        </div>
        <Slot slot="info">{props.children}</Slot>
      </AccordionSummary>
      <AccordionDetails>
        <Slot slot="content">{props.children}</Slot>
      </AccordionDetails>
    </Accordion>
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
