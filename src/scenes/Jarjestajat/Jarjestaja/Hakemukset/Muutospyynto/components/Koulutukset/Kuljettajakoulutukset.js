import React, { useMemo } from "react";
import PropTypes from "prop-types";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import { toUpper } from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";

const Kuljettajakoulutukset = ({
  koulutukset,
  maaraykset,
  onChangesRemove,
  onChangesUpdate
}) => {
  const [changeObjects] = useChangeObjects();
  const intl = useIntl();
  const sectionId = "koulutukset_kuljettajakoulutukset";
  const koodisto = "kuljettajakoulutus";

  const koulutusdata = useMemo(() => {
    return getDataForKoulutusList(
      koulutukset.muut[koodisto],
      toUpper(intl.locale),
      maaraykset,
      "kuljettajakoulutus"
    );
  }, [intl.locale, koulutukset, maaraykset]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  }

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      key={`expandable-row-root`}
      categories={[]}
      changes={changeObjects.koulutukset.kuljettajakoulutukset}
      hideAmountOfChanges={true}
      messages={changesMessages}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      title={intl.formatMessage(wizardMessages.driverTraining)}>
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={changeObjects.koulutukset.kuljettajakoulutukset}
        data={{
          koulutusdata
        }}
        onChangesUpdate={onChangesUpdate}
        path={["koulutukset", "kuljettajakoulutukset"]}
        rules={[]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
};

Kuljettajakoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default Kuljettajakoulutukset;
