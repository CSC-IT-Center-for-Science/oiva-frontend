import React, { useEffect, useMemo } from "react";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { isInLupa, isAdded, isRemoved } from "../../../../../../../css/label";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";

const Kuljettajakoulutukset = React.memo(props => {
  const sectionId = "koulutukset_kuljettajakoulutukset";
  const koodisto = "kuljettajakoulutus";
  const { onChangesRemove, onChangesUpdate, onStateUpdate } = props;

  const getCategories = useMemo(() => {
    return (koulutusData, kohde, maaraystyyppi) => {
      const categories = R.map(item => {
        return {
          anchor: item.code,
          components: [
            {
              anchor: "A",
              name: "RadioButtonWithLabel",
              properties: {
                forChangeObject: {
                  isReasoningRequired: item.isReasoningRequired
                },
                name: "RadioButtonWithLabel",
                title: item.title,
                isChecked: item.shouldBeChecked,
                labelStyles: {
                  addition: isAdded,
                  removal: isRemoved,
                  custom: item.isInLupa ? isInLupa : {}
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
          }
        };
      }, koulutusData.items);
      return categories;
    };
  }, []);

  useEffect(() => {
    onStateUpdate(
      {
        categories: getCategories(
          getDataForKoulutusList(
            props.koulutukset.muut[koodisto],
            R.toUpper(props.intl.locale),
            props.lupa,
            "kuljettajakoulutus"
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
    props.intl.locale,
    props.kohde,
    props.koulutukset.muut,
    props.lupa,
    props.maaraystyyppi
  ]);

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      key={`expandable-row-root`}
      categories={props.stateObject.categories}
      changes={props.changeObjects}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      title={props.intl.formatMessage(wizardMessages.driverTraining)}
    />
  );
});

Kuljettajakoulutukset.defaultProps = {
  stateObject: {}
};

Kuljettajakoulutukset.propTypes = {
  changeObjects: PropTypes.array,
  kohde: PropTypes.object,
  lupa: PropTypes.object,
  koulutukset: PropTypes.object,
  maaraystyyppi: PropTypes.object
};

export default injectIntl(Kuljettajakoulutukset);
