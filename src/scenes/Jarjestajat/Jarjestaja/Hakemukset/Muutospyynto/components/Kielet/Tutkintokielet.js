import React, { useEffect, useMemo } from "react";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import * as R from "ramda";
import _ from "lodash";

const Tutkintokielet = React.memo(props => {
  const sectionId = "kielet_tutkintokielet";
  const { onChangesRemove, onChangesUpdate, onStateUpdate } = props;

  const items = useMemo(() => {
    const localeUpper = R.toUpper(props.intl.locale);
    const currentDate = new Date();
    return R.map(stateItem => {
      const categories = R.map(category => {
        const categories = R.map(subCategory => {
          /**
           * There might be some sub articles (alimääräyksiä) under the current article (määräys).
           * We are interested of them which are related to tutkintokielet section.
           * */
          const maarays = R.find(
            R.propEq("koodiarvo", subCategory.anchor),
            props.lupa.maaraykset
          );
          const alimaaraykset = maarays ? maarays.aliMaaraykset : [];

          /**
           * selectedByDefault includes all the languages which already are in LUPA.
           * Those languages must be shown on Autocomplete as selected by default.
           * */

          const selectedByDefault = R.map(alimaarays => {
            if (
              alimaarays.kohde.tunniste === "opetusjatutkintokieli" &&
              new Date(alimaarays.koodi.voimassaAlkuPvm) < currentDate
            ) {
              const metadataObj = R.find(
                R.propEq("kieli", localeUpper),
                alimaarays.koodi.metadata
              );
              return metadataObj
                ? { label: metadataObj.nimi, value: alimaarays.koodi.koodiArvo }
                : null;
            }
            return null;
          }, alimaaraykset || []).filter(Boolean);

          // Let's create the updatedSubCategory variable without categories key
          let { categories, ...updatedSubCategory } = subCategory;
          let changeObj = null;
          if (R.path([stateItem.areaCode], props.changeObjects.tutkinnot)) {
            const anchor = `tutkinnot_${R.join(".", [
              stateItem.areaCode,
              category.anchor,
              subCategory.anchor,
              subCategory.components[0].anchor
            ])}`;
            changeObj = R.find(
              R.propEq("anchor", anchor),
              R.path([stateItem.areaCode], props.changeObjects.tutkinnot) || []
            );
          }
          if (
            (subCategory.components[0].properties.isChecked && !changeObj) ||
            (changeObj && changeObj.properties.isChecked)
          ) {
            updatedSubCategory.components = [
              {
                ...subCategory.components[0],
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  name: "StatusTextRow",
                  code: subCategory.components[0].properties.code,
                  title: subCategory.components[0].properties.title,
                  labelStyles: {}
                }
              },
              {
                anchor: "B",
                name: "Autocomplete",
                properties: {
                  options: R.map(language => {
                    return {
                      label:
                        R.find(m => {
                          return m.kieli === props.locale;
                        }, language.metadata).nimi || "[Kielen nimi tähän]",
                      value: language.koodiArvo
                    };
                  }, props.kielet),
                  value: selectedByDefault
                }
              }
            ];
          } else {
            updatedSubCategory = null;
          }
          return updatedSubCategory;
        }, category.categories).filter(Boolean);
        return categories.length
          ? {
              ...category,
              categories
            }
          : null;
      }, stateItem.categories).filter(Boolean);
      return categories.length
        ? {
            ...stateItem,
            categories
          }
        : null;
    }, _.cloneDeep(props.stateObjects.tutkinnot.items)).filter(Boolean);
  }, [
    props.changeObjects.tutkinnot,
    props.intl.locale,
    props.kielet,
    props.locale,
    props.lupa.maaraykset,
    props.stateObjects.tutkinnot.items
  ]);

  useEffect(() => {
    onStateUpdate({ items, koodistoUri: "kieli" }, sectionId);
  }, [items, onStateUpdate]);

  useEffect(() => {
    if (props.unselectedAnchors.length && props.changeObjects.tutkintokielet) {
      let tutkintokielichangesWithoutRemovedOnes = Object.assign(
        {},
        props.changeObjects.tutkintokielet
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
          props.changeObjects.tutkintokielet
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
    props.changeObjects.tutkintokielet,
    props.unselectedAnchors
  ]);

  return (
    <React.Fragment>
      {R.addIndex(R.map)((_item, i) => {
        const item = _.cloneDeep(_item);
        return (
          <React.Fragment key={i}>
            {item.categories && (
              <ExpandableRowRoot
                anchor={`${sectionId}_${item.areaCode}`}
                categories={item.categories}
                changes={R.path(
                  ["tutkintokielet", item.areaCode],
                  props.changeObjects
                )}
                code={item.areaCode}
                index={i}
                key={`expandable-row-root-${i}`}
                onChangesRemove={onChangesRemove}
                onUpdate={onChangesUpdate}
                sectionId={sectionId}
                showCategoryTitles={true}
                title={item.title}
              />
            )}
          </React.Fragment>
        );
      }, R.path(["tutkintokielet", "items"], props.stateObjects) || [])}
    </React.Fragment>
  );
});

Tutkintokielet.defaultProps = {
  changeObjects: {
    tutkinnot: [],
    tutkintokielet: {}
  },
  kielet: [],
  locale: "FI",
  unselectedAnchors: [],
  stateObjects: {}
};

Tutkintokielet.propTypes = {
  changeObjects: PropTypes.object,
  categories: PropTypes.array,
  kielet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.array,
  locale: PropTypes.string,
  lupa: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObjects: PropTypes.object,
  unselectedAnchors: PropTypes.array
};

export default injectIntl(Tutkintokielet);
