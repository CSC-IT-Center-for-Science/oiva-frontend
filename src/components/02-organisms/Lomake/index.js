import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";
import { useIntl } from "react-intl";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "../../../scenes/AmmatillinenKoulutus/store";
import ExpandableRowRoot from "../ExpandableRowRoot";
import formMessages from "i18n/definitions/lomake";
import { has, isEmpty } from "ramda";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";

const defaultProps = {
  data: {},
  isInExpandableRow: true,
  isRowExpanded: false,
  noPadding: false,
  prefix: "",
  rowMessages: {},
  rowTitle: "",
  showCategoryTitles: true,
  showValidationErrors: true,
  uncheckParentWithoutActiveChildNodes: false
};

const Lomake = React.memo(
  ({
     action,
     anchor,
     data = defaultProps.data,
     isInExpandableRow = defaultProps.isInExpandableRow,
     isReadOnly,
     isRowExpanded = defaultProps.isRowExpanded,
     onChanges,
     path: _path,
     prefix = defaultProps.prefix,
     showCategoryTitles = defaultProps.showCategoryTitles,
     uncheckParentWithoutActiveChildNodes = defaultProps.uncheckParentWithoutActiveChildNodes,
     hasInvalidFieldsFn,
     noPadding = defaultProps.noPadding,
     rowMessages = defaultProps.rowMessages,
     rowTitle = defaultProps.rowTitle,
     showValidationErrors = defaultProps.showValidationErrors,
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
  const [, lomakedataActions] = useLomakedata({ anchor });
  const [lomake, setLomake] = useState();

  const onChangesRemove = useCallback(
    anchor => {
      actions.setChanges([], anchor);
    },
    [actions]
  );

    const onChangesUpdate = useCallback(
      ({ anchor, changes }) => {
        onChanges ? onChanges(anchor, changes)
          : actions.setChanges(changes, anchor);
      },
      [actions, onChanges]
    );

  const onFocus = useCallback(() => {
    actions.setFocusOn(null);
  }, [actions]);

  useEffect(() => {
    async function fetchLomake() {
      return await getLomake(
        action,
        changeObjects,
        data,
        isReadOnly,
        intl.locale,
        _path,
        prefix
      );
    }

    fetchLomake().then(result => {
      if (has("isValid", result)) {
        lomakedataActions.setValidity(result.isValid, anchor);
      }
      result.structure ? setLomake(result.structure) : setLomake(result);
    });
  }, [
    action,
    anchor,
    changeObjects,
    data,
    hasInvalidFieldsFn,
    isReadOnly,
    intl.locale,
    lomakedataActions,
    _path,
    prefix
  ]);

  if (lomake) {
    return (
      <React.Fragment>
        {isInExpandableRow ? (
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
          <div className={noPadding ? "" : "p-8"}>
            <CategorizedListRoot
              anchor={anchor}
              focusOn={focusOn}
              categories={lomake}
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
      </React.Fragment>
    );
  } else {
    return <div>Lomakkeen kenttiä ei voida näyttää.</div>;
  }
})

Lomake.propTypes = {
  action: PropTypes.string,
  anchor: PropTypes.string,
  data: PropTypes.object,
  isInExpandableRow: PropTypes.bool,
  isRowExpanded: PropTypes.bool,
  metadata: PropTypes.object,
  path: PropTypes.array,
  prefix: PropTypes.string,
  rowMessages: PropTypes.object,
  rowTitle: PropTypes.string,
  uncheckParentWithoutActiveChildNodes: PropTypes.bool,
  hasInvalidFieldsFn: PropTypes.func,
  onChanges: PropTypes.func
};

export default Lomake;
