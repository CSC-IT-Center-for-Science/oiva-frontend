import React, { useEffect, useState } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import * as R from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";
import { useIntl } from "react-intl";
import {
  getTutkinnotGroupedBy,
  getActiveOnes
} from "../../../../../../../helpers/tutkinnot/";
import { getKoulutusalatSortedByKey } from "../../../../../../../helpers/koulutusalat";
import { getKoulutustyypitGroupedBy } from "../../../../../../../helpers/koulutustyypit";
import { getKieletFromStorage } from "../../../../../../../helpers/kielet";

const Tutkintokielet = props => {
  const intl = useIntl();
  const [changeObjects] = useChangeObjects();
  const sectionId = "kielet_tutkintokielet";
  const { onChangesRemove, onChangesUpdate } = props;
  const [koulutusalat, setKoulutusalat] = useState();
  const [koulutustyypit, setKoulutustyypit] = useState();
  const [tutkinnotByKoulutusala, setTutkinnotByKoulutusala] = useState();
  const [kielet, setKielet] = useState();

  useEffect(() => {
    (async () => {
      setTutkinnotByKoulutusala(
        await getTutkinnotGroupedBy("koulutusalakoodiarvo")
      );
      setKoulutusalat(await getKoulutusalatSortedByKey("koodiarvo"));
      setKoulutustyypit(await getKoulutustyypitGroupedBy("koodiarvo"));
      setKielet(await getKieletFromStorage());
    })();
  }, []);

  useEffect(() => {
    if (props.unselectedAnchors.length && changeObjects.kielet.tutkintokielet) {
      let tutkintokielichangesWithoutRemovedOnes = Object.assign(
        {},
        changeObjects.kielet.tutkintokielet
      );
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

      if (
        !R.equals(
          tutkintokielichangesWithoutRemovedOnes,
          changeObjects.kielet.tutkintokielet
        )
      ) {
        onChangesUpdate({
          anchor: sectionId,
          changes: tutkintokielichangesWithoutRemovedOnes
        });
      }
    }
  }, [
    onChangesUpdate,
    changeObjects.kielet.tutkintokielet,
    props.unselectedAnchors
  ]);

  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  };

  return kielet && koulutusalat && koulutustyypit && tutkinnotByKoulutusala ? (
    <React.Fragment>
      {R.map(koulutusala => {
        const fullSectionId = `${sectionId}_${koulutusala.koodiarvo}`;
        const activeDegrees = getActiveOnes(
          tutkinnotByKoulutusala[koulutusala.koodiarvo],
          changeObjects.tutkinnot[koulutusala.koodiarvo]
        );
        const tutkinnotByKoulutustyyppi = R.groupBy(
          R.prop("koulutustyyppikoodiarvo"),
          activeDegrees
        );
        return activeDegrees.length > 0 ? (
          <ExpandableRowRoot
            anchor={fullSectionId}
            changes={R.path(
              ["kielet", "tutkintokielet", koulutusala.koodiarvo],
              changeObjects
            )}
            hideAmountOfChanges={true}
            messages={changesMessages}
            key={`expandable-row-root-${koulutusala.koodiarvo}`}
            onChangesRemove={onChangesRemove}
            onUpdate={onChangesUpdate}
            sectionId={fullSectionId}
            showCategoryTitles={true}
            title={`${koulutusala.metadata[R.toUpper(intl.locale)].nimi}`}>
            <Lomake
              action="modification"
              anchor={fullSectionId}
              changeObjects={R.path(
                ["kielet", "tutkintokielet", koulutusala.koodiarvo],
                changeObjects
              )}
              data={{
                koulutusala,
                koulutustyypit,
                tutkinnotByKoulutustyyppi,
                kielet
              }}
              onChangesUpdate={onChangesUpdate}
              path={["kielet", "tutkintokielet"]}
              showCategoryTitles={true}></Lomake>
          </ExpandableRowRoot>
        ) : null;
      }, koulutusalat)}
    </React.Fragment>
  ) : null;
};

Tutkintokielet.defaultProps = {
  changeObjects: {
    tutkinnot: [],
    tutkintokielet: {}
  },
  unselectedAnchors: []
};

Tutkintokielet.propTypes = {
  changeObjects: PropTypes.object,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.array,
  lupa: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  unselectedAnchors: PropTypes.array
};

export default Tutkintokielet;
