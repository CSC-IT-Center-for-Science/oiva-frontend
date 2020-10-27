import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import { getActiveOnes } from "../../../../../../../../helpers/tutkinnot";
import wizard from "../../../../../../../../i18n/definitions/wizard";
import * as R from "ramda";
import {
  useChangeObjects,
  useLatestChanges
} from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import { getLatestChangesByAnchor } from "utils/common";

const constants = {
  formLocation: ["kielet", "tutkintokielet"]
};

const Tutkintokielet = props => {
  const sectionId = "kielet_tutkintokielet";
  const intl = useIntl();
  const [tutkinnotChangeObjects] = useChangeObjects({
    anchor: "tutkinnot"
  });
  const [latestChanges, { setChanges }] = useLatestChanges();

  const [lomakedata, { setLomakedata }] = useLomakedata({
    anchor: "tutkinnot"
  });
  const tutkinnotByKoulutusala = useMemo(
    () => R.groupBy(R.prop("koulutusalakoodiarvo"), props.tutkinnot),
    [props.tutkinnot]
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    R.forEach(koulutusala => {
      const latestSectionChanges = getLatestChangesByAnchor(
        `tutkinnot_${koulutusala.koodiarvo}`,
        latestChanges
      );
      if (latestSectionChanges.length || !initialized) {
        // console.info(
        //   koulutusala.koodiarvo,
        //   latestSectionChanges,
        //   tutkinnotChangeObjects
        // );
        setLomakedata(
          {
            valitutTutkinnot: R.groupBy(
              R.prop("koulutustyyppikoodiarvo"),
              getActiveOnes(
                tutkinnotByKoulutusala[koulutusala.koodiarvo],
                R.prop(koulutusala.koodiarvo, R.head(tutkinnotChangeObjects))
              )
            )
          },
          `tutkinnot_${koulutusala.koodiarvo}`
        );

        R.forEach(changeObj => {
          if (changeObj.properties.isChecked === false) {
            setChanges([], `${sectionId}_${koulutusala.koodiarvo}`);
          }
        }, latestSectionChanges);
      }
    }, props.koulutusalat).filter(Boolean);
    setInitialized(true);
  }, [
    initialized,
    latestChanges,
    props.koulutusalat,
    setChanges,
    setLomakedata,
    tutkinnotByKoulutusala,
    tutkinnotChangeObjects
  ]);

  return !R.isEmpty(lomakedata) ? (
    <React.Fragment>
      <h4 className="py-4">{intl.formatMessage(wizard.tutkintokielet)}</h4>
      {R.map(koulutusala => {
        const fullSectionId = `${sectionId}_${koulutusala.koodiarvo}`;
        return !!lomakedata[koulutusala.koodiarvo] &&
          !R.isEmpty(lomakedata[koulutusala.koodiarvo].valitutTutkinnot) ? (
          <Lomake
            action="modification"
            anchor={fullSectionId}
            data={lomakedata[koulutusala.koodiarvo]}
            key={`expandable-row-root-${koulutusala.koodiarvo}`}
            path={constants.formLocation}
            rowTitle={`${koulutusala.metadata[R.toUpper(intl.locale)].nimi}`}
            showCategoryTitles={true}
          />
        ) : null;
      }, props.koulutusalat).filter(Boolean)}
    </React.Fragment>
  ) : null;
};

Tutkintokielet.propTypes = {
  koulutusalat: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default Tutkintokielet;
