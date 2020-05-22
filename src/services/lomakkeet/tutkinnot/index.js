import * as R from "ramda";
import _ from "lodash";
import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import { findObjectWithKey } from "../../../utils/common";

const categories = {};

function getModificationForm(
  index,
  article,
  koulutustyypit,
  title,
  areaCode,
  locale
) {
  if (!categories[index]) {
    categories[index] = R.values(
      R.addIndex(R.map)((koulutustyyppi, i) => {
        return {
          anchor: koulutustyyppi.koodiArvo,
          meta: {
            areaCode,
            title
          },
          title:
            _.find(koulutustyyppi.metadata, m => {
              return m.kieli === locale;
            }).nimi || "[Koulutustyypin otsikko tähän]",
          categories: R.addIndex(R.map)((koulutus, ii) => {
            const maaraysKoulutukselle = article
              ? R.find(
                  R.propEq("koodi", koulutus.koodiArvo),
                  findObjectWithKey(article.koulutusalat, "koulutukset")
                ) || {}
              : {};

            const isInLupaBool = !R.isEmpty(maaraysKoulutukselle);

            const osaamisalat = (koulutus.osaamisalat || []).map(osaamisala => {
              const maaraysOsaamisalalle = article
                ? R.find(
                    R.propEq("koodi", osaamisala.koodiArvo),
                    findObjectWithKey(article.koulutusalat, "rajoitteet")
                  ) || {}
                : {};
              const isInLupaBool = !R.isEmpty(maaraysOsaamisalalle);
              const isAddedBool = false;
              const isRemovedBool = false;
              return {
                anchor: osaamisala.koodiArvo,
                components: [
                  {
                    anchor: "A",
                    fullAnchor: `${koulutustyyppi.koodiArvo}.lukuun-ottamatta.${osaamisala.koodiArvo}.A`,
                    name: "CheckboxWithLabel",
                    properties: {
                      forChangeObject: {
                        maaraysUuid: maaraysOsaamisalalle.maaraysId,
                        koodisto: osaamisala.koodisto,
                        metadata: osaamisala.metadata,
                        isInLupa: isInLupaBool
                      },
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
              components: [
                {
                  anchor: "A",
                  fullAnchor: `${koulutustyyppi.koodiArvo}.${koulutus.koodiArvo}.A`,
                  name: "CheckboxWithLabel",
                  properties: {
                    forChangeObject: {
                      maaraysUuid: maaraysKoulutukselle.maaraysId,
                      koodisto: koulutus.koodisto,
                      metadata: koulutus.metadata,
                      isInLupa: isInLupaBool
                    },
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
              categories: osaamisalat
            };
          }, koulutustyyppi.koulutukset)
        };
      }, koulutustyypit)
    );
  }
  return categories[index];
}

export default function getTutkinnotLomake(action, data, isReadOnly, locale) {
  switch (action) {
    case "modification":
      return getModificationForm(
        data.index,
        data.article,
        data.koulutustyypit,
        data.title,
        data.areaCode,
        R.toUpper(locale)
      );
    default:
      return [];
  }
}
