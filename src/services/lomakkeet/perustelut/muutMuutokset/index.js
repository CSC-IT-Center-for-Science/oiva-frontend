import * as R from "ramda";
import { isInLupa, isAdded, isRemoved } from "../../../../css/label";
import {
  getVankilaopetusPerustelulomake,
  getVaativaErityinenTukilomake,
  getOppisopimusPerusteluLomake
} from "../muut";
import { parseLocalizedField } from "../../../../modules/helpers";
import { sortArticlesByHuomioitavaKoodi } from "../../utils";

function getStructureByKoodiarvo(
  perusteltavaTeksti,
  isAddition,
  isReadOnly,
  lomakkeet
) {
  const structure =
    perusteltavaTeksti !== ""
      ? [
          {
            anchor: "A",
            components: [
              {
                name: "StatusTextRow",
                properties: {
                  isReadOnly,
                  title: perusteltavaTeksti
                }
              }
            ],
            categories: isAddition ? lomakkeet.lisays : lomakkeet.poisto
          }
        ]
      : isAddition
      ? lomakkeet.lisays
      : lomakkeet.poisto;
  return structure;
}

function getDefaultAdditionForm(isReadOnly) {
  return [
    {
      anchor: "perustelut",
      layout: {
        margins: { top: "small" },
        strategy: {
          key: "groups"
        }
      },
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title: "Perustele",
            value: ""
          }
        }
      ]
    }
  ];
}

function getDefaultRemovalForm(isReadOnly) {
  return getDefaultAdditionForm(isReadOnly);
}

function getMapping(vankilat, isReadOnly, locale, defaultRemovalForm) {
  return [
    {
      koodiarvot: [5],
      lomakkeet: {
        lisays: getVankilaopetusPerustelulomake(vankilat, isReadOnly, locale),
        poisto: defaultRemovalForm
      }
    },
    {
      koodiarvot: [2, 16, 17, 18, 19, 20, 21],
      lomakkeet: {
        lisays: getVaativaErityinenTukilomake(isReadOnly),
        poisto: defaultRemovalForm
      }
    },
    {
      koodiarvot: [1],
      lomakkeet: {
        lisays: getOppisopimusPerusteluLomake(isReadOnly),
        poisto: defaultRemovalForm
      }
    }
  ];
}

function getCategoriesByKoodiarvo(
  koodiarvo,
  mapping,
  defaultAdditionForm,
  defaultRemovalForm
) {
  const koodiArvoInteger = parseInt(koodiarvo, 10);

  const obj = R.find(
    R.compose(R.includes(koodiArvoInteger), R.prop("koodiarvot")),
    mapping
  );
  return obj
    ? obj.lomakkeet
    : {
        lisays: defaultAdditionForm,
        poisto: defaultRemovalForm
      };
}

function divideArticles(
  articles,
  relevantCodes,
  relevantMaaraykset,
  mapping,
  defaultAdditionForm,
  defaultRemovalForm,
  locale
) {
  const localeUpper = R.toUpper(locale);
  const dividedArticles = {};
  const sortedArticles = sortArticlesByHuomioitavaKoodi(articles, locale);
  R.forEach(article => {
    const { metadata } = article;
    const kasite = parseLocalizedField(metadata, localeUpper, "kasite");
    const kuvaus = parseLocalizedField(metadata, localeUpper, "kuvaus");
    const isInLupa = !!R.find(R.propEq("koodiarvo", article.koodiArvo))(
      relevantMaaraykset
    );
    if (
      // Relevant codes includes only the koodiarvot that are selected on page 1
      R.includes(article.koodiArvo, relevantCodes) &&
      (kuvaus || article.koodiArvo === "22") &&
      kasite &&
      (isInLupa || article.koodiArvo !== "15")
    ) {
      dividedArticles[kasite] = dividedArticles[kasite] || [];
      dividedArticles[kasite].push({
        article,
        lomakkeet: getCategoriesByKoodiarvo(
          article.koodiArvo,
          mapping,
          defaultAdditionForm,
          defaultRemovalForm
        )
      });
    }
  }, sortedArticles);
  return dividedArticles;
}

function getCategoryData(dividedArticles, areaCode) {
  switch (areaCode) {
    case "01":
      return {
        key: "laajennettu",
        articles: dividedArticles.laajennettu || [],
        componentName: "StatusTextRow"
      };
    case "02":
      return {
        key: "vaativatuki",
        articles: R.concat(
          dividedArticles.vaativa_1 || [],
          dividedArticles.vaativa_2 || []
        ),
        componentName: "StatusTextRow"
      };
    case "03":
      return {
        key: "sisaoppilaitos",
        articles: dividedArticles.sisaoppilaitos || [],
        componentName: "StatusTextRow"
      };
    case "04":
      return {
        key: "vankila",
        articles: dividedArticles.vankila || [],
        componentName: "StatusTextRow"
      };
    case "05":
      return {
        key: "urheilu",
        articles: dividedArticles.urheilu || [],
        componentName: "StatusTextRow"
      };
    case "06":
      return {
        key: "yhteistyo",
        articles: dividedArticles.yhteistyo || [],
        componentName: "StatusTextRow"
      };
    case "07":
      return {
        key: "muumaarays",
        articles: dividedArticles.muumaarays || [],
        componentName: "StatusTextRow"
      };
    default:
      return null;
  }
}

function getReasoningForm(
  areaCode,
  defaultAdditionForm,
  defaultRemovalForm,
  changeObjects,
  maaraykset,
  mapping,
  muut,
  isReadOnly,
  locale
) {
  const relevantCodes = R.map(R.compose(R.view(R.lensIndex(2)), R.split(".")))(
    R.map(R.prop("anchor"), R.compose(R.flatten, R.values)(changeObjects))
  );
  const relevantMaaraykset = R.filter(
    R.propEq("koodisto", "oivamuutoikeudetvelvollisuudetehdotjatehtavat")
  )(maaraykset);
  const dividedArticles = divideArticles(
    muut,
    relevantCodes,
    relevantMaaraykset,
    mapping,
    defaultAdditionForm,
    defaultRemovalForm,
    locale
  );
  const item = getCategoryData(dividedArticles, areaCode);
  return [
    {
      anchor: item.key,
      categories: R.map(({ article, lomakkeet }) => {
        const metadata = R.find(R.propEq("kieli", locale), article.metadata);
        const title = metadata.kuvaus || metadata.nimi;
        const isInLupaBool = article
          ? !!R.find(koulutusala => {
              return article.koodiArvo === koulutusala;
            }, article.voimassaAlkuPvm)
          : false;
        const anchorInit = `muut_${areaCode}.${item.key}.${article.koodiArvo}`;
        const changeObj = R.find(
          R.compose(R.startsWith(anchorInit), R.prop("anchor")),
          changeObjects
        );
        const isAddition = changeObj && changeObj.properties.isChecked;
        const perusteltavaTeksti =
          article.koodiArvo === "22" &&
          R.find(
            R.propEq("anchor", "muut_07.muumaarays.22.other.A"),
            changeObjects
          )
            ? R.find(
                R.propEq("anchor", "muut_07.muumaarays.22.other.A"),
                changeObjects
              ).properties.value
            : "";
        const isReasoningRequired =
          R.path(
            ["properties", "metadata", "isReasoningRequired"],
            changeObj
          ) !== false;
        const labelClasses = {
          isInLupa: isInLupaBool
        };
        let structure = null;
        if (isReasoningRequired) {
          structure = {
            layout: {
              indentation: "none",
              margins: { top: "large" }
            },
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
                  isReadOnly,
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
            ],
            categories: getStructureByKoodiarvo(
              perusteltavaTeksti,
              isAddition,
              isReadOnly,
              lomakkeet
            )
          };
        }
        return structure;
      }, item.articles).filter(Boolean)
    }
  ];
}

export default function getMuutPerustelulomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "reasoning":
      const defaultAdditionForm = getDefaultAdditionForm(isReadOnly);
      const defaultRemovalForm = getDefaultRemovalForm(isReadOnly);
      const mapping = getMapping(
        data.vankilat,
        isReadOnly,
        data.locale,
        defaultRemovalForm
      );
      return getReasoningForm(
        data.areaCode,
        defaultAdditionForm,
        defaultRemovalForm,
        data.changeObjectsPage1,
        data.maaraykset,
        mapping,
        data.muut,
        isReadOnly,
        R.toUpper(locale)
      );
    default:
      return [];
  }
}
