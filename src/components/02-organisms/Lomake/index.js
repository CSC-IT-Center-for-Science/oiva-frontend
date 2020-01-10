import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import CategorizedListRoot from "../CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";

const defaultProps = {
  changeObjects: []
};

const Lomake = React.memo(
  ({
    action,
    anchor,
    changeObjects = defaultProps.changeObjects,
    data,
    isReadOnly,
    locale = "fi",
    onChangesUpdate,
    path,
    prefix = "",
    showCategoryTitles = true
  }) => {
    const categories = useMemo(() => {
      return getLomake(action, data, isReadOnly, locale, path, prefix);
    }, [action, data, isReadOnly, locale, path, prefix]);

    if (categories.length && onChangesUpdate) {
      return (
        <div className="p-8">
          <CategorizedListRoot
            anchor={anchor}
            categories={categories}
            changes={changeObjects}
            onUpdate={onChangesUpdate}
            showCategoryTitles={showCategoryTitles}
          />
        </div>
      );
    } else {
      return <div>Nothing so show.</div>;
    }
  }
);

Lomake.propTypes = {
  anchor: PropTypes.string,
  changeObjects: PropTypes.array,
  data: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  path: PropTypes.array,
  // Is used for matching the anchor of reasoning field to the anchor of
  // original change object.
  prefix: PropTypes.string
};

export default injectIntl(Lomake);
