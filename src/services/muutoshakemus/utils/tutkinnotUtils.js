import { isInLupa, isAdded, isRemoved } from "../../../css/label";
import * as R from "ramda";
import _ from "lodash";

const categories = {};
const perusteluCategoriat = {};

export const getMetadata = (anchorParts, categories, i = 0) => {
  const category = R.find(R.propEq("anchor", anchorParts[i]), categories);
  if (anchorParts[i + 1]) {
    return getMetadata(anchorParts, category.categories, i + 1);
  }
  return category.meta;
};

export const getCategories = (
  index,
  article,
  koulutustyypit,
  kohde,
  maaraystyyppi,
  locale
) => {
  if (!categories[index]) {
    categories[index] = R.values(
      R.map(koulutustyyppi => {
        return {
          anchor: koulutustyyppi.koodiArvo,
          code: koulutustyyppi.koodiArvo,
          title:
            _.find(koulutustyyppi.metadata, m => {
              return m.kieli === locale;
            }).nimi || "[Koulutustyypin otsikko tähän]",
          categories: R.map(koulutus => {
            const isInLupaBool = article
              ? !!_.find(article.koulutusalat, koulutusala => {
                  return !!_.find(koulutusala.koulutukset, {
                    koodi: koulutus.koodiArvo
                  });
                })
              : false;

            return {
              anchor: koulutus.koodiArvo,
              meta: {
                kohde,
                maaraystyyppi,
                koodisto: koulutus.koodisto,
                metadata: koulutus.metadata,
                isInLupa: isInLupaBool
              },
              components: [
                {
                  anchor: "A",
                  name: "CheckboxWithLabel",
                  properties: {
                    name: "CheckboxWithLabel",
                    code: koulutus.koodiArvo,
                    title:
                      _.find(koulutus.metadata, m => {
                        return m.kieli === locale;
                      }).nimi || "[Koulutuksen otsikko tähän]",
                    labelStyles: {
                      addition: isAdded,
                      removal: isRemoved,
                      custom: Object.assign({}, isInLupaBool ? isInLupa : {})
                    },
                    isChecked: isInLupaBool
                  }
                }
              ],
              categories: (koulutus.osaamisalat || [])
                .sort((a, b) => a.koodiArvo.localeCompare(b.koodiArvo))
                .map(osaamisala => {
                    const isInLupaBool = article
                      ? !!_.find(article.koulutusalat, koulutusala => {
                        return !!_.find(koulutusala.koulutukset, {
                          koodi: osaamisala.koodiArvo
                        });
                      })
                      : false;
                    const isAddedBool = false;
                    const isRemovedBool = false;
                    return {
                      anchor: osaamisala.koodiArvo,
                      meta: {
                        kohde,
                        maaraystyyppi,
                        koodisto: osaamisala.koodisto,
                        metadata: osaamisala.metadata,
                        isInLupa: isInLupaBool
                      },
                      components: [
                        {
                          anchor: "A",
                          name: "CheckboxWithLabel",
                          properties: {
                            name: "CheckboxWithLabel",
                            code: osaamisala.koodiArvo,
                            title:
                              _.find(osaamisala.metadata, m => {
                                return m.kieli === "FI";
                              }).nimi || "[Osaamisalan otsikko tähän]",
                            labelStyles: {
                              addition: isAdded,
                              removal: isRemoved
                            },
                            isChecked:
                              (isInLupaBool && !isRemovedBool) || isAddedBool
                          }
                        }
                      ]
                    };
                  }
                )
            };
          }, koulutustyyppi.koulutukset)
        };
      }, koulutustyypit)
    );
  }
  return categories[index];
};

export const getCategoriesForPerustelut = (
  index,
  article,
  koulutustyypit,
  kohde,
  maaraystyyppi,
  locale,
  changes,
  anchorInitial,
  lomakkeet
) => {
  const anchor = R.prop("anchor");
  const relevantAnchors = R.map(anchor)(changes);
  const relevantKoulutustyypit = R.filter(
    R.compose(
      R.not,
      R.isEmpty,
      R.prop("koulutukset")
    ),
    R.mapObjIndexed(koulutustyyppi => {
      koulutustyyppi.koulutukset = R.filter(koulutus => {
        const anchorStart = `${anchorInitial}.${koulutustyyppi.koodiArvo}.${koulutus.koodiArvo}`;
        return !!R.find(R.startsWith(anchorStart))(relevantAnchors);
      }, koulutustyyppi.koulutukset);
      return koulutustyyppi;
    })(koulutustyypit)
  );

  if (!perusteluCategoriat[index]) {
    perusteluCategoriat[index] = R.values(
      R.map(koulutustyyppi => {
        return {
          anchor: koulutustyyppi.koodiArvo,
          code: koulutustyyppi.koodiArvo,
          title:
            _.find(koulutustyyppi.metadata, m => {
              return m.kieli === locale;
            }).nimi || "[Koulutustyypin otsikko tähän]",
          categories: R.chain(koulutus => {
            const isInLupaBool = article
              ? !!_.find(article.koulutusalat, koulutusala => {
                  return !!_.find(koulutusala.koulutukset, {
                    koodi: koulutus.koodiArvo
                  });
                })
              : false;

            const anchorBase = `${anchorInitial}.${koulutustyyppi.koodiArvo}.${koulutus.koodiArvo}`;

            const changeObjs = R.sortWith(
              [R.ascend(R.compose(R.length, anchor)), R.ascend(anchor)],
              R.filter(
                R.compose(
                  R.startsWith(anchorBase),
                  anchor
                )
              )(changes));

            const toStructure = (changeObj) => {
              const anchorWOLast = R.init(R.split('.')(anchor(changeObj)));
              const osaamisalakoodi = R.last(anchorWOLast);
              const osaamisala = R.find(i => i.koodiArvo === osaamisalakoodi, koulutus.osaamisalat);
              const isAddition = changeObj.properties.isChecked;

              console.info("%c Handling changes", 'color:green;', changeObj, osaamisala);

              const nimi = (obj) => _.find(R.prop('metadata', obj), m => m.kieli === locale).nimi;

              return {
                anchor: R.join('.', anchorWOLast),
                meta: {
                  kohde,
                  maaraystyyppi,
                  koodisto: koulutus.koodisto,
                  metadata: koulutus.metadata,
                  isInLupa: isInLupaBool
                },
                categories: (isAddition ? lomakkeet.addition : lomakkeet.removal),
                components: [
                  {
                    anchor: "A",
                    name: "StatusTextRow",
                    properties: {
                      code: koulutus.koodiArvo,
                      title: nimi(koulutus) +
                        (osaamisala ?
                          ", lukuun ottamatta " + osaamisalakoodi + " " + nimi(osaamisala) :
                          ""),
                      labelStyles: {
                        addition: isAdded,
                        removal: isRemoved,
                        custom: Object.assign({}, isInLupaBool ? isInLupa : {})
                      },
                      styleClasses: ["flex"],
                      statusTextStyleClasses: isAddition
                        ? ["text-green-600 pr-4 w-20 font-bold"]
                        : ["text-red-500 pr-4 w-20 font-bold"],
                      statusText: isAddition ? " LISÄYS:" : " POISTO:"
                    }
                  }
                ]
              }
            };

            return R.map(toStructure, changeObjs);
          }, koulutustyyppi.koulutukset)
        };
      }, _.cloneDeep(relevantKoulutustyypit))
    );
  }
  return perusteluCategoriat[index];
};
