import React, { useCallback } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../CategorizedListRoot";
import { useIntl } from "react-intl";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "stores/muutokset";
import ExpandableRowRoot from "../ExpandableRowRoot";
import formMessages from "i18n/definitions/lomake";
import { isEmpty, length, prop } from "ramda";
import { useLomakedata } from "stores/lomakedata";
import { getReducedStructure } from "../CategorizedListRoot/utils";
import FormTitle from "components/00-atoms/FormTitle";
import { getReducedStructureIncludingChanges } from "./utils";
import { useGetLomake } from "../../../hooks/useGetLomake";
import { useEffect } from "react";
import equal from "react-fast-compare";
import Loading from "modules/Loading";

const defaultProps = {
  data: {},
  functions: {},
  isInExpandableRow: true,
  isPreviewModeOn: false,
  isReadOnly: false,
  isRowExpanded: false,
  noPadding: false,
  isSavingState: true,
  prefix: "",
  rowMessages: {},
  rowTitle: "",
  showCategoryTitles: true,
  showValidationErrors: true,
  uncheckParentWithoutActiveChildNodes: false
};

const Lomake = React.memo(
  ({
    anchor,
    code,
    data = defaultProps.data,
    formTitle,
    functions = defaultProps.functions,
    isInExpandableRow = defaultProps.isInExpandableRow,
    isPreviewModeOn = defaultProps.isPreviewModeOn,
    isReadOnly = defaultProps.isReadOnly,
    isRowExpanded = defaultProps.isRowExpanded,
    isSavingState = defaultProps.isSavingState,
    lomakedataAnchor,
    mode,
    path: _path,
    prefix = defaultProps.prefix,
    showCategoryTitles = defaultProps.showCategoryTitles,
    uncheckParentWithoutActiveChildNodes = defaultProps.uncheckParentWithoutActiveChildNodes,
    noPadding = defaultProps.noPadding,
    rowMessages = defaultProps.rowMessages,
    rowTitle = defaultProps.rowTitle,
    showValidationErrors = defaultProps.showValidationErrors
  }) => {
    const intl = useIntl();

    const [
      changeObjects,
      actions
    ] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: lomakedataAnchor || anchor
    });

    const [, lomakedataActions] = useLomakedata({
      anchor: lomakedataAnchor || anchor
    });

    // Lomakkeen noutaminen
    const [lomake, isLoading] = useGetLomake(
      isPreviewModeOn ? "preview" : mode,
      isPreviewModeOn ? [] : changeObjects,
      data,
      functions,
      { isPreviewModeOn, isReadOnly },
      intl.locale,
      _path,
      prefix
    );

    // Lomakkeen oikeellisuuden asettaminen
    useEffect(() => {
      if (lomake) {
        lomakedataActions.setValidity(lomake.isValid, anchor);
      }
    }, [lomake]);

    // Lomakedatan asettaminen
    useEffect(() => {
      if (lomake) {
        const lomakedata = lomake.structure
          ? getReducedStructureIncludingChanges(
              lomakedataAnchor || anchor,
              getReducedStructure(lomake.structure),
              changeObjects
            )
          : [];
        console.info(_path, isSavingState);
        if (isSavingState) {
          lomakedataActions.setLomakedata(lomakedata, anchor);
        }
      }
    }, [changeObjects, isSavingState, lomake]);

    const rowLocalizations = isEmpty(rowMessages)
      ? {
          undo: intl.formatMessage(formMessages.undo),
          changesTest: intl.formatMessage(formMessages.changesText)
        }
      : rowMessages;

    const [{ focusOn }] = useChangeObjects();

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

    if (length(prop("structure", lomake))) {
      return (
        <div>
          {code || formTitle ? (
            <FormTitle
              code={isPreviewModeOn || !code ? null : code}
              isPreviewModeOn={isPreviewModeOn}
              level={isPreviewModeOn ? 3 : 2}
              title={formTitle}
            />
          ) : null}
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
              title={rowTitle}
            >
              <div className={noPadding ? "" : "p-8"}>
                <CategorizedListRoot
                  anchor={anchor}
                  focusOn={focusOn}
                  categories={lomake.structure}
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
            <CategorizedListRoot
              anchor={anchor}
              focusOn={focusOn}
              categories={lomake.structure}
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
          )}
        </div>
      );
    } else if (isLoading) {
      return <Loading />;
    } else {
      console.info(_path, "Tyhjä lomake");
      return <p>Tyhjä lomake</p>;
    }
  },
  (cp, np) => {
    return equal(cp, np);
  }
);

Lomake.propTypes = {
  anchor: PropTypes.string,
  code: PropTypes.string,
  data: PropTypes.object,
  functions: PropTypes.object,
  isInExpandableRow: PropTypes.bool,
  isPreviewModeOn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRowExpanded: PropTypes.bool,
  lomakedataAnchor: PropTypes.string,
  mode: PropTypes.string,
  path: PropTypes.array,
  prefix: PropTypes.string,
  rowMessages: PropTypes.object,
  rowTitle: PropTypes.string,
  isSavingState: PropTypes.bool,
  uncheckParentWithoutActiveChildNodes: PropTypes.bool
};

export default Lomake;
