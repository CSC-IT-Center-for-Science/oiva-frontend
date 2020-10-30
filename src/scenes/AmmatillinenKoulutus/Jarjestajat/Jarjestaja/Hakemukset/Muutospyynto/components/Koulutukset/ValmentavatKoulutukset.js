import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../../utils/koulutusUtil";
import wizardMessages from "../../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";
import { toUpper, values } from "ramda";

const constants = {
  formLocation: ["koulutukset", "valmentavatKoulutukset"]
};

const ValmentavatKoulutukset = ({ koulutukset, maaraykset }) => {
  const intl = useIntl();
  const sectionId = "koulutukset_valmentavatKoulutukset";

  const lomakedata = useMemo(() => {
    return {
      koulutusdata: getDataForKoulutusList(
        values(koulutukset.poikkeukset),
        toUpper(intl.locale),
        maaraykset,
        "koulutus"
      )
    };
  }, [intl.locale, koulutukset, maaraykset]);

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={lomakedata}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.preparatoryTraining)}
      showCategoryTitles={true}></Lomake>
  );
};

ValmentavatKoulutukset.propTypes = {
  koulutukset: PropTypes.object
};

export default ValmentavatKoulutukset;
