import { isInLupa, isAdded, isRemoved } from "../../../css/label";
import wizardMessages from "../../../i18n/definitions/wizard";
import * as R from "ramda";
import _ from "lodash";

const categories = {};

// This function might be unnecessary.
// All the form definitions should be in services/lomakkeet/ folder.
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
              components: [
                {
                  name: "StatusTextRow",
                  properties: {
                    title: intl.formatMessage(wizardMessages.except)
                  }
                }
              ]
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
                      isChecked: (isInLupaBool && !isRemovedBool) || isAddedBool
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
              categories:
                R.length(osaamisalat) > 0
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