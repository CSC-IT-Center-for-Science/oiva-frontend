import React, { useEffect, useMemo, useState } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import { getCategoriesForPerustelut } from "../../../../../../../services/muutoshakemus/utils/tutkinnotUtils";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import _ from "lodash";
import {
  getReducedStructure,
  getChangesForReadOnlyLomake
} from "../../../../../../../components/02-organisms/CategorizedListRoot/utils";

const defaultProps = {
  changeObjects: {},
  kohde: {},
  koulutukset: {},
  lomakkeet: {},
  lupa: {},
  maaraystyyppi: {},
  muutosperustelut: {},
  stateObjects: {
    perustelut: {},
    yhteenveto: {}
  }
};

const YhteenvetoTutkinnot = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    intl,
    kohde = defaultProps.kohde,
    koulutukset = defaultProps.koulutukset,
    lomakkeet = defaultProps.lomakkeet,
    lupa = defaultProps.lupa,
    maaraystyyppi = defaultProps.maaraystyyppi,
    onChangesRemove,
    onChangesUpdate,
    onStateUpdate,
    stateObjects = defaultProps.stateObjects
  }) => {
    const sectionId = "yhteenveto_tutkinnot";
    const [koulutusdata, setKoulutusdata] = useState([]);
    const [locale, setLocale] = useState([]);

    const readOnlyLomakkeet = useMemo(() => {
      return R.mapObjIndexed(lomake => {
        const reducedStructure = getReducedStructure(lomake);
        if (reducedStructure.length) {
          const changesForReadOnlyLomake = getChangesForReadOnlyLomake(
            reducedStructure
          );
          lomake = R.map(changeObj => {
            const objectOfReducedStructure = R.find(
              R.propEq("fullAnchor", changeObj.anchor)
            )(reducedStructure);
            const objectOfLomake = R.find(
              R.propEq("anchor", R.head(objectOfReducedStructure.anchorParts))
            )(lomake);
            const propertyPath = R.concat(objectOfReducedStructure.path, [
              "properties"
            ]);
            const currentProperties = R.path(propertyPath)(objectOfLomake);
            const updatedLomakeObject = R.assocPath(
              propertyPath,
              Object.assign({}, currentProperties, changeObj.properties),
              objectOfLomake
            );
            return updatedLomakeObject;
          }, changesForReadOnlyLomake);
        }
        return lomake;
      }, _.cloneDeep(lomakkeet));
    }, [lomakkeet]);

    useEffect(() => {
      const sortedKoulutusData = R.sortBy(
        R.prop("koodiArvo"),
        R.values(koulutukset.koulutusdata)
      );
      setKoulutusdata(sortedKoulutusData);
    }, [koulutukset]);

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
          const article = getArticle(areaCode, lupa.kohteet[1].maaraykset);
          const areaChanges = R.prop(areaCode, _changes);
          const categories = areaChanges
            ? getCategoriesForPerustelut(
                i,
                article,
                koulutusala.koulutukset,
                kohde,
                maaraystyyppi,
                locale,
                areaChanges,
                anchorInitial,
                readOnlyLomakkeet
              )
            : [];
          const title = parseLocalizedField(koulutusala.metadata, locale);
          return { areaCode, article, categories, title };
        }, _.cloneDeep(koulutusdata));
      };
    }, [locale, kohde, lupa.kohteet, maaraystyyppi, readOnlyLomakkeet]);

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
        <h3 className="py-6">Tutkinnot</h3>
        {R.path(["yhteenveto", "items"], stateObjects) &&
          R.addIndex(R.map)((stateItem, i) => {
            const anchorInitial = `perustelut_tutkinnot_${stateItem.areaCode}`;
            return stateItem.categories.length ? (
              <ExpandableRowRoot
                anchor={anchorInitial}
                key={`expandable-row-root-${i}`}
                categories={stateItem.categories}
                changes={R.path(
                  ["perustelut", "tutkinnot", stateItem.areaCode],
                  changeObjects
                )}
                code={stateItem.areaCode}
                disableReverting={true}
                hideAmountOfChanges={true}
                index={i}
                isExpanded={true}
                onChangesRemove={onChangesRemove}
                onUpdate={onChangesUpdate}
                sectionId={sectionId}
                title={stateItem.title}
              />
            ) : null;
          }, R.path(["yhteenveto", "items"], stateObjects))}
      </React.Fragment>
    );
  }
);

YhteenvetoTutkinnot.propTypes = {
  changeObjects: PropTypes.object,
  kohde: PropTypes.object,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.array,
  lomakkeet: PropTypes.object,
  lupa: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  muutosperustelut: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  sectionId: PropTypes.string,
  stateObjects: PropTypes.object
};

export default injectIntl(YhteenvetoTutkinnot);
