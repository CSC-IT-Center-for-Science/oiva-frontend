import React, { useEffect, useMemo, useState } from "react";
import { injectIntl } from "react-intl";
import * as R from "ramda";
import ExpandableRowRoot from "../../../../../../components/02-organisms/ExpandableRowRoot";
import { parseLocalizedField } from "../../../../../../modules/helpers";
import { isInLupa, isAdded, isRemoved } from "../../../../../../css/label";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import _ from "lodash";

const MuutospyyntoWizardMuut = React.memo(props => {
  const sectionId = "muut";
  const [muutdata, setMuutdata] = useState(null);
  const [locale, setLocale] = useState("FI");
  const { onChangesRemove, onChangesUpdate, onStateUpdate } = props;

  const osiota5koskevatMaaraykset = useMemo(() => {
    return R.filter(
      R.propEq("koodisto", "oivamuutoikeudetvelvollisuudetehdotjatehtavat")
    )(props.maaraykset);
  }, [props.maaraykset]);

  const divideArticles = useMemo(() => {
    return () => {
      const group = {};
      R.forEach(article => {
        const { metadata } = article;
        const kasite = parseLocalizedField(metadata, "FI", "kasite");
        const kuvaus = parseLocalizedField(metadata, "FI", "kuvaus");
        const isInLupa = !!R.find(R.propEq("koodiarvo", article.koodiArvo))(
          osiota5koskevatMaaraykset
        );
        if (
          (kuvaus || article.koodiArvo === "22") &&
          kasite &&
          (isInLupa || article.koodiArvo !== "15")
        ) {
          group[kasite] = group[kasite] || [];
          group[kasite].push(article);
        }
      }, props.muut);
      return group;
    };
  }, [osiota5koskevatMaaraykset, props.muut]);

  const getCategories = useMemo(() => {
    return (configObj, locale) => {
      return R.map(item => {
        let noItemsInLupa = true;
        const isVaativatukiRadios =
          configObj.key === "vaativatuki" &&
          item.componentName === "RadioButtonWithLabel";
        const sortedArticles = R.sortBy(R.prop("koodiArvo"), item.articles);
        return {
          anchor: configObj.key,
          title: item.title,
          categories: R.addIndex(R.map)((article, index) => {
            const title =
              _.find(article.metadata, m => {
                return m.kieli === locale;
              }).kuvaus || "Muu";
            const isInLupaBool = !!R.find(
              R.propEq("koodiarvo", article.koodiArvo)
            )(osiota5koskevatMaaraykset);
            if (isInLupaBool) {
              noItemsInLupa = false;
            }
            const labelClasses = {
              isInLupa: isInLupaBool
            };
            let result = {
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
                    // This is for the Perustelut page and for showing or not showing a form for reasoning.
                    forChangeObject: {
                      isReasoningRequired:
                        !isVaativatukiRadios ||
                        index !== sortedArticles.length - 1
                    },
                    name: item.componentName,
                    isChecked:
                      isInLupaBool ||
                      // Here we are checking if the last radio button of vaativa tuki options should be selected.
                      (noItemsInLupa &&
                        isVaativatukiRadios &&
                        index === sortedArticles.length - 1),
                    title: title,
                    labelStyles: {
                      addition: isAdded,
                      removal: isRemoved,
                      custom: Object.assign(
                        {},
                        labelClasses.isInLupa ? isInLupa : {}
                      )
                    }
                  }
                }
              ]
            };
            if (article.koodiArvo === "22") {
              result.categories = [
                {
                  anchor: "other",
                  components: [
                    {
                      anchor: "A",
                      name: "TextBox",
                      properties: {
                        placeholder: props.intl.formatMessage(
                          wizardMessages.other_placeholder
                        )
                      }
                    }
                  ]
                }
              ];
            }
            return result;
          }, sortedArticles)
        };
      }, configObj.categoryData);
    };
  }, [props.intl, osiota5koskevatMaaraykset]);

  const config = useMemo(() => {
    const dividedArticles = divideArticles();
    return [
      {
        code: "01",
        key: "laajennettu",
        isInUse: !!dividedArticles["laajennettu"].length,
        title: "Laajennettu oppisopimuskoulutuksen järjestämistehtävä",
        categoryData: [
          {
            articles: dividedArticles.laajennettu || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      },
      {
        code: "02",
        key: "vaativatuki",
        isInUse:
          !!dividedArticles["vaativa_1"].length ||
          !!dividedArticles["vaativa_2"].length,
        title: "Vaativan erityisen tuen tehtävä",
        categoryData: [
          {
            articles: dividedArticles.vaativa_1 || [],
            componentName: "RadioButtonWithLabel",
            title: props.intl.formatMessage(wizardMessages.chooseOnlyOne)
          },
          {
            articles: dividedArticles.vaativa_2 || [],
            componentName: "CheckboxWithLabel",
            title: props.intl.formatMessage(wizardMessages.chooseAdditional)
          }
        ]
      },
      {
        code: "03",
        key: "sisaoppilaitos",
        isInUse: !!dividedArticles["sisaoppilaitos"].length,
        title: "Sisäoppilaitosmuotoinen koulutus",
        categoryData: [
          {
            articles: dividedArticles.sisaoppilaitos || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      },
      {
        code: "04",
        key: "vankila",
        isInUse: !!dividedArticles["vankila"].length,
        title: "Vankilaopetus",
        categoryData: [
          {
            articles: dividedArticles.vankila || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      },
      {
        code: "05",
        key: "urheilu",
        isInUse: !!dividedArticles["urheilu"].length,
        title: "Urheilijoiden ammatillinen koulutus",
        categoryData: [
          {
            articles: dividedArticles.urheilu || [],
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      },
      {
        code: "06",
        key: "yhteistyo",
        isInUse: !!dividedArticles["yhteistyo"].length,
        title: "Yhteistyö",
        categoryData: [
          {
            componentName: "CheckboxWithLabel",
            title: "",
            articles: dividedArticles.yhteistyo || []
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
            componentName: "CheckboxWithLabel",
            title: ""
          }
        ]
      }
    ];
  }, [divideArticles, props.intl]);

  const expandableRows = useMemo(() => {
    return !!locale.length
      ? R.addIndex(R.map)((configObj, i) => {
          return {
            code: configObj.code,
            key: configObj.key,
            title: configObj.title,
            categories: getCategories(configObj, locale, props.kohde),
            data: configObj.categoryData
          };
        }, R.filter(R.propEq("isInUse", true))(config))
      : [];
  }, [config, getCategories, props.kohde, locale]);

  useEffect(() => {
    setMuutdata(expandableRows);
  }, [expandableRows]);

  useEffect(() => {
    setLocale(R.toUpper(props.intl.locale));
  }, [props.intl.locale]);

  useEffect(() => {
    if (muutdata) {
      onStateUpdate(
        {
          kohde: props.kohde,
          maaraystyyppi: props.maaraystyyppi,
          muutdata
        },
        sectionId
      );
    }
  }, [muutdata, onStateUpdate, props.kohde, props.maaraystyyppi]);

  return (
    <React.Fragment>
      {props.kohde && muutdata && (
        <React.Fragment>
          {R.addIndex(R.map)((row, i) => {
            return (
              <ExpandableRowRoot
                anchor={`${sectionId}_${row.code}`}
                key={`expandable-row-root-${i}`}
                categories={row.categories}
                changes={R.path(["muut", row.code], props.changeObjects)}
                code={row.code}
                index={i}
                onUpdate={onChangesUpdate}
                sectionId={sectionId}
                showCategoryTitles={true}
                title={row.title}
                onChangesRemove={onChangesRemove}
              />
            );
          }, muutdata)}
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

MuutospyyntoWizardMuut.defaultProps = {
  changeObjects: {},
  stateObjects: {}
};

MuutospyyntoWizardMuut.propTypes = {
  changeObjects: PropTypes.object,
  headingNumber: PropTypes.number,
  kohde: PropTypes.object,
  maaraykset: PropTypes.array,
  maaraystyyppi: PropTypes.object,
  muut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  stateObjects: PropTypes.object
};

export default injectIntl(MuutospyyntoWizardMuut);
