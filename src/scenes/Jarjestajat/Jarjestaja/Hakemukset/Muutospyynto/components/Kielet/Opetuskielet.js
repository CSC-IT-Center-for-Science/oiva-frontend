import React, { useEffect, useState, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import { isInLupa, isAdded, isRemoved } from "../../../../../../../css/label";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import { getDataForOpetuskieletList } from "../../../../../../../utils/opetuskieletUtil";

const Opetuskielet = React.memo(props => {
  const sectionId = "kielet_opetuskielet";
  const [locale, setLocale] = useState("FI");
  const { onChangesRemove, onChangesUpdate, onStateUpdate } = props;

  const opetuskieletData = useMemo(() => {
    return getDataForOpetuskieletList(
      R.sortBy(R.prop("koodiArvo"), R.values(props.opetuskielet)),
      props.kohde,
      locale
    );
  }, [locale, props.kohde, props.opetuskielet]);

  const getCategories = useMemo(() => {
    return R.map(item => {
      return {
        anchor: item.code,
        meta: {
          isInLupa: item.isInLupa,
          kuvaus: item.title,
          kohde: props.kohde,
          maaraystyyppi: props.maaraystyyppi,
          meta: item.meta
        },
        components: [
          {
            anchor: "A",
            name: "CheckboxWithLabel",
            properties: {
              name: "CheckboxWithLabel",
              isChecked: item.shouldBeSelected,
              title: item.title,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object.assign({}, item.isInLupa ? isInLupa : {})
              }
            }
          }
        ]
      };
    }, opetuskieletData.items);
  }, [opetuskieletData, props.kohde, props.maaraystyyppi]);

  useEffect(() => {
    setLocale(R.toUpper(props.intl.locale));
  }, [props.intl.locale]);

  useEffect(() => {
    onStateUpdate(
      {
        categories: getCategories
      },
      sectionId
    );
  }, [getCategories, onStateUpdate]);

  return (
    <React.Fragment>
      {props.stateObject.categories ? (
        <ExpandableRowRoot
          anchor={sectionId}
          key={`expandable-row-root`}
          categories={props.stateObject.categories}
          changes={props.changeObjects}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          sectionId={sectionId}
          title={props.intl.formatMessage(wizardMessages.teachingLanguages)}
          isExpanded={true}
        />
      ) : null}
    </React.Fragment>
  );
});

Opetuskielet.defaultProps = {
  changeObjects: [],
  stateObject: {}
};

Opetuskielet.propTypes = {
  changeObjects: PropTypes.array,
  opetuskielet: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  onStateUpdate: PropTypes.func,
  kohde: PropTypes.object,
  lupa: PropTypes.object,
  stateObject: PropTypes.object
};

export default injectIntl(Opetuskielet);
