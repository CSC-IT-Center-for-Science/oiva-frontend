import React, { useEffect, useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { curriedGetAnchorPartsByIndex } from "../../../../../../../utils/common";
import { isInLupa, isAdded, isRemoved } from "../../../../../../../css/label";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";

const PerustelutATVKoulutukset = props => {
  const sectionId =
    "perustelut_koulutukset_ammatilliseenTehtavaanValmistavatKoulutukset";
  const { onChangesRemove, onChangesUpdate, onStateUpdate } = props;

  const getCategories = useMemo(() => {
    const getAnchorPartsByIndex = curriedGetAnchorPartsByIndex(
      props.changeObjects.koulutukset
        .ammatilliseenTehtavaanValmistavatKoulutukset
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
      }, koulutusData.items);
      return categories.filter(Boolean);
    };
  }, [
    props.isReadOnly,
    props.changeObjects.koulutukset.ammatilliseenTehtavaanValmistavatKoulutukset
  ]);

  useEffect(() => {
    onStateUpdate(
      {
        categories: getCategories(
          getDataForKoulutusList(
            props.koulutukset.muut.ammatilliseentehtavaanvalmistavakoulutus,
            R.toUpper(props.intl.locale)
          ),
          props.kohde,
          props.maaraystyyppi
        )
      },
      sectionId
    );
  }, [
    getCategories,
    onStateUpdate,
    props.kohde,
    props.koulutukset.muut,
    props.intl.locale,
    props.maaraystyyppi
  ]);

  return (
    <React.Fragment>
      {!R.isEmpty(
        R.path(
          ["koulutukset", "ammatilliseenTehtavaanValmistavatKoulutukset"],
          props.changeObjects
        )
      ) && props.stateObject.categories ? (
        <ExpandableRowRoot
          anchor={sectionId}
          key={`expandable-row-root`}
          categories={props.stateObject.categories}
          changes={
            props.changeObjects.perustelut.koulutukset
              .ammatilliseenTehtavaanValmistavatKoulutukset
          }
          disableReverting={props.isReadOnly}
          hideAmountOfChanges={true}
          isExpanded={true}
          onChangesRemove={onChangesRemove}
          onUpdate={onChangesUpdate}
          title={props.intl.formatMessage(wizardMessages.vocationalTraining)}
        />
      ) : null}
    </React.Fragment>
  );
};

PerustelutATVKoulutukset.defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  stateObject: {}
};

PerustelutATVKoulutukset.propTypes = {
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

export default injectIntl(PerustelutATVKoulutukset);
