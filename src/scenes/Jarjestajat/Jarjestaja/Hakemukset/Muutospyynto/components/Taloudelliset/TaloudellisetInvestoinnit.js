import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const TaloudellisetInvestoinnit = React.memo(props => {
  const intl = useIntl();

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
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly: props.isReadOnly,
                placeholder: "",
                tooltip: {
                  text: intl.formatMessage(
                    wizardMessages.tooltipTaloudellisetInvestoinnitKentta1
                  )
                }
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
              styleClasses: ["font-semibold text-base"],
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
                type: "number",
                tooltip: {
                  text: intl.formatMessage(
                    wizardMessages.tooltipTaloudellisetInvestoinnitKentta2
                  )
                }
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
                placeholder: "",
                tooltip: {
                  text: intl.formatMessage(
                    wizardMessages.tooltipTaloudellisetInvestoinnitKentta3
                  )
                }
              }
            }
          ]
        }
      ];
      return structure;
    };
  }, [intl, props.isReadOnly]);

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
          disableReverting={props.isReadOnly}
          hideAmountOfChanges={true}
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
export default TaloudellisetInvestoinnit;
