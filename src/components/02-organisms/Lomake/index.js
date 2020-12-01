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
import { equals, has, isEmpty } from "ramda";
import { useLomakedata } from "stores/lomakedata";
import { getReducedStructure } from "../CategorizedListRoot/utils";
import FormTitle from "components/00-atoms/FormTitle";
import { getReducedStructureIncludingChanges } from "./utils";

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

const Lomake = React.memo(
  ({
    anchor,
    code,
    data = defaultProps.data,
    formTitle,
    isInExpandableRow = defaultProps.isInExpandableRow,
    isPreviewModeOn = defaultProps.isPreviewModeOn,
    isReadOnly = defaultProps.isReadOnly,
    isRowExpanded = defaultProps.isRowExpanded,
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

    const rowLocalizations = isEmpty(rowMessages)
      ? {
          undo: intl.formatMessage(formMessages.undo),
          changesTest: intl.formatMessage(formMessages.changesText)
        }
      : rowMessages;

    const [{ focusOn }] = useChangeObjects();

    const [
      changeObjects,
      actions
    ] = useChangeObjectsByAnchorWithoutUnderRemoval({
      anchor: lomakedataAnchor || anchor
    });

    const [, lomakedataActions] = useLomakedata({
      anchor: lomakedataAnchor || anchor
    });

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
      (async () => {
        async function fetchLomake(_mode, _changeObjects, _data) {
          return await getLomake(
            _mode || mode,
            _changeObjects || changeObjects,
            _data || data,
            { isPreviewModeOn, isReadOnly },
            intl.locale,
            _path,
            prefix
          );
        }

        const lomake = await fetchLomake();

        /**
         * Esikatselulomake tarvitsee lomakerakenteen luontia varten
         * muokkaustilaisen lomakkeen nykytilan.
         */
        if (isPreviewModeOn) {
          const lomakedata =
            lomake && lomake.length
              ? getReducedStructureIncludingChanges(
                  lomakedataAnchor || anchor,
                  getReducedStructure(lomake),
                  changeObjects
                )
              : [];
          const previewLomake = await fetchLomake("preview", [], {
            lomakedata
          });
          setLomake(previewLomake.structure || previewLomake);
        } else {
          if (has("isValid", lomake)) {
            lomakedataActions.setValidity(lomake.isValid, anchor);
          }
          setLomake(lomake.structure || lomake);
        }
      })();
    }, [
      _path,
      anchor,
      changeObjects,
      data,
      intl.locale,
      isPreviewModeOn,
      isReadOnly,
      lomakedataActions,
      lomakedataAnchor,
      mode,
      prefix
    ]);

    if (Array.isArray(lomake) && lomake.length) {
      return (
        <div>
          {code || formTitle ? (
            <FormTitle
              code={isPreviewModeOn || !code ? null : code}
              isPreviewModeOn={isPreviewModeOn}
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
          )}
        </div>
      );
    } else {
      return null;
    }
  },
  (cp, np) => {
    return (
      equals(cp.data, np.data) &&
      equals(cp.isPreviewModeOn, np.isPreviewModeOn) &&
      equals(cp.isReadOnly, np.isReadOnly)
    );
  }
);

Lomake.propTypes = {
  anchor: PropTypes.string,
  code: PropTypes.string,
  data: PropTypes.object,
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
  uncheckParentWithoutActiveChildNodes: PropTypes.bool
};

export default Lomake;
