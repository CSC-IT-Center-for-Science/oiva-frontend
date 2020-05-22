import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import { toUpper } from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";

const Tyovoimakoulutukset = ({
  koulutukset,
  maaraykset,
  onChangesRemove,
  onChangesUpdate
}) => {
  const [changeObjects] = useChangeObjects();
  const intl = useIntl();
  const sectionId = "koulutukset_tyovoimakoulutukset";
  const koodisto = "oivatyovoimakoulutus";

  const koulutusdata = useMemo(() => {
    return getDataForKoulutusList(
      koulutukset.muut[koodisto],
      toUpper(intl.locale),
      maaraykset,
      "oivatyovoimakoulutus"
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
      changes={changeObjects.koulutukset.tyovoimakoulutukset}
      hideAmountOfChanges={true}
      messages={changesMessages}
      onUpdate={onChangesUpdate}
      onChangesRemove={onChangesRemove}
      title={intl.formatMessage(wizardMessages.workforceTraining)}>
      {koulutusdata && (
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={changeObjects.koulutukset.tyovoimakoulutukset}
          data={{
            koulutusdata
          }}
          onChangesUpdate={onChangesUpdate}
          path={["koulutukset", "tyovoimakoulutukset"]}
          rules={[]}
          showCategoryTitles={true}></Lomake>
      )}
    </ExpandableRowRoot>
  );
};

Tyovoimakoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func
};

export default Tyovoimakoulutukset;
