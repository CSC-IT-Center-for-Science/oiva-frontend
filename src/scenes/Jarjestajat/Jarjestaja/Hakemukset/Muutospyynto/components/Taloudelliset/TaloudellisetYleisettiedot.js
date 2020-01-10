import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";

const TaloudellisetYleisettiedot = React.memo(props => {
  const intl = useIntl();
  const { sectionId, onStateUpdate } = props;
  const getCategories = useMemo(() => {
    return () => {
      let structure = null;
      structure = [
        {
          anchor: "edellytykset-tekstikentta",
          title: "Taloudelliset edellytykset",
          styleClasses: ["mb-6"],
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly: props.isReadOnly,
                placeholder: "",
                tooltip: {
                  text: intl.formatMessage(
                    wizardMessages.tooltipTaloudellisetYleisetTiedotKentta1
                  )
                }
              }
            }
          ]
        },
        {
          anchor: "Vaikutukset-tekstikentta",
          title: "Vaikutukset taloudellisten resurssien kohdentamiseen",
          styleClasses: ["mb-6"],
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly: props.isReadOnly,
                placeholder: "",
                tooltip: {
                  text: intl.formatMessage(
                    wizardMessages.tooltipTaloudellisetYleisetTiedotKentta2
                  )
                }
              }
            }
          ]
        },
        {
          anchor: "sopeuttaminen-tekstikentta",
          title: "Toiminnan ja talouden sopeuttaminen",
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
                    wizardMessages.tooltipTaloudellisetYleisetTiedotKentta3
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
          title={"Yleiset tiedot"}
          anchor={"taloudelliset_yleisettiedot"}
          key={`taloudelliset-yleisetiedot`}
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

TaloudellisetYleisettiedot.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  lupa: PropTypes.object,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object,
  isReadOnly: PropTypes.bool
};

export default TaloudellisetYleisettiedot;
