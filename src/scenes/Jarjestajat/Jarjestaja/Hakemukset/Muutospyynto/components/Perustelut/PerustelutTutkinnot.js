import React, { useMemo } from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import _ from "lodash";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { getRules } from "../../../../../../../services/lomakkeet/perustelut/tutkinnot/rules";
import common from "../../../../../../../i18n/definitions/common";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  kohde: {},
  lupaKohteet: {},
  maaraystyyppi: {},
  muutosperustelut: [],
  tutkinnot: {}
};

const PerustelutTutkinnot = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    isReadOnly = defaultProps.isReadOnly,
    isFirstVisit,
    kohde = defaultProps.kohde,
    tutkinnot = defaultProps.tutkinnot,
    lupaKohteet = defaultProps.lupaKohteet,
    maaraystyyppi = defaultProps.maaraystyyppi,
    muutosperustelut = defaultProps.muutosperustelut,
    onChangesRemove,
    onChangesUpdate,
    sectionId
  }) => {
    const intl = useIntl();

    const koulutusdata = useMemo(() => {
      return R.sortBy(R.prop("koodiArvo"), R.values(tutkinnot));
    }, [tutkinnot]);

    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    }

    return (
      <React.Fragment>
        {koulutusdata &&
          koulutusdata.length > 0 &&
          R.addIndex(R.map)((koulutusala, i) => {
            const anchorInitial = `${sectionId}_${koulutusala.koodiArvo}`;
            const changeObjectsPage1 = R.path(
              ["tutkinnot", koulutusala.koodiArvo],
              changeObjects
            );
            return changeObjectsPage1 && changeObjectsPage1.length ? (
              <ExpandableRowRoot
                anchor={anchorInitial}
                key={`expandable-row-root-${i}`}
                categories={[]}
                changes={R.path(
                  ["perustelut", "tutkinnot", koulutusala.koodiArvo],
                  changeObjects
                )}
                disableReverting={isReadOnly}
                hideAmountOfChanges={true}
                index={i}
                isExpanded={true}
                messages={changesMessages}
                onChangesRemove={onChangesRemove}
                onUpdate={onChangesUpdate}
                sectionId={sectionId}
                showCategoryTitles={true}
                title={parseLocalizedField(
                  koulutusala.metadata,
                  R.toUpper(intl.locale)
                )}>
                <Lomake
                  action="reasoning"
                  anchor={`${sectionId}_${koulutusala.koodiArvo}`}
                  changeObjects={
                    changeObjects.perustelut.tutkinnot[koulutusala.koodiArvo]
                  }
                  data={{
                    changeObjectsPage1,
                    kohde,
                    koulutusala,
                    lupakohde: lupaKohteet[1],
                    maaraystyyppi,
                    muutosperustelut
                  }}
                  key={`form-${koulutusala.koodiArvo}`}
                  showValidationErrors={!isFirstVisit}
                  isReadOnly={isReadOnly}
                  onChangesUpdate={onChangesUpdate}
                  path={["perustelut", "tutkinnot"]}
                  rulesFn={getRules}></Lomake>
              </ExpandableRowRoot>
            ) : null;
          }, _.cloneDeep(koulutusdata))}
      </React.Fragment>
    );
  }
);

PerustelutTutkinnot.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  isFirstVisit: PropTypes.bool,
  kohde: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  muutosperustelut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  sectionId: PropTypes.string,
  tutkinnot: PropTypes.object
};

export default PerustelutTutkinnot;
