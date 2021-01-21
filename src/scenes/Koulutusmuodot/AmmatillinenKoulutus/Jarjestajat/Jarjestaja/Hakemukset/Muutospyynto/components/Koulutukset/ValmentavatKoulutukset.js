import React, { useMemo } from "react";
import { getDataForKoulutusList } from "utils/koulutusUtil";
import wizardMessages from "i18n/definitions/wizard";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import { toUpper, values } from "ramda";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/tutkintomuutokset";

const constants = {
  formLocation: ["koulutukset", "valmentavatKoulutukset"]
};

const ValmentavatKoulutukset = ({
  isReadOnly,
  koulutukset,
  maaraykset,
  mode
}) => {
  const intl = useIntl();
  const sectionId = "koulutukset_valmentavatKoulutukset";

  const [changeObjects, actions] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

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
      actions={actions}
      anchor={sectionId}
      changeObjects={changeObjects}
      data={lomakedata}
      isReadOnly={isReadOnly}
      isRowExpanded={mode === "reasoning"}
      mode={mode}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.preparatoryTraining)}
      showCategoryTitles={true}
    ></Lomake>
  );
};

ValmentavatKoulutukset.propTypes = {
  koulutukset: PropTypes.object
};

export default ValmentavatKoulutukset;
