import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { toUpper, values } from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";

const ValmentavatKoulutukset = React.memo(
  ({ koulutukset, onChangesRemove, onChangesUpdate }) => {
    const [changeObjects] = useChangeObjects();
    const intl = useIntl();
    const sectionId = "koulutukset_valmentavatKoulutukset";

    const koulutusdata = useMemo(() => {
      return getDataForKoulutusList(
        values(koulutukset.poikkeukset),
        toUpper(intl.locale)
      );
    }, [intl.locale, koulutukset]);

    return (
      <ExpandableRowRoot
        anchor={sectionId}
        key={`expandable-row-root`}
        categories={[]}
        changes={changeObjects.koulutukset.valmentavatKoulutukset}
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
            rules={[]}
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
