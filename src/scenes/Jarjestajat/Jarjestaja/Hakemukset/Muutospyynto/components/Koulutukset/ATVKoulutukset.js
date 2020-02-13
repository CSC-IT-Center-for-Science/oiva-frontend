import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../utils/koulutusUtil";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { toUpper } from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";

const ATVKoulutukset = ({ koulutukset, onChangesRemove, onChangesUpdate }) => {
  const [changeObjects] = useChangeObjects();
  const intl = useIntl();
  const sectionId = "koulutukset_atvKoulutukset";

  const koulutusdata = useMemo(() => {
    return getDataForKoulutusList(
      koulutukset.muut.ammatilliseentehtavaanvalmistavakoulutus,
      toUpper(intl.locale)
    );
  }, [intl.locale, koulutukset]);

  return (
    <ExpandableRowRoot
      anchor={sectionId}
      key={`expandable-row-root`}
      categories={[]}
      changes={changeObjects.koulutukset.atvKoulutukset}
      onChangesRemove={onChangesRemove}
      onUpdate={onChangesUpdate}
      title={intl.formatMessage(wizardMessages.vocationalTraining)}>
      {koulutukset && (
        <Lomake
          action="modification"
          anchor={sectionId}
          changeObjects={changeObjects.koulutukset.atvKoulutukset}
          data={{
            koulutusdata
          }}
          onChangesUpdate={onChangesUpdate}
          path={["koulutukset", "atvKoulutukset"]}
          rules={[]}
          showCategoryTitles={true}></Lomake>
      )}
    </ExpandableRowRoot>
  );
};

ATVKoulutukset.propTypes = {
  changeObjects: PropTypes.array,
  koulutukset: PropTypes.object
};

export default ATVKoulutukset;
