import React, { useEffect } from "react";
import ExpandableRowRoot from "OKM-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getActiveCheckboxes } from "../../../../../../../services/lomakkeet/utils";
import * as R from "ramda";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";

const Tutkintokielet = props => {
  const [changeObjects] = useChangeObjects();
  const sectionId = "kielet_tutkintokielet";
  const { onChangesRemove, onChangesUpdate } = props;

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

  return (
    <React.Fragment>
      {R.map(areaCode => {
        const tutkintolomake = props.tutkintolomakkeet[areaCode].categories;
        const actives = getActiveCheckboxes(
          tutkintolomake,
          changeObjects.tutkinnot[areaCode]
        );
        return actives.length > 0 ? (
          <ExpandableRowRoot
            anchor={`${sectionId}_${areaCode}`}
            categories={[]}
            changes={R.path(
              ["kielet", "tutkintokielet", areaCode],
              changeObjects
            )}
            code={areaCode}
            key={`expandable-row-root-${areaCode}`}
            onChangesRemove={onChangesRemove}
            onUpdate={onChangesUpdate}
            sectionId={sectionId}
            showCategoryTitles={true}
            title={`${tutkintolomake[0].meta.title}`}>
            <Lomake
              action="modification"
              anchor={`${sectionId}_${areaCode}`}
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
              rules={[]}
              showCategoryTitles={true}></Lomake>
          </ExpandableRowRoot>
        ) : null;
      }, R.keys(props.tutkintolomakkeet).sort())}
    </React.Fragment>
  );
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
