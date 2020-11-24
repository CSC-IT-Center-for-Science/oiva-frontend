import React, { useMemo } from "react";
import { getDataForKoulutusList } from "../../../../../../../../../utils/koulutusUtil";
import wizardMessages from "../../../../../../../../../i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../../components/02-organisms/Lomake";
import { toUpper } from "ramda";

const constants = {
  formLocation: ["koulutukset", "atvKoulutukset"]
};

const ATVKoulutukset = ({ koulutukset, maaraykset }) => {
  const intl = useIntl();
  const sectionId = "koulutukset_atvKoulutukset";

  const lomakedata = useMemo(() => {
    return {
      koulutusdata: getDataForKoulutusList(
        koulutukset.muut.ammatilliseentehtavaanvalmistavakoulutus,
        toUpper(intl.locale),
        maaraykset,
        "ammatilliseentehtavaanvalmistavakoulutus"
      )
    };
  }, [intl.locale, koulutukset, maaraykset]);

  return (
    <Lomake
      action="modification"
      anchor={sectionId}
      data={lomakedata}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.vocationalTraining)}
      showCategoryTitles={true}></Lomake>
  );
};

ATVKoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array
};

export default ATVKoulutukset;
