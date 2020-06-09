import React, { useEffect, useState } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import * as R from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";
import { useIntl } from "react-intl";
import {
  getTutkinnotGroupedByKey,
  isAnyOfTutkinnotActive
} from "../../../../../../../helpers/tutkinnot";

const Tutkintokielet = props => {
  const intl = useIntl();
  const [changeObjects] = useChangeObjects();
  const sectionId = "kielet_tutkintokielet";
  const { onChangesRemove, onChangesUpdate } = props;
  const [tutkinnot, setTutkinnot] = useState();

  useEffect(() => {
    (async () => {
      const tutkinnot = await getTutkinnotGroupedByKey("koulutusalaKoodiarvo");
      setTutkinnot(tutkinnot);
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

  return tutkinnot ? (
    <React.Fragment>
      {R.map(areaCode => {
        const tutkintolomake = props.tutkintolomakkeet[areaCode].categories;
        const fullSectionId = `${sectionId}_${areaCode}`;
        return isAnyOfTutkinnotActive(
          tutkinnot[areaCode],
          changeObjects.tutkinnot[areaCode]
        ) ? (
          <ExpandableRowRoot
            anchor={fullSectionId}
            changes={R.path(
              ["kielet", "tutkintokielet", areaCode],
              changeObjects
            )}
            hideAmountOfChanges={true}
            messages={changesMessages}
            key={`expandable-row-root-${areaCode}`}
            onChangesRemove={onChangesRemove}
            onUpdate={onChangesUpdate}
            sectionId={fullSectionId}
            showCategoryTitles={true}
            title={`${tutkintolomake[0].meta.title}`}>
            <Lomake
              action="modification"
              anchor={fullSectionId}
              changeObjects={R.path(
                ["kielet", "tutkintokielet", areaCode],
                changeObjects
              )}
              data={{
                kielet: props.kielet,
                maaraykset: props.lupa.maaraykset,
                tutkintolomake,
                tutkintomuutokset: changeObjects.tutkinnot[areaCode]
              }}
              onChangesUpdate={onChangesUpdate}
              path={["kielet", "tutkintokielet"]}
              showCategoryTitles={true}></Lomake>
          </ExpandableRowRoot>
        ) : null;
      }, R.keys(props.tutkintolomakkeet).sort())}
    </React.Fragment>
  ) : null;
};

Tutkintokielet.defaultProps = {
  changeObjects: {
    tutkinnot: [],
    tutkintokielet: {}
  },
  kielet: [],
  unselectedAnchors: []
};

Tutkintokielet.propTypes = {
  changeObjects: PropTypes.object,
  kielet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.array,
  lupa: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  tutkintolomakkeet: PropTypes.object,
  unselectedAnchors: PropTypes.array
};

export default Tutkintokielet;
