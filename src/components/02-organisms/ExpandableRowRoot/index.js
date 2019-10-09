import React, { useState } from "react";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import ExpandableRow from "./ExpandableRow";
import CategorizedListRoot from "../CategorizedListRoot";
import NumberOfChanges from "components/00-atoms/NumberOfChanges";
import { makeStyles } from "@material-ui/core/styles";
import UndoIcon from "@material-ui/icons/Undo";
import * as R from "ramda";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import commonMessages from "../../../i18n/definitions/common";

const useStyles = makeStyles(() => ({
  button: {
    padding: 0
  }
}));

const compare = (prevProps, nextProps) => {
  const sameCategories = R.equals(prevProps.categories, nextProps.categories);
  const sameChanges = R.equals(prevProps.changes, nextProps.changes);
  return sameCategories && sameChanges;
};

const defaultProps = {
  categories: [],
  changes: [],
  disableReverting: false,
  hideAmountOfChanges: false,
  isExpanded: false,
  showCategoryTitles: false
};

const ExpandableRowRoot = React.memo(
  ({
    anchor,
    categories = defaultProps.categories,
    changes = defaultProps.changes,
    children,
    code,
    disableReverting = defaultProps.disableReverting,
    hideAmountOfChanges = defaultProps.hideAmountOfChanges,
    index,
    intl,
    isExpanded = defaultProps.isExpanded,
    onChangesRemove,
    onUpdate,
    sectionId,
    showCategoryTitles = defaultProps.showCategoryTitles,
    title
  }) => {
    const classes = useStyles();
    const [isToggledOpen, setIsToggleOpen] = useState(false);

    const onToggle = (...props) => {
      setIsToggleOpen(props[1]);
    };

    return (
      <React.Fragment>
        {categories && (
          <ExpandableRow shouldBeExpanded={isExpanded} onToggle={onToggle}>
            <h4 data-slot="title" className="opacity-75">
              {code && <span className="pr-6">{code}</span>}
              <span>{title}</span>
            </h4>
            <div data-slot="info">
              {changes.length > 0 && (
                <div className="flex items-center">
                  {!hideAmountOfChanges && (
                    <NumberOfChanges changes={changes} />
                  )}
                  {!disableReverting && (
                    <span className="mx-6">
                      <Tooltip title={intl.formatMessage(commonMessages.undo)}>
                        <IconButton
                          className={classes.button}
                          variant="outlined"
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            return onChangesRemove(sectionId, anchor, index);
                          }}
                        >
                          <UndoIcon />
                        </IconButton>
                      </Tooltip>
                    </span>
                  )}
                </div>
              )}
            </div>
            <div
              data-slot="content"
              className={`w-full ${!children ? "p-8" : ""}`}
            >
              {!children && (isExpanded || isToggledOpen) ? (
                <CategorizedListRoot
                  anchor={anchor}
                  categories={categories}
                  changes={changes}
                  index={index}
                  onUpdate={onUpdate}
                  sectionId={sectionId}
                  showCategoryTitles={showCategoryTitles}
                />
              ) : (
                children
              )}
            </div>
          </ExpandableRow>
        )}
      </React.Fragment>
    );
  },
  compare
);

ExpandableRowRoot.propTypes = {
  anchor: PropTypes.string,
  categories: PropTypes.array,
  changes: PropTypes.array,
  code: PropTypes.string,
  disableReverting: PropTypes.bool,
  hideAmountOfChanges: PropTypes.bool,
  index: PropTypes.number,
  isExpanded: PropTypes.bool,
  onChangesRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  sectionId: PropTypes.string,
  showCategoryTitles: PropTypes.bool,
  title: PropTypes.string
};

export default injectIntl(ExpandableRowRoot);
