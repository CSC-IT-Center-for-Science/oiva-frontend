import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const TaloudellisetTilinpaatostiedot = React.memo(props => {
  const { sectionId, onStateUpdate } = props;
  const getCategories = useMemo(() => {
    return () => {
      let structure = null;

      structure = [
        {
          anchor: "tilinpaatostiedot",
          styleClasses: ["mb-2"],
          components: [
            {
              anchor: "omavaraisuusaste",
              name: "Input",
              styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
              properties: {
                fullWidth: true,
                isReadOnly: props.isReadOnly,
                label: "Omavaraisuusaste",
                type: "number"
              }
            },
            {
              anchor: "maksuvalmius",
              name: "Input",
              styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
              properties: {
                fullWidth: true,
                isReadOnly: props.isReadOnly,
                label: "Maksuvalmius",
                type: "number"
              }
            },
            {
              anchor: "velkaantuneisuus",
              name: "Input",
              styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
              properties: {
                fullWidth: true,
                isReadOnly: props.isReadOnly,
                label: "Velkaantuneisuus",
                type: "number"
              }
            },
            {
              anchor: "kannattavuus",
              name: "Input",
              styleClasses: ["px-2 w-full sm:w-1/2 md:w-1/3"],
              properties: {
                fullWidth: true,
                isReadOnly: props.isReadOnly,
                label: "Kannattavuus",
                type: "number"
              }
            },
            {
              anchor: "jaama",
              name: "Input",
              styleClasses: ["px-2 w-full sm:w-1/2 md:w-2/3"],
              properties: {
                fullWidth: true,
                isReadOnly: props.isReadOnly,
                label: "Kumulatiivinen yli- tai alijäämä",
                type: "number"
              }
            }
          ]
        }
      ];
      return structure;
    };
  }, [props.isReadOnly]);

  useEffect(() => {
    onStateUpdate(
      {
        categories: getCategories()
      },
      sectionId
    );
  }, [getCategories, onStateUpdate, sectionId]);
  return (
    <React.Fragment>
      {!!R.path(["categories"], props.stateObject) && (
        <ExpandableRowRoot
          title={"Tilinpäätöstiedot"}
          anchor={"taloudelliset_tilinpaatostiedot"}
          key={`taloudelliset-tilinpaatos`}
          categories={props.stateObject.categories}
          changes={R.path(["taloudelliset"], props.changeObjects)}
          disableReverting={true}
          hideAmountOfChanges={false}
          showCategoryTitles={true}
          isExpanded={true}
          sectionId={sectionId}
          onUpdate={props.onChangesUpdate}
          {...props}
        />
      )}
    </React.Fragment>
  );
});

TaloudellisetTilinpaatostiedot.defaultProps = {
  isReadOnly: false
};

TaloudellisetTilinpaatostiedot.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  lupa: PropTypes.object,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object
};
export default injectIntl(TaloudellisetTilinpaatostiedot);
