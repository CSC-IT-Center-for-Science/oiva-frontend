import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import { map, groupBy, prop, toUpper } from "ramda";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  kohde: {},
  lupaKohteet: {},
  maaraystyyppi: {},
  oivaperustelut: [],
  tutkinnot: []
};

const PerustelutTutkinnot = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    isReadOnly = defaultProps.isReadOnly,
    isFirstVisit,
    koulutusalat,
    koulutustyypit,
    tutkinnot = defaultProps.tutkinnot,
    oivaperustelut = defaultProps.oivaperustelut,
    onChangesRemove,
    onChangesUpdate
  }) => {
    const intl = useIntl();
    const localeUpper = toUpper(intl.locale);
    const sectionId = "perustelut_tutkinnot";

    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    };

    const tutkinnotByKoulutusala = groupBy(
      prop("koulutusalakoodiarvo"),
      tutkinnot || []
    );

    return (
      <React.Fragment>
        {map(koulutusala => {
          if (tutkinnotByKoulutusala[koulutusala.koodiarvo]) {
            const fullSectionId = `${sectionId}_${koulutusala.koodiarvo}`;
            const title = koulutusala.metadata[localeUpper].nimi;
            const tutkinnotByKoulutustyyppi = groupBy(
              prop("koulutustyyppikoodiarvo"),
              tutkinnotByKoulutusala[koulutusala.koodiarvo]
            );
            if (changeObjects.tutkinnot[koulutusala.koodiarvo]) {
              return (
                <ExpandableRowRoot
                  anchor={fullSectionId}
                  key={`expandable-row-root-${koulutusala.koodiarvo}`}
                  changes={
                    changeObjects.perustelut.tutkinnot[koulutusala.koodiarvo]
                  }
                  disableReverting={isReadOnly}
                  hideAmountOfChanges={true}
                  isExpanded={isReadOnly}
                  messages={changesMessages}
                  onChangesRemove={onChangesRemove}
                  onUpdate={onChangesUpdate}
                  sectionId={fullSectionId}
                  showCategoryTitles={true}
                  title={title}>
                  <Lomake
                    action="reasoning"
                    anchor={fullSectionId}
                    changeObjects={
                      changeObjects.perustelut.tutkinnot[koulutusala.koodiarvo]
                    }
                    data={{
                      tutkinnotChangeObjects:
                        changeObjects.tutkinnot[koulutusala.koodiarvo],
                      koulutusala,
                      koulutustyypit,
                      oivaperustelut,
                      title,
                      tutkinnotByKoulutustyyppi
                    }}
                    isReadOnly={isReadOnly}
                    onChangesUpdate={onChangesUpdate}
                    path={["perustelut", "tutkinnot"]}
                    showCategoryTitles={true}></Lomake>
                </ExpandableRowRoot>
              );
            }
          }
          return null;
        }, koulutusalat)}
      </React.Fragment>
    );
  }
);

PerustelutTutkinnot.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  isFirstVisit: PropTypes.bool,
  kohde: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  lupaKohteet: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  oivaperustelut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  sectionId: PropTypes.string,
  tutkinnot: PropTypes.array
};

export default PerustelutTutkinnot;
