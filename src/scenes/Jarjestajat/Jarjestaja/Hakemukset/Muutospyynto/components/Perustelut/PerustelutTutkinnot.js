import React, { useEffect, useMemo, useState } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import { getCategoriesForPerustelut } from "../../../../../../../services/muutoshakemus/utils/tutkinnotUtils";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import _ from "lodash";

const defaultProps = {
  changeObjects: {},
  isReadOnly: false,
  kohde: {},
  lomakkeet: {},
  lupaKohteet: {},
  maaraystyyppi: {},
  stateObject: {},
  tutkinnot: {}
};

const PerustelutTutkinnot = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    intl,
    isReadOnly = defaultProps.isReadOnly,
    kohde = defaultProps.kohde,
    tutkinnot = defaultProps.tutkinnot,
    lomakkeet = defaultProps.lomakkeet,
    lupaKohteet = defaultProps.lupaKohteet,
    maaraystyyppi = defaultProps.maaraystyyppi,
    onChangesRemove,
    onChangesUpdate,
    onStateUpdate,
    stateObject = defaultProps.stateObject
  }) => {
    const sectionId = "perustelut_tutkinnot";
    const [koulutusdata, setKoulutusdata] = useState([]);
    const [locale, setLocale] = useState([]);

    useEffect(() => {
      const sortedKoulutusData = R.sortBy(
        R.prop("koodiArvo"),
        R.values(tutkinnot)
      );
      setKoulutusdata(sortedKoulutusData);
    }, [tutkinnot]);

    const getItems = useMemo(() => {
      const getArticle = (areaCode, articles = []) => {
        return R.find(article => {
          return article.koodi === areaCode;
        }, articles);
      };

      return (koulutusdata, _changes) => {
        return R.addIndex(R.map)((koulutusala, i) => {
          const areaCode = koulutusala.koodiarvo || koulutusala.koodiArvo;
          const anchorInitial = `tutkinnot_${areaCode}`;
          const article = getArticle(areaCode, lupaKohteet[1].maaraykset);
          const areaChanges = R.prop(areaCode, _changes);
          const categories = areaChanges
            ? getCategoriesForPerustelut(
                article,
                koulutusala.koulutukset,
                kohde,
                maaraystyyppi,
                intl,
                areaChanges,
                anchorInitial,
                lomakkeet,
                isReadOnly
              )
            : [];
          const title = parseLocalizedField(koulutusala.metadata, locale);
          return { areaCode, article, categories, title };
        }, _.cloneDeep(koulutusdata));
      };
    }, [isReadOnly, kohde, intl, locale, lomakkeet, lupaKohteet, maaraystyyppi]);

    useEffect(() => {
      if (koulutusdata.length) {
        const items = getItems(koulutusdata, changeObjects.tutkinnot);
        onStateUpdate(
          {
            items
          },
          sectionId
        );
      }
    }, [getItems, onStateUpdate, changeObjects.tutkinnot, koulutusdata]);

    useEffect(() => {
      setLocale(R.toUpper(intl.locale));
    }, [intl.locale]);

    return (
      <React.Fragment>
        {stateObject.items &&
          R.addIndex(R.map)((stateItem, i) => {
            const changes = R.path(
              ["tutkinnot", stateItem.areaCode],
              changeObjects
            );
            if (changes && !R.isEmpty(changes)) {
              const anchorInitial = `${sectionId}_${stateItem.areaCode}`;
              return (
                <ExpandableRowRoot
                  anchor={anchorInitial}
                  key={`expandable-row-root-${i}`}
                  categories={stateItem.categories}
                  changes={R.path(
                    ["perustelut", "tutkinnot", stateItem.areaCode],
                    changeObjects
                  )}
                  code={stateItem.areaCode}
                  disableReverting={isReadOnly}
                  hideAmountOfChanges={false}
                  index={i}
                  isExpanded={true}
                  onChangesRemove={onChangesRemove}
                  onUpdate={onChangesUpdate}
                  sectionId={sectionId}
                  showCategoryTitles={true}
                  title={stateItem.title}
                />
              );
            }
          }, stateObject.items)}
      </React.Fragment>
    );
  }
);

PerustelutTutkinnot.propTypes = {
  changeObjects: PropTypes.object,
  isReadOnly: PropTypes.bool,
  kohde: PropTypes.object,
  lomakkeet: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  sectionId: PropTypes.string,
  stateObject: PropTypes.object,
  tutkinnot: PropTypes.object
};

export default injectIntl(PerustelutTutkinnot);
