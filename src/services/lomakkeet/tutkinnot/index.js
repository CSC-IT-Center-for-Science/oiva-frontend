import * as R from "ramda";
import _ from "lodash";
import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import { findObjectWithKey } from "../../../utils/common";

function getModificationForm(article, koulutustyypit, title, areaCode, locale) {
  return R.values(
    R.addIndex(R.map)((koulutustyyppi, i) => {
      return {
        anchor: koulutustyyppi.koodiArvo,
        meta: {
          areaCode,
          title
        },
        title: _.find(koulutustyyppi.metadata, m => {
          return m.kieli === locale;
        }).nimi,
        categories: R.addIndex(R.map)((koulutus, ii) => {
          const maaraysKoulutukselle = article
            ? R.find(
                R.propEq("koodi", koulutus.koodiArvo),
                findObjectWithKey(article.koulutusalat, "koulutukset")
              ) || {}
            : {};

          const isTutkintoInLupaBool = !R.isEmpty(maaraysKoulutukselle);

          let isTutkintoIndeterminate = false;

          const osaamisalat = (koulutus.osaamisalat || []).map(osaamisala => {
            const maaraysOsaamisalalle = article
              ? R.find(
                  R.propEq("koodi", osaamisala.koodiArvo),
                  findObjectWithKey(article.koulutusalat, "rajoitteet")
                ) || {}
              : {};
            const osaamisalamaaraysFound = !R.isEmpty(maaraysOsaamisalalle);
            const isOsaamisalaInLupaBool =
              isTutkintoInLupaBool && !osaamisalamaaraysFound;
            if (!isOsaamisalaInLupaBool) {
              isTutkintoIndeterminate = true;
            }
            return {
              anchor: osaamisala.koodiArvo,
              components: [
                {
                  anchor: "osaamisala",
                  name: "CheckboxWithLabel",
                  properties: {
                    forChangeObject: {
                      maaraysUuid: maaraysOsaamisalalle.maaraysId,
                      koodisto: osaamisala.koodisto,
                      metadata: osaamisala.metadata,
                      isInLupa: isOsaamisalaInLupaBool,
                      isTutkintoInLupa: isTutkintoInLupaBool
                    },
                    name: "CheckboxWithLabel",
                    code: osaamisala.koodiArvo,
                    title: _.find(osaamisala.metadata, m => {
                      return m.kieli === locale;
                    }).nimi,
                    labelStyles: {
                      addition: isAdded,
                      removal: isRemoved,
                      custom: Object.assign(
                        {},
                        isOsaamisalaInLupaBool ? isInLupa : {}
                      )
                    },
                    isChecked: isOsaamisalaInLupaBool
                  }
                }
              ]
            };
          });

          return {
            anchor: koulutus.koodiArvo,
            components: [
              {
                anchor: "tutkinto",
                name: "CheckboxWithLabel",
                properties: {
                  forChangeObject: {
                    maaraysUuid: maaraysKoulutukselle.maaraysId,
                    koodisto: koulutus.koodisto,
                    metadata: koulutus.metadata,
                    isInLupa: isTutkintoInLupaBool
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
                    custom: Object.assign(
                      {},
                      isTutkintoInLupaBool ? isInLupa : {}
                    )
                  },
                  isChecked: isTutkintoInLupaBool,
                  isIndeterminate: isTutkintoIndeterminate
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

export default function getTutkinnotLomake(action, data, isReadOnly, locale) {
  switch (action) {
    case "modification":
      return getModificationForm(
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
