import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const TaloudellisetInvestoinnit = React.memo(props => {
  const { sectionId, onStateUpdate } = props;
  const getCategories = useMemo(() => {
    return () => {
      let structure = null;

      structure = [
        {
          anchor: "investoinnit-tekstikentta",
          title: "Tarvittavat investoinnit",
          styleClasses: ["mb-6 font-normal"],
          components: [
            {
              anchor: "label",
              name: "TextBox",
              properties: {
                isReadOnly: props.isReadOnly,
                placeholder: ""
              }
            }
          ]
        },
        {
          anchor: "kustannukset-header",
          styleClasses: [""],
          components: [
            {
              anchor: "label",
              name: "StatusTextRow",
              styleClasses: ["font-semibold text-base mb-2"],
              properties: {
                title: "Investoinnin kustannukset"
              }
            }
          ]
        },
        {
          anchor: "kustannukset-Input",
          styleClasses: ["flex sm:row mb-6"],
          components: [
            {
              anchor: "A",
              name: "Input",
              styleClasses: [""],
              properties: {
                isReadOnly: props.isReadOnly,
                withoutMargin: true,
                type: "number"
              }
            }
          ]
        },
        {
          anchor: "rahoitus-tekstikentta",
          title: "Investointien rahoitus",
          styleClasses: [""],
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly: props.isReadOnly,
                placeholder: ""
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
          title={"Investoinnit"}
          anchor={"taloudelliset_investoinnit"}
          key={`taloudelliset-investoinnit`}
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

TaloudellisetInvestoinnit.defaultProps = {
  isReadOnly: false
};

TaloudellisetInvestoinnit.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  isReadOnly: PropTypes.bool,
  lupa: PropTypes.object,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object
};
export default injectIntl(TaloudellisetInvestoinnit);
