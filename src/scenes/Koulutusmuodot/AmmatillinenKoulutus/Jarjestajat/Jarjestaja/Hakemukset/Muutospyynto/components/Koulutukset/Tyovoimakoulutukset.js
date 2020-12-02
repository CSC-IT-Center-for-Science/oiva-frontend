import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../../../utils/koulutusUtil";
import wizardMessages from "../../../../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import { toUpper } from "ramda";

const constants = {
  formLocation: ["koulutukset", "tyovoimakoulutukset"]
};

const Tyovoimakoulutukset = ({ koulutukset, maaraykset }) => {
  const intl = useIntl();
  const sectionId = "koulutukset_tyovoimakoulutukset";
  const koodisto = "oivatyovoimakoulutus";

  const lomakedata = useMemo(() => {
    return {
      koulutusdata: getDataForKoulutusList(
        koulutukset.muut[koodisto],
        toUpper(intl.locale),
        maaraykset,
        "oivatyovoimakoulutus",
        true
      )
    };
  }, [intl.locale, koulutukset, maaraykset]);

  return (
    <Lomake
      mode="modification"
      anchor={sectionId}
      data={lomakedata}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.workforceTraining)}
      showCategoryTitles={true}></Lomake>
  );
};

Tyovoimakoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array
};

export default Tyovoimakoulutukset;
