import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";
import { useIntl } from "react-intl";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "stores/muutokset";
import ExpandableRowRoot from "../ExpandableRowRoot";
import formMessages from "i18n/definitions/lomake";
import { has, isEmpty, map, prop } from "ramda";
import { useLomakedata } from "stores/lomakedata";
import {
  getChangeObjByAnchor,
  getReducedStructure
} from "../CategorizedListRoot/utils";
import FormTitle from "components/00-atoms/FormTitle";

const defaultProps = {
  data: {},
  isInExpandableRow: true,
  isPreviewModeOn: false,
  isReadOnly: false,
  isRowExpanded: false,
  noPadding: false,
  prefix: "",
  rowMessages: {},
  rowTitle: "",
  showCategoryTitles: true,
  showValidationErrors: true,
  uncheckParentWithoutActiveChildNodes: false
};

const Lomake = ({
  anchor,
  code,
  data = defaultProps.data,
  formTitle,
  isInExpandableRow = defaultProps.isInExpandableRow,
  isPreviewModeOn = defaultProps.isPreviewModeOn,
  isReadOnly = defaultProps.isReadOnly,
  isRowExpanded = defaultProps.isRowExpanded,
  mode,
  path: _path,
  prefix = defaultProps.prefix,
  showCategoryTitles = defaultProps.showCategoryTitles,
  uncheckParentWithoutActiveChildNodes = defaultProps.uncheckParentWithoutActiveChildNodes,
  hasInvalidFieldsFn,
  noPadding = defaultProps.noPadding,
  rowMessages = defaultProps.rowMessages,
  rowTitle = defaultProps.rowTitle,
  showValidationErrors = defaultProps.showValidationErrors
}) => {
  const intl = useIntl();

  const rowLocalizations = isEmpty(rowMessages)
    ? {
        undo: intl.formatMessage(formMessages.undo),
        changesTest: intl.formatMessage(formMessages.changesText)
      }
    : rowMessages;
  const [{ focusOn }] = useChangeObjects();
  const [changeObjects, actions] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor
  });
  const [lomakedata, lomakedataActions] = useLomakedata({ anchor });
  const [lomake, setLomake] = useState();

  const onChangesRemove = useCallback(
    anchor => {
      actions.setChanges([], anchor);
    },
    [actions]
  );

  const onChangesUpdate = useCallback(
    ({ anchor, changes }) => {
      actions.setChanges(changes, anchor);
    },
    [actions]
  );

  const onFocus = useCallback(() => {
    actions.setFocusOn(null);
  }, [actions]);

  useEffect(() => {
    async function fetchLomake() {
      return await getLomake(
        mode,
        changeObjects,
        { ...data, lomakedata },
        { isPreviewModeOn, isReadOnly },
        intl.locale,
        _path,
        prefix
      );
    }

    fetchLomake().then(result => {
      if (has("isValid", result)) {
        lomakedataActions.setValidity(result.isValid, anchor);
      }
      let reducedStructure = [];
      if (result.structure) {
        reducedStructure = getReducedStructure(result.structure);
        setLomake(result.structure);
      } else {
        reducedStructure = getReducedStructure(result);
        setLomake(result);
      }
      lomakedataActions.setLomakedata(
        map(component => {
          const changeObj = getChangeObjByAnchor(
            `${anchor}.${component.fullAnchor}`,
            changeObjects
          );
          return {
            anchor: `${anchor}.${component.fullAnchor}`,
            properties: Object.assign(
              {},
              component.properties,
              prop("properties", changeObj) || {}
            )
          };
        }, reducedStructure),
        anchor
      );
    });
  }, [
    anchor,
    changeObjects,
    data,
    formTitle,
    hasInvalidFieldsFn,
    isPreviewModeOn,
    isReadOnly,
    intl.locale,
    lomakedataActions,
    mode,
    _path,
    prefix
  ]);

  if (Array.isArray(lomake) && lomake.length) {
    return (
      <div
        className={`${
          !isPreviewModeOn ? "align-top p-12" : "mx-8"
        }`}>
        <FormTitle
          code={isPreviewModeOn || !code ? null : code}
          title={formTitle}
        />
        {isInExpandableRow && !isPreviewModeOn ? (
          <ExpandableRowRoot
            anchor={anchor}
            changes={changeObjects}
            key={`expandable-row-root`}
            hideAmountOfChanges={true}
            isExpanded={isRowExpanded}
            onChangesRemove={onChangesRemove}
            messages={rowLocalizations}
            sectionId={anchor}
            title={rowTitle}>
            <div className={noPadding ? "" : "p-8"}>
              <CategorizedListRoot
                anchor={anchor}
                focusOn={focusOn}
                categories={lomake}
                changes={changeObjects}
                isReadOnly={isReadOnly}
                onFocus={onFocus}
                onUpdate={onChangesUpdate}
                showCategoryTitles={showCategoryTitles}
                showValidationErrors={showValidationErrors}
                uncheckParentWithoutActiveChildNodes={
                  uncheckParentWithoutActiveChildNodes
                }
              />
            </div>
          </ExpandableRowRoot>
        ) : (
          <div className={noPadding ? "" : "py-8"}>
            <CategorizedListRoot
              anchor={anchor}
              focusOn={focusOn}
              categories={lomake}
              isPreviewModeOn={isPreviewModeOn}
              isReadOnly={isReadOnly}
              changes={changeObjects}
              onFocus={onFocus}
              onUpdate={onChangesUpdate}
              showCategoryTitles={showCategoryTitles}
              showValidationErrors={showValidationErrors}
              uncheckParentWithoutActiveChildNodes={
                uncheckParentWithoutActiveChildNodes
              }
            />
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

Lomake.propTypes = {
  anchor: PropTypes.string,
  code: PropTypes.string,
  data: PropTypes.object,
  isInExpandableRow: PropTypes.bool,
  isPreviewModeOn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRowExpanded: PropTypes.bool,
  metadata: PropTypes.object,
  mode: PropTypes.string,
  path: PropTypes.array,
  prefix: PropTypes.string,
  rowMessages: PropTypes.object,
  rowTitle: PropTypes.string,
  uncheckParentWithoutActiveChildNodes: PropTypes.bool,
  hasInvalidFieldsFn: PropTypes.func
};

export default Lomake;
