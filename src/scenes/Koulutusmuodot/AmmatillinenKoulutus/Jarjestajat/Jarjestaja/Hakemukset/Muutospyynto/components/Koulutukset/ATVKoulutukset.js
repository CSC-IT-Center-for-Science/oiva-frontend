import React, { useMemo } from "react";
import { getDataForKoulutusList } from "utils/koulutusUtil";
import wizardMessages from "i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { toUpper } from "ramda";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/tutkintomuutokset";

const constants = {
  formLocation: ["koulutukset", "atvKoulutukset"]
};

const ATVKoulutukset = ({ isReadOnly, koulutukset, maaraykset, mode }) => {
  const intl = useIntl();
  const sectionId = "koulutukset_atvKoulutukset";

  const [changeObjects, actions] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

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
      actions={actions}
      anchor={sectionId}
      changeObjects={changeObjects}
      data={lomakedata}
      isReadOnly={isReadOnly}
      isRowExpanded={mode === "reasoning"}
      mode={mode}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.vocationalTraining)}
      showCategoryTitles={true}
    ></Lomake>
  );
};

ATVKoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array,
  mode: PropTypes.string
};

export default ATVKoulutukset;
