import { getAnchorPart } from "../../../../utils/common";
import { isAdded, isRemoved } from "../../../../css/label";
import { getMuutostarveCheckboxes } from "../common";
import "../../i18n-config";
import { __ } from "i18n-for-browser";
import _ from "lodash";
import * as R from "ramda";

export const getAdditionForm = (checkboxItems, locale, isReadOnly = false) => {
  const checkboxes = getMuutostarveCheckboxes(
    checkboxItems,
    locale,
    isReadOnly
  );
  return [
    {
      anchor: "perustelut",
      layout: {
        indentation: "none"
      },
      title: __("muutospyynnon.taustalla.olevat.syyt"),
      categories: checkboxes
    }
  ];
};

export const getRemovalForm = isReadOnly => {
  return [
    {
      anchor: "removal",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title:
              "Perustele lyhyesti miksi tutkintoon tähtäävää koulutusta ei haluta enää järjestää",
            value: "",
            requiredMessage: "Pakollinen tieto puuttuu"
          }
        }
      ]
    }
  ];
};

export const getOsaamisalaForm = isReadOnly => {
  return [
    {
      anchor: "osaamisala",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title: "Perustele lyhyesti miksi tälle muutokselle on tarvetta",
            value: "",
            requiredMessage: "Pakollinen tieto puuttuu"
          }
        }
      ]
    }
  ];
};

function getCategoriesForPerustelut(
  article,
  koulutustyypit,
  kohde,
  maaraystyyppi,
  changes,
  anchorInitial,
  muutosperustelut,
  locale,
  isReadOnly = false
) {
  if (!muutosperustelut) {
    return false;
  }
  const anchor = R.prop("anchor");
  const relevantAnchors = R.map(anchor)(changes);
  const relevantKoulutustyypit = R.filter(
    R.compose(R.not, R.isEmpty, R.prop("koulutukset")),
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
            [R.ascend(R.compose(R.length, anchor)), R.ascend(anchor)],
            R.filter(R.compose(R.startsWith(anchorBase), anchor))(changes)
          );
          return R.addIndex(R.map)((changeObj, i) => {
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
              anchor: `${koulutus.koodiArvo}|${i}`,
              categories: [
                {
                  anchor: osaamisala
                    ? osaamisala.koodiArvo
                    : getAnchorPart(changeObj.anchor, 2),
                  meta: {
                    kohde,
                    maaraystyyppi,
                    koodisto: koulutus.koodisto,
                    metadata: koulutus.metadata,
                    isInLupa: isInLupaBool
                  },
                  categories: osaamisala
                    ? getOsaamisalaForm(isReadOnly)
                    : isAddition
                    ? getAdditionForm(muutosperustelut, locale, isReadOnly)
                    : getRemovalForm(isReadOnly),
                  components: [
                    {
                      anchor: "A",
                      name: "StatusTextRow",
                      properties: {
                        code: osaamisala ? "" : koulutus.koodiArvo,
                        title: osaamisala
                          ? R.join(" ", [
                              __("osaamisalarajoitus"),
                              osaamisalakoodi,
                              nimi(osaamisala),
                              "(" +
                                koulutus.koodiArvo +
                                " " +
                                nimi(koulutus) +
                                ")"
                            ])
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
                }
              ]
            };
          }, changeObjs);
        }, koulutustyyppi.koulutukset)
      };
    }, _.cloneDeep(relevantKoulutustyypit))
  );
}

function getArticle(areaCode, articles = []) {
  return R.find(article => {
    return article.koodi === areaCode;
  }, articles);
}

const getReasoningForm = (
  koulutusala,
  kohde,
  lupakohde,
  maaraystyyppi,
  muutosperustelut,
  _changes = [],
  locale,
  isReadOnly = false
) => {
  const areaCode = koulutusala.koodiarvo || koulutusala.koodiArvo;
  const anchorInitial = `tutkinnot_${areaCode}`;
  const article = getArticle(areaCode, lupakohde.maaraykset);
  const categories = _changes.length
    ? getCategoriesForPerustelut(
        article,
        koulutusala.koulutukset,
        kohde,
        maaraystyyppi,
        _changes,
        anchorInitial,
        muutosperustelut,
        locale,
        isReadOnly
      )
    : [];
  return categories;
};

export default function getTutkinnotPerustelulomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "addition":
      return getAdditionForm(data.checkboxItems, locale, isReadOnly);
    case "osaamisala":
      return getOsaamisalaForm(isReadOnly);
    case "reasoning":
      return getReasoningForm(
        data.koulutusala,
        data.kohde,
        data.lupakohde,
        data.maaraystyyppi,
        data.muutosperustelut,
        data.changeObjectsPage1,
        R.toUpper(locale),
        isReadOnly
      );
    case "removal":
      return getRemovalForm();
    default:
      return [];
  }
}
