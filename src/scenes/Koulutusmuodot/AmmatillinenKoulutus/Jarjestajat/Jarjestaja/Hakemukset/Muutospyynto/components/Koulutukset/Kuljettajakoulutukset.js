import React, { useMemo } from "react";
import PropTypes from "prop-types";
import wizardMessages from "i18n/definitions/wizard";
import { getDataForKoulutusList } from "utils/koulutusUtil";
import Lomake from "components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import { toUpper } from "ramda";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

const constants = {
  formLocation: ["koulutukset", "kuljettajakoulutukset"]
};

const Kuljettajakoulutukset = ({
  isReadOnly,
  koulutukset,
  maaraykset,
  mode
}) => {
  const intl = useIntl();
  const sectionId = "koulutukset_kuljettajakoulutukset";
  const koodisto = "kuljettajakoulutus";

  const [changeObjects] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: sectionId
  });

  const lomakedata = useMemo(() => {
    return {
      koulutusdata: getDataForKoulutusList(
        koulutukset.muut[koodisto],
        toUpper(intl.locale),
        maaraykset,
        "kuljettajakoulutus",
        true
      )
    };
  }, [intl.locale, koulutukset, maaraykset]);

  return (
    <Lomake
      anchor={sectionId}
      changeObjects={changeObjects}
      data={lomakedata}
      isReadOnly={isReadOnly}
      isRowExpanded={mode === "reasoning"}
      mode={mode}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(wizardMessages.driverTraining)}
      showCategoryTitles={true}></Lomake>
  );
};

Kuljettajakoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array
};

export default Kuljettajakoulutukset;
