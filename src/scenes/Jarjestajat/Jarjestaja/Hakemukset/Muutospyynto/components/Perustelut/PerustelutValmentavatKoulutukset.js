import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import { rules } from "../../../../../../../services/lomakkeet/perustelut/valmentavatKoulutukset/rules";
import Lomake from "../../../../../../../components/02-organisms/Lomake";

const PerustelutValmentavatKoulutukset = React.memo(props => {
  const intl = useIntl();
  const sectionId = "perustelut_koulutukset_valmentavatKoulutukset";
  const { onChangesRemove, onChangesUpdate } = props;

  const koulutusdata = useMemo(() => {
    return getDataForKoulutusList(
      props.koulutukset.poikkeukset,
      R.toUpper(intl.locale)
    );
  }, [intl.locale, props.koulutukset.poikkeukset]);

  const changes = R.path(
    ["koulutukset", "valmentavatKoulutukset"],
    props.changeObjects
  );

  if (changes && !R.isEmpty(changes)) {
    return (
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        categories={[]}
        changes={
          props.changeObjects.perustelut.koulutukset.valmentavatKoulutukset
        }
        disableReverting={props.isReadOnly}
        hideAmountOfChanges={true}
        isExpanded={true}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        title={intl.formatMessage(wizardMessages.preparatoryTraining)}>
        <Lomake
          anchor={sectionId}
          changeObjects={
            props.changeObjects.perustelut.koulutukset.valmentavatKoulutukset
          }
          data={{
            changeObjectsPage1:
              props.changeObjects.koulutukset.valmentavatKoulutukset,
            koulutusdata,
            kohde: props.kohde,
            maaraystyyppi: props.maaraystyyppi
          }}
          isReadOnly={props.isReadOnly}
          onChangesUpdate={onChangesUpdate}
          path={["perustelut", "koulutukset", "valmentavat"]}
          rules={rules}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    );
  }
  return <React.Fragment />;
});

PerustelutValmentavatKoulutukset.defaultProps = {
  changeObjects: {}
};

PerustelutValmentavatKoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  koulutukset: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func
};

export default PerustelutValmentavatKoulutukset;
