import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { equals, has, isEmpty, map, prop } from "ramda";
import { useLomakedata } from "stores/lomakedata";
import {
  getChangeObjByAnchor,
  getReducedStructure
} from "../CategorizedListRoot/utils";
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

    // const lomakedata = useMemo(() => {
    //   if (lomake && lomake.length) {
    //     return getReducedStructureIncludingChanges(
    //       lomakedataAnchor || anchor,
    //       getReducedStructure(lomake),
    //       changeObjects
    //     );
    //   }
    //   return [];
    // }, [anchor, lomake, lomakedataAnchor, changeObjects]);

    const onChangesUpdate = useCallback(
      ({ anchor, changes }) => {
        actions.setChanges(changes, anchor);
      },
      [actions]
    );

    // const onChangesUpdate = useCallback(
    //   changeObj => {
    //     // Target node is the component affected by the change.
    //     const targetNode = getTargetNode(changeObj, reducedStructure);
    //     // The array of change objects will be updated.
    //     const nextChanges = handleNodeMain(
    //       uncheckParentWithoutActiveChildNodes,
    //       targetNode,
    //       anchor,
    //       reducedStructure,
    //       changesRef.current
    //     );

    //     /**
    //      * The updated array will be sent using the onUpdate callback function.
    //      * The anchor parameter is the root anchor of the current form. It can
    //      * be used to bind and store the array of changes correctly.
    //      **/
    //     onUpdate({
    //       anchor,
    //       changes: nextChanges,
    //       reducedStructure
    //     });
    //   },
    //   [anchor, onUpdate, reducedStructure, uncheckParentWithoutActiveChildNodes]
    // );

    //  * KOODISTEPALVELUN DATA
    //  * LOMAKKEEN NYKYTILA = MÄÄRÄYKSET + MUUTOKSET
    //  * MUUTOKSET = KÄYTTÄJÄN TEKEMÄT OPERAATIOT LOMAKKEELLE
    //  * LOMAKEMERKKAUS = JSON, JOKA

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
      lomakedataAnchor,
      mode,
      prefix
    ]);

    useEffect(() => {
      // fetchLomake().then(result => {
      // if (has("isValid", result)) {
      //   lomakedataActions.setValidity(result.isValid, anchor);
      // }
      //   let reducedStructure = [];
      //   if (result.structure) {
      //     reducedStructure = getReducedStructure(result.structure);
      //     setLomake(result.structure);
      //   } else {
      //     reducedStructure = getReducedStructure(result);
      //     setLomake(result);
      //   }
      //   const nextLomakedata = map(component => {
      //     const changeObj = getChangeObjByAnchor(
      //       `${lomakedataAnchor || anchor}.${component.fullAnchor}`,
      //       changeObjects
      //     );
      //     return {
      //       anchor: `${lomakedataAnchor || anchor}.${component.fullAnchor}`,
      //       properties: Object.assign(
      //         {},
      //         component.properties,
      //         prop("properties", changeObj) || {}
      //       )
      //     };
      //   }, reducedStructure);
      //   if (!equals(nextLomakedata, lomakedata)) {
      //     // lomakedataActions.setLomakedata(
      //     //   nextLomakedata,
      //     //   lomakedataAnchor || anchor
      //     // );
      //   }
      // });
    }, [
      anchor,
      data,
      formTitle,
      hasInvalidFieldsFn,
      isPreviewModeOn,
      isReadOnly,
      intl.locale,
      // lomakedata,
      // lomakedataActions,
      lomakedataAnchor,
      mode,
      _path,
      prefix
    ]);

    if (Array.isArray(lomake) && lomake.length) {
      console.info("Renderöidään lomake: ", anchor, lomake);
      return (
        <div className="mb-4">
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
