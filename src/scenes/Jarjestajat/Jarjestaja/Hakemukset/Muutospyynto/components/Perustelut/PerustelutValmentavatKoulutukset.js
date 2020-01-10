import React, { useEffect, useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import { isInLupa, isAdded, isRemoved } from "../../../../../../../css/label";
import { curriedGetAnchorPartsByIndex } from "../../../../../../../utils/common";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const PerustelutValmentavatKoulutukset = React.memo(props => {
  const sectionId = "perustelut_koulutukset_valmentavatKoulutukset";
  const { onChangesRemove, onChangesUpdate, onStateUpdate } = props;

  const getCategories = useMemo(() => {
    const getAnchorPartsByIndex = curriedGetAnchorPartsByIndex(
      props.changeObjects.koulutukset.valmentavatKoulutukset
    );
    return (koulutusData, kohde, maaraystyyppi) => {
      const categories = R.map(item => {
        let structure = null;
        if (R.includes(item.code, getAnchorPartsByIndex(1))) {
          structure = {
            anchor: item.code,
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  name: "StatusTextRow",
                  code: item.code,
                  title: item.title,
                  labelStyles: {
                    addition: isAdded,
                    removal: isRemoved,
                    custom: Object({}, item.isInLupa ? isInLupa : {})
                  }
                }
              }
            ],
            meta: {
              kohde,
              maaraystyyppi,
              isInLupa: item.isInLupa,
              koodisto: item.koodisto,
              metadata: item.metadata
            },
            categories: [
              {
                anchor: "vapaa-tekstikentta",
                title: "Perustele lyhyesti miksi tälle muutokselle on tarvetta",
                components: [
                  {
                    anchor: "A",
                    name: "TextBox",
                    properties: {
                      isReadOnly: props.isReadOnly,
                      placeholder: "Perustelut..."
                    }
                  }
                ]
              }
            ]
          };
        }
        return structure;
      }, R.values(koulutusData.items));
      return categories.filter(Boolean);
    };
  }, [
    props.isReadOnly,
    props.changeObjects.koulutukset.valmentavatKoulutukset
  ]);

  useEffect(() => {
    const categories = getCategories(
      getDataForKoulutusList(
        props.koulutukset.poikkeukset,
        R.toUpper(props.intl.locale)
      ),
      props.kohde,
      props.maaraystyyppi
    );
    onStateUpdate(
      {
        categories
      },
      sectionId
    );
  }, [
    getCategories,
    onStateUpdate,
    props.kohde,
    props.koulutukset.poikkeukset,
    props.intl.locale,
    props.maaraystyyppi
  ]);
  const changes = R.path(
    ["koulutukset", "valmentavatKoulutukset"],
    props.changeObjects
  );
  if (changes && !R.isEmpty(changes)) {
    return (
      <React.Fragment>
        {props.stateObject.categories ? (
          <ExpandableRowRoot
            anchor={sectionId}
            key={`expandable-row-root`}
            categories={props.stateObject.categories}
            changes={
              props.changeObjects.perustelut.koulutukset.valmentavatKoulutukset
            }
            disableReverting={props.isReadOnly}
            hideAmountOfChanges={true}
            isExpanded={true}
            onChangesRemove={onChangesRemove}
            onUpdate={onChangesUpdate}
            sectionId={sectionId}
            title={props.intl.formatMessage(wizardMessages.preparatoryTraining)}
          />
        ) : null}
      </React.Fragment>
    );
  }
  return <React.Fragment />;
});

PerustelutValmentavatKoulutukset.defaultProps = {
  changeObjects: {},
  stateObject: {}
};

PerustelutValmentavatKoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  koulutukset: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObject: PropTypes.object
};

export default injectIntl(PerustelutValmentavatKoulutukset);
