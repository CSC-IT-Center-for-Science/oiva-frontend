import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { toUpper, values } from "ramda";

const ValmentavatKoulutukset = React.memo(
  ({
    changeObjects,
    koulutukset,
    maaraykset,
    onChangesRemove,
    onChangesUpdate
  }) => {
    const intl = useIntl();
    const sectionId = "koulutukset_valmentavatKoulutukset";

    const koulutusdata = useMemo(() => {
      return getDataForKoulutusList(
        values(koulutukset.poikkeukset),
        toUpper(intl.locale),
        maaraykset,
        "koulutus"
      );
    }, [intl.locale, koulutukset, maaraykset]);

    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    };

    return (
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        changes={changeObjects.koulutukset.valmentavatKoulutukset}
        hideAmountOfChanges={true}
        messages={changesMessages}
        title={intl.formatMessage(wizardMessages.preparatoryTraining)}
        index={0}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}
        sectionId={sectionId}>
        {koulutusdata && (
          <Lomake
            action="modification"
            anchor={sectionId}
            changeObjects={changeObjects.koulutukset.valmentavatKoulutukset}
            data={{
              koulutusdata
            }}
            onChangesUpdate={onChangesUpdate}
            path={["koulutukset", "valmentavatKoulutukset"]}
            showCategoryTitles={true}></Lomake>
        )}
      </ExpandableRowRoot>
    );
  }
);

ValmentavatKoulutukset.propTypes = {
  koulutukset: PropTypes.object
};

export default ValmentavatKoulutukset;
