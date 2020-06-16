import React, { useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";
import { join, map, path } from "ramda";
import { cloneDeep } from "lodash";
import { useIntl } from "react-intl";
import { useMetadata } from "../../../stores/metadata";
import { isEqual } from "lodash";

function markRequiredFields(lomake, changeObjects = [], rules = []) {
  let modifiedLomake = cloneDeep(lomake);
  const invalidFields = map(rule => {
    const isRequired = rule.isRequired(modifiedLomake, changeObjects);
    modifiedLomake = rule.markRequiredFields(modifiedLomake, isRequired);
    const isValid = rule.isValid(modifiedLomake, changeObjects, isRequired)();
    modifiedLomake = rule.showErrors(modifiedLomake, isValid);
    return !isValid;
  }, rules).filter(Boolean);
  return { categories: modifiedLomake, invalidFields, ruleCount: rules.length };
}

const defaultProps = {
  changeObjects: [],
  uncheckParentWithoutActiveChildNodes: false
};

const Lomake = React.memo(
  ({
    action,
    anchor,
    changeObjects = defaultProps.changeObjects,
    data,
    metadata,
    isReadOnly,
    onChangesUpdate,
    path: _path,
    prefix = "",
    rules = [],
    rulesFn,
    showCategoryTitles = true,
    uncheckParentWithoutActiveChildNodes = defaultProps.uncheckParentWithoutActiveChildNodes
  }) => {
    const intl = useIntl();
    const [meta, metadataActions] = useMetadata();

    const lomakeId = `${anchor}.${prefix}.${join(".", _path || [])}.${action}`;

    const showValidationErrors =
      path(["lomakkeet", "latauskerrat", lomakeId], meta) > 1;

    useEffect(() => {
      metadataActions.registerLomakeLoad(lomakeId);
    }, [lomakeId, metadataActions]);

    const lomake = useMemo(() => {
      let categories = getLomake(
        action,
        data,
        isReadOnly,
        intl.locale,
        _path,
        prefix
      );
      let result = { categories, invalidFields: [], ruleCount: 0 };
      let _rules = cloneDeep(rules);
      if (rulesFn) {
        _rules = rulesFn(categories);
      }
      if (_rules.length) {
        result = markRequiredFields(categories, changeObjects, _rules);
      }
      return {
        categories: result.categories,
        invalidFields: result.invalidFields.length,
        ruleCount: result.ruleCount,
        metadata
      };
    }, [
      action,
      changeObjects,
      data,
      intl.locale,
      isReadOnly,
      metadata,
      _path,
      prefix,
      rules,
      rulesFn
    ]);

    if (
      lomake.categories &&
      lomake.invalidFields !== undefined &&
      onChangesUpdate
    ) {
      return (
        <React.Fragment>
          <div className="p-8">
            <CategorizedListRoot
              anchor={anchor}
              categories={lomake.categories}
              changes={changeObjects}
              onUpdate={onChangesUpdate}
              showCategoryTitles={showCategoryTitles}
              showValidationErrors={showValidationErrors}
              uncheckParentWithoutActiveChildNodes={
                uncheckParentWithoutActiveChildNodes
              }
            />
          </div>
        </React.Fragment>
      );
    } else {
      return <div>Nothing to show.</div>;
    }
  },
  (prevState, nextState) => {
    const isSameOld =
      isEqual(prevState.changeObjects, nextState.changeObjects) &&
      isEqual(prevState.data, nextState.data);
    return isSameOld;
  }
);

Lomake.propTypes = {
  anchor: PropTypes.string,
  changeObjects: PropTypes.array,
  data: PropTypes.object,
  metadata: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  path: PropTypes.array,
  // Is used for matching the anchor of reasoning field to the anchor of
  // original change object.
  prefix: PropTypes.string,
  rules: PropTypes.array,
  // This is useful for dynamic forms.
  rulesFn: PropTypes.func,
  uncheckParentWithoutActiveChildNodes: PropTypes.bool
};

export default Lomake;
