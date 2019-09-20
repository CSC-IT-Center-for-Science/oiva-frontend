import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import * as R from "ramda";
import ExpandableRowRoot from "../../../../../../../components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../../modules/helpers";
import { isInLupa, isAdded, isRemoved } from "../../../../../../../css/label";
import PropTypes from "prop-types";
import _ from "lodash";

const defaultProps = {
  changeObjects: {},
  kohde: {},
  maaraykset: [],
  muut: {},
  stateObject: {}
};

const PerustelutMuut = React.memo(
  ({
    changeObjects = defaultProps.changeObjects,
    intl,
    kohde = PropTypes.kohde,
    maaraykset = defaultProps.maaraykset,
    muut = defaultProps.muut,
    onChangesRemove,
    onChangesUpdate,
    onStateUpdate,
    stateObject = defaultProps.stateObject
  }) => {
    const sectionId = "perustelut_muut";
    const [locale, setLocale] = useState("FI");

    useEffect(() => {
      const divideArticles = (articles, relevantCodes) => {
        const dividedArticles = {};
        const relevantMaaraykset = R.filter(
          R.propEq("koodisto", "oivamuutoikeudetvelvollisuudetehdotjatehtavat")
        )(maaraykset);
        R.forEach(article => {
          const { metadata } = article;
          const kasite = parseLocalizedField(metadata, "FI", "kasite");
          const kuvaus = parseLocalizedField(metadata, "FI", "kuvaus");
          const isInRelevantMaaraykset = !!R.find(
            R.propEq("koodiarvo", article.koodiArvo)
          )(relevantMaaraykset);
          if (
            kuvaus &&
            kasite &&
            R.includes(article.koodiArvo, relevantCodes) &&
            (isInRelevantMaaraykset ||
              (article.koodiArvo !== "15" && article.koodiArvo !== "22"))
          ) {
            dividedArticles[kasite] = dividedArticles[kasite] || [];
            dividedArticles[kasite].push(article);
          }
        }, articles);
        return dividedArticles;
      };

      const getCategories = (configObj, locale) => {
        return R.map(item => {
          return {
            anchor: configObj.key,
            title: item.title,
            categories: R.map(article => {
              const title =
                _.find(article.metadata, m => {
                  return m.kieli === locale;
                }).kuvaus || "[Koulutuksen otsikko tähän]";
              const isInLupaBool = article
                ? !!_.find(article.voimassaAlkuPvm, koulutusala => {
                    return article.koodiArvo === koulutusala;
                  })
                : false;
              const anchorInit = `muut_${configObj.code}.${configObj.key}.${article.koodiArvo}`;
              const changeObj = R.find(
                R.compose(
                  R.startsWith(anchorInit),
                  R.prop("anchor")
                ),
                changeObjects.muut[configObj.code]
              );
              const isAddition = changeObj && changeObj.properties.isChecked;
              const labelClasses = {
                isInLupa: isInLupaBool
              };
              let structure = {
                anchor: article.koodiArvo,
                meta: {
                  isInLupa: isInLupaBool,
                  koodiarvo: article.koodiArvo,
                  koodisto: article.koodisto
                },
                components: [
                  {
                    anchor: "A",
                    name: item.componentName,
                    properties: {
                      name: item.componentName,
                      title: title,
                      labelStyles: {
                        addition: isAdded,
                        removal: isRemoved,
                        custom: Object.assign(
                          {},
                          labelClasses.isInLupa ? isInLupa : {}
                        )
                      },
                      styleClasses: ["flex"],
                      statusTextStyleClasses: isAddition
                        ? ["text-green-600 pr-4 w-20 font-bold"]
                        : ["text-red-500 pr-4 w-20 font-bold"],
                      statusText: isAddition ? " LISÄYS:" : " POISTO:"
                    }
                  }
                ]
              };
              structure.categories = [
                {
                  anchor: "perustelut",
                  title: "Perustelut",
                  components: [
                    {
                      anchor: "A",
                      name: "TextBox",
                      properties: {
                        placeholder: "Perustele muutokset tähän, kiitos."
                      }
                    }
                  ]
                }
              ];
              return structure;
            }, item.articles)
          };
        }, configObj.categoryData);
      };

      const relevantCodes = R.map(
        R.compose(
          R.view(R.lensIndex(2)),
          R.split(".")
        )
      )(
        R.map(
          R.prop("anchor"),
          R.compose(
            R.flatten,
            R.values
          )(changeObjects.muut)
        )
      );
      const dividedArticles = divideArticles(muut.data, relevantCodes);

      const config = [
        {
          code: "01",
          key: "laajennettu",
          isInUse:
            !!dividedArticles["laajennettu"] && !!changeObjects.muut["01"],
          title: "Laajennettu oppisopimuskoulutuksen järjestämistehtävä",
          categoryData: [
            {
              articles: dividedArticles.laajennettu || [],
              componentName: "StatusTextRow"
            }
          ]
        },
        {
          code: "02",
          key: "vaativatuki",
          isInUse:
            !!dividedArticles["vaativa_1"] ||
            !!dividedArticles["vaativa_2"] ||
            !!changeObjects.muut["02"],
          title: "Vaativan erityisen tuen tehtävä",
          categoryData: [
            {
              articles: dividedArticles.vaativa_1 || [],
              componentName: "StatusTextRow"
            },
            {
              articles: dividedArticles.vaativa_2 || [],
              componentName: "StatusTextRow"
            }
          ]
        },
        {
          code: "03",
          key: "sisaoppilaitos",
          isInUse: !!dividedArticles["sisaoppilaitos"],
          title: "Sisäoppilaitosmuotoinen koulutus",
          categoryData: [
            {
              articles: dividedArticles.sisaoppilaitos || [],
              componentName: "StatusTextRow"
            }
          ]
        },
        {
          code: "04",
          key: "vankila",
          isInUse: !!dividedArticles["vankila"],
          title: "Vankilaopetus",
          categoryData: [
            {
              articles: dividedArticles.vankila || [],
              componentName: "StatusTextRow"
            }
          ]
        },
        {
          code: "05",
          key: "urheilu",
          isInUse: !!dividedArticles["urheilu"],
          title: "Urheilijoiden ammatillinen koulutus",
          categoryData: [
            {
              articles: dividedArticles.urheilu || [],
              componentName: "StatusTextRow"
            }
          ]
        },
        {
          code: "06",
          key: "yhteistyo",
          isInUse: !!dividedArticles["yhteistyo"],
          title: "Yhteistyö",
          categoryData: [
            {
              articles: dividedArticles.yhteistyo || [],
              componentName: "StatusTextRow"
            }
          ]
        },
        {
          code: "07",
          key: "muumaarays",
          isInUse: !!dividedArticles["muumaarays"],
          title: "Muu määräys",
          categoryData: [
            {
              articles: dividedArticles.muumaarays || [],
              componentName: "StatusTextRow"
            }
          ]
        }
      ];

      const expandableRows = !!locale.length
        ? R.addIndex(R.map)((configObj, i) => {
            return {
              code: configObj.code,
              key: configObj.key,
              title: configObj.title,
              categories: getCategories(configObj, locale, kohde),
              data: configObj.categoryData
            };
          }, R.filter(R.propEq("isInUse", true))(config))
        : [];

      onStateUpdate({ items: expandableRows }, sectionId);
    }, [
      kohde,
      locale,
      intl,
      maaraykset,
      muut.data,
      changeObjects.muut,
      onStateUpdate
    ]);

    useEffect(() => {
      setLocale(R.toUpper(intl.locale));
    }, [intl.locale]);

    return (
      <React.Fragment>
        {stateObject.items ? (
          <React.Fragment>
            {R.addIndex(R.map)((row, i) => {
              return (
                <ExpandableRowRoot
                  anchor={`${sectionId}_${row.code}`}
                  key={`expandable-row-root-${i}`}
                  categories={row.categories}
                  changes={R.path(["perustelut", row.code], changeObjects)}
                  code={row.code}
                  isExpanded={true}
                  onChangesRemove={onChangesRemove}
                  onUpdate={onChangesUpdate}
                  sectionId={sectionId}
                  title={row.title}
                />
              );
            })(stateObject.items)}
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
);

PerustelutMuut.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  headingNumber: PropTypes.number,
  kohde: PropTypes.object,
  maaraykset: PropTypes.array,
  muut: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  title: PropTypes.string,
  stateObject: PropTypes.object
};

export default injectIntl(PerustelutMuut);
