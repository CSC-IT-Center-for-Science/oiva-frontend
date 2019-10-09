import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const TaloudellisetYleisettiedot = React.memo(props => {
  const { sectionId, onStateUpdate } = props;
  const getCategories = useMemo(() => {
    return () => {
      let structure = null;
      console.info(props.isReadOnly);
      structure = [
        {
          anchor: "yleisettiedot",
          categories: [
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
                    placeholder: ""
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
                    placeholder: ""
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
                    placeholder: ""
                  }
                }
              ]
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
          title={"Yleiset tiedot"}
          anchor={"taloudelliset_yleisettiedot"}
          key={`taloudelliset-yleisetiedot`}
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

TaloudellisetYleisettiedot.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  lupa: PropTypes.object,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object,
  isReadOnly: PropTypes.bool
};

export default injectIntl(TaloudellisetYleisettiedot);
