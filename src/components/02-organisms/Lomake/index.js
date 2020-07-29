import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";
import { join, path } from "ramda";
import { cloneDeep, isEqual } from "lodash";
import { useIntl } from "react-intl";
import { useMetadata } from "../../../stores/metadata";

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

async function markRequiredFields(
  lomake,
  changeObjects = [],
  rules = [],
  invalidFields = [],
  index = 0
) {
  let modifiedLomake = cloneDeep(lomake);
  if (rules[index]) {
    const rule = rules[index];
    const isRequired = rule.isRequired(modifiedLomake, changeObjects);
    modifiedLomake = rule.markRequiredFields(modifiedLomake, isRequired);
    const isValid = isFunction(rule.isValid)
      ? await rule.isValid(modifiedLomake, changeObjects, isRequired)
      : true;
    modifiedLomake = rule.showErrors(modifiedLomake, isValid);
    if (!isValid) {
      invalidFields.push(false);
    }
    if (rules[index + 1]) {
      return await markRequiredFields(
        modifiedLomake,
        changeObjects,
        rules,
        invalidFields,
        index + 1
      );
    }
  }
  return { categories: modifiedLomake, invalidFields, ruleCount: rules.length };
}

const defaultProps = {
  changeObjects: [],
  uncheckParentWithoutActiveChildNodes: false,
  rules: []
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
    rules = defaultProps.rules,
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

    const [lomakeWithRules, setLomakeWithRules] = useState([]);

    const lomake = useMemo(() => {
      return getLomake(action, data, isReadOnly, intl.locale, _path, prefix);
    }, [action, data, intl.locale, isReadOnly, _path, prefix]);

    useEffect(() => {
      async function defineRules() {
        let result = { categories: lomake, invalidFields: [], ruleCount: 0 };
        let _rules = cloneDeep(rules);
        if (rulesFn) {
          _rules = rulesFn(lomake);
        }
        if (_rules.length) {
          result = await markRequiredFields(
            lomake,
            changeObjects,
            _rules.filter(Boolean)
          );
        }
        return {
          categories: result.categories,
          invalidFields: result.invalidFields.length,
          ruleCount: result.ruleCount,
          metadata
        };
      }
      defineRules().then(definedRules => {
        if (!isEqual(definedRules, lomakeWithRules)) {
          setLomakeWithRules(definedRules);
        }
      });
    }, [
      lomake,
      anchor,
      changeObjects,
      lomakeWithRules,
      metadata,
      rules,
      rulesFn
    ]);

    if (
      lomakeWithRules.categories &&
      lomakeWithRules.invalidFields !== undefined &&
      onChangesUpdate
    ) {
      return (
        <React.Fragment>
          <div className="p-8">
            <CategorizedListRoot
              anchor={anchor}
              categories={lomakeWithRules.categories}
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
