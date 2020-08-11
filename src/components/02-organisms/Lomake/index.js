import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CategorizedListRoot from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot";
import { getLomake } from "../../../services/lomakkeet";
import { isEqual } from "lodash";
import { useIntl } from "react-intl";

const defaultProps = {
  changeObjects: [],
  data: {},
  prefix: "",
  rules: [],
  showCategoryTitles: true,
  uncheckParentWithoutActiveChildNodes: false
};

const Lomake = React.memo(
  ({
    action,
    anchor,
    changeObjects = defaultProps.changeObjects,
    data = defaultProps.data,
    isReadOnly,
    onChangesUpdate,
    path: _path,
    prefix = defaultProps.prefix,
    showCategoryTitles = defaultProps.showCategoryTitles,
    uncheckParentWithoutActiveChildNodes = defaultProps.uncheckParentWithoutActiveChildNodes
  }) => {
    const intl = useIntl();

    const [lomake, setLomake] = useState();

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
        setLomake(result);
      });
    }, [
      action,
      anchor,
      changeObjects,
      data,
      isReadOnly,
      intl.locale,
      _path,
      prefix
    ]);

    const showValidationErrors = true;

    if (lomake && onChangesUpdate) {
      return (
        <React.Fragment>
          <div className="p-8">
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
        </React.Fragment>
      );
    } else {
      return <div>Lomakkeen kenttiä ei voida näyttää.</div>;
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
