import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import { getActiveOnes } from "../../../../../../../helpers/tutkinnot/";
import wizard from "../../../../../../../i18n/definitions/wizard";
import * as R from "ramda";

const Tutkintokielet = React.memo(props => {
  const intl = useIntl();
  const { changeObjects } = props;
  const sectionId = "kielet_tutkintokielet";
  const { onChangesRemove, onChangesUpdate } = props;
  const tutkinnotByKoulutusala = R.groupBy(
    R.prop("koulutusalakoodiarvo"),
    props.tutkinnot
  );

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

      tutkintokielichangesWithoutRemovedOnes = R.filter(
        R.compose(R.not, R.isEmpty),
        tutkintokielichangesWithoutRemovedOnes
      );

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

  const expandableRows = useMemo(() => {
    return props.kielet
      ? R.map(koulutusala => {
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
                  koulutustyypit: props.koulutustyypit,
                  tutkinnotByKoulutustyyppi,
                  kielet: props.kielet
                }}
                onChangesUpdate={onChangesUpdate}
                path={["kielet", "tutkintokielet"]}
                showCategoryTitles={true}></Lomake>
            </ExpandableRowRoot>
          ) : null;
        }, props.koulutusalat).filter(Boolean)
      : null;
  }, [
    changeObjects,
    changesMessages,
    intl.locale,
    onChangesRemove,
    onChangesUpdate,
    props.kielet,
    props.koulutusalat,
    props.koulutustyypit,
    tutkinnotByKoulutusala
  ]);

  return expandableRows && expandableRows.length ? (
    <React.Fragment>
      <h4 className="py-4">{intl.formatMessage(wizard.tutkintokielet)}</h4>
      {expandableRows}
    </React.Fragment>
  ) : null;
});

Tutkintokielet.defaultProps = {
  changeObjects: {
    tutkinnot: [],
    tutkintokielet: {}
  },
  unselectedAnchors: []
};

Tutkintokielet.propTypes = {
  changeObjects: PropTypes.object,
  kielet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  lupa: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  tutkinnot: PropTypes.array,
  unselectedAnchors: PropTypes.array
};

export default Tutkintokielet;
