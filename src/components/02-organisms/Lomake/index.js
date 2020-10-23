import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "../CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";
import { useIntl } from "react-intl";
import { useLomake } from "../../../scenes/AmmatillinenKoulutus/store";

const defaultProps = {
  data: {},
  noPadding: false,
  prefix: "",
  showCategoryTitles: true,
  showValidationErrors: true,
  uncheckParentWithoutActiveChildNodes: false
};

const Lomake = ({
  action,
  anchor,
  data = defaultProps.data,
  isReadOnly,
  path: _path,
  prefix = defaultProps.prefix,
  showCategoryTitles = defaultProps.showCategoryTitles,
  uncheckParentWithoutActiveChildNodes = defaultProps.uncheckParentWithoutActiveChildNodes,
  hasInvalidFieldsFn,
  noPadding = defaultProps.noPadding,
  showValidationErrors = defaultProps.showValidationErrors
}) => {
  const intl = useIntl();

  const [changeObjects, actions] = useLomake({ anchor });
  const [lomake, setLomake] = useState();

  console.info(changeObjects);

  const onChangesUpdate = useCallback(
    ({ anchor, changes }) => {
      console.info("Asetellaan muutokset", anchor);
      actions.setChanges(changes, anchor);
    },
    [actions]
  );

  useEffect(() => {
    // console.info(anchor, changeObjects);
    async function fetchLomake() {
      return await getLomake(
        action,
        [],
        data,
        isReadOnly,
        intl.locale,
        _path,
        prefix
      );
    }

    fetchLomake().then(result => {
      if (hasInvalidFieldsFn && result) {
        hasInvalidFieldsFn(!result.isValid);
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
    _path,
    prefix
  ]);

  if (lomake) {
    return (
      <div className={noPadding ? "" : "p-8"}>
        <CategorizedListRoot
          anchor={anchor}
          categories={lomake}
          changes={changeObjects}
          onUpdate={onChangesUpdate}
          showCategoryTitles={showCategoryTitles}
          showValidationErrors={showValidationErrors}
          uncheckParentWithoutActiveChildNodes={
            uncheckParentWithoutActiveChildNodes
          }
        />
      </div>
    );
  } else {
    return <div>Lomakkeen kenttiä ei voida näyttää.</div>;
  }
};

Lomake.propTypes = {
  action: PropTypes.string,
  anchor: PropTypes.string,
  data: PropTypes.object,
  metadata: PropTypes.object,
  path: PropTypes.array,
  prefix: PropTypes.string,
  uncheckParentWithoutActiveChildNodes: PropTypes.bool,
  hasInvalidFieldsFn: PropTypes.func
};

export default Lomake;
