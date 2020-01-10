import { isInLupa, isAdded, isRemoved } from "../../../css/label";
import * as R from "ramda";
import _ from "lodash";
import { getAnchorPart } from "../../../utils/common";
import wizardMessages from "../../../i18n/definitions/wizard";

const categories = {};

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
  intl
) => {
  const locale = R.toUpper(intl.locale);
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

            const osaamisalaTitle = {
                anchor: "lukuun-ottamatta",
                components: [{
                  name: "StatusTextRow",
                  properties: {
                    title: intl.formatMessage(wizardMessages.except),
                  }
                }]
              };

            const osaamisalat = (koulutus.osaamisalat || []).map(osaamisala => {
              const isInLupaBool = article
                ? !!_.find(article.koulutusalat, koulutusala => {
                  return !!_.find(koulutusala.koulutukset, koulutus => {
                    return !!_.find(koulutus.rajoitteet, {
                      koodi: osaamisala.koodiArvo
                    });
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
                        removal: isRemoved,
                        custom: Object.assign({}, isInLupaBool ? isInLupa : {})
                      },
                      isChecked:
                        (isInLupaBool && !isRemovedBool) || isAddedBool
                    }
                  }
                ]
              };
            });

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
              categories: R.length(osaamisalat) > 0
                ? R.prepend(osaamisalaTitle, osaamisalat)
                : osaamisalat
            };
          }, koulutustyyppi.koulutukset)
        };
      }, koulutustyypit)
    );
  }
  return categories[index];
};

export const getCategoriesForPerustelut = (
  article,
  koulutustyypit,
  kohde,
  maaraystyyppi,
  intl,
  changes,
  anchorInitial,
  lomakkeet
) => {
  if (!lomakkeet) {
    return false;
  }
  const locale = R.toUpper(intl.locale);
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

  return R.values(
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
            [
              R.ascend(
                R.compose(
                  R.length,
                  anchor
                )
              ),
              R.ascend(anchor)
            ],
            R.filter(
              R.compose(
                R.startsWith(anchorBase),
                anchor
              )
            )(changes)
          );

          const toStructure = changeObj => {
            const anchorWOLast = R.init(R.split(".")(anchor(changeObj)));
            const osaamisalakoodi = R.last(anchorWOLast);

            const osaamisala = R.find(
              i => i.koodiArvo === osaamisalakoodi,
              koulutus.osaamisalat
            );
            const isAddition = changeObj.properties.isChecked;

            const nimi = obj =>
              _.find(R.prop("metadata", obj), m => m.kieli === locale).nimi;

            return {
              anchor: R.join(
                ".",
                [
                  getAnchorPart(changeObj.anchor, 2),
                  osaamisala ? osaamisala.koodiArvo : null
                ].filter(Boolean)
              ),
              meta: {
                kohde,
                maaraystyyppi,
                koodisto: koulutus.koodisto,
                metadata: koulutus.metadata,
                isInLupa: isInLupaBool
              },
              categories: osaamisala
                ? lomakkeet.osaamisala
                : isAddition
                  ? lomakkeet.addition
                  : lomakkeet.removal,
              components: [
                {
                  anchor: "A",
                  name: "StatusTextRow",
                  properties: {
                    code: osaamisala ? '' : koulutus.koodiArvo,
                    title: osaamisala
                      ? R.join(' ',
                         [intl.formatMessage(wizardMessages.osaamisalarajoitus),
                          osaamisalakoodi,
                          nimi(osaamisala),
                           '(' + koulutus.koodiArvo + ' ' + nimi(koulutus) + ')'])
                      : nimi(koulutus),
                    labelStyles: {
                      addition: isAdded,
                      removal: isRemoved
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
          };
          return R.map(toStructure, changeObjs);
        }, koulutustyyppi.koulutukset)
      };
    }, _.cloneDeep(relevantKoulutustyypit))
  );
};
