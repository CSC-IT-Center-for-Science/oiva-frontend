import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../../components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import { getActiveOnes } from "../../../../../../../../helpers/tutkinnot";
import wizard from "../../../../../../../../i18n/definitions/wizard";
import * as R from "ramda";
import {
  useLatestChanges,
  useLomakeSection
} from "scenes/AmmatillinenKoulutus/store";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import { getLatestChangesByAnchor } from "utils/common";

const constants = {
  formLocation: ["kielet", "tutkintokielet"]
};

const Tutkintokielet = props => {
  const sectionId = "kielet_tutkintokielet";
  const intl = useIntl();
  const [tutkinnotChangeObjects] = useLomakeSection({
    anchor: "tutkinnot"
  });
  const [tutkintokieletChangeObjects, { setChanges }] = useLomakeSection({
    anchor: "kielet_tutkintokielet"
  });
  const [latestChanges] = useLatestChanges();

  const [lomakedata, { setLomakedata }] = useLomakedata({
    anchor: "tutkinnot"
  });
  const tutkinnotByKoulutusala = useMemo(
    () => R.groupBy(R.prop("koulutusalakoodiarvo"), props.tutkinnot),
    [props.tutkinnot]
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!R.isEmpty(tutkintokieletChangeObjects)) {
      let tutkintokielichangesWithoutRemovedOnes = Object.assign(
        {},
        tutkintokieletChangeObjects
      );
      // Remove properties with empty value array
      Object.keys(tutkintokielichangesWithoutRemovedOnes).forEach(key => {
        if (
          R.all(
            kielet => R.isEmpty(kielet.properties.value),
            tutkintokielichangesWithoutRemovedOnes[key]
          )
        ) {
          tutkintokielichangesWithoutRemovedOnes = R.dissocPath(
            [key],
            tutkintokielichangesWithoutRemovedOnes
          );
        }
      });
      if (props.unselectedAnchors.length) {
        R.forEach(anchor => {
          const areaCode = R.compose(
            R.last,
            R.split("_"),
            R.head,
            R.split(".")
          )(anchor);

          const commonPart = R.compose(
            R.join("."),
            R.concat([areaCode])
          )(R.slice(1, 3, R.split(".", anchor)));
          tutkintokielichangesWithoutRemovedOnes = {
            ...tutkintokielichangesWithoutRemovedOnes,
            [areaCode]: R.filter(changeObj => {
              return !R.contains(commonPart, changeObj.anchor);
            }, tutkintokielichangesWithoutRemovedOnes[areaCode] || [])
          };
        }, props.unselectedAnchors);

        tutkintokielichangesWithoutRemovedOnes = R.filter(
          R.compose(R.not, R.isEmpty),
          tutkintokielichangesWithoutRemovedOnes
        );
      }

      setChanges(tutkintokielichangesWithoutRemovedOnes, sectionId);
    }
  }, [setChanges, tutkintokieletChangeObjects, props.unselectedAnchors]);

  useEffect(() => {
    R.forEach(koulutusala => {
      const latestSectionChanges = getLatestChangesByAnchor(
        `tutkinnot_${koulutusala.koodiarvo}`,
        latestChanges
      );
      if (latestSectionChanges.length || !initialized) {
        setLomakedata(
          {
            valitutTutkinnot: R.groupBy(
              R.prop("koulutustyyppikoodiarvo"),
              getActiveOnes(
                tutkinnotByKoulutusala[koulutusala.koodiarvo],
                tutkinnotChangeObjects[koulutusala.koodiarvo]
              )
            )
          },
          `tutkinnot_${koulutusala.koodiarvo}`
        );
      }
    }, props.koulutusalat).filter(Boolean);
    setInitialized(true);
  }, [
    latestChanges,
    props.koulutusalat,
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

Tutkintokielet.defaultProps = {
  unselectedAnchors: []
};

Tutkintokielet.propTypes = {
  koulutusalat: PropTypes.array,
  tutkinnot: PropTypes.array,
  unselectedAnchors: PropTypes.array
};

export default Tutkintokielet;
