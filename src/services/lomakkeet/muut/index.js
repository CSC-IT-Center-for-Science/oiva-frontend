import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import "../i18n-config";
import { __ } from "i18n-for-browser";
import * as R from "ramda";
import _ from "lodash";
import { sortArticlesByHuomioitavaKoodi } from "../utils";
import { scrollToOpiskelijavuodet } from "./utils";

function getModificationForm(configObj, osiota5koskevatMaaraykset, locale) {
  return R.map(item => {
    let noItemsInLupa = true;
    const isVaativatukiRadios =
      configObj.key === "vaativatuki" &&
      item.componentName === "RadioButtonWithLabel";
    const sortedArticles = sortArticlesByHuomioitavaKoodi(
      item.articles,
      locale
    );
    return {
      anchor: configObj.key,
      title: item.title,
      categories: R.addIndex(R.map)((article, index) => {
        const title =
          _.find(article.metadata, m => {
            return m.kieli === locale;
          }).kuvaus || "Muu";
        const maarays = R.find(R.propEq("koodiarvo", article.koodiArvo))(
          osiota5koskevatMaaraykset
        );
        const isInLupaBool = !!maarays;
        if (isInLupaBool) {
          noItemsInLupa = false;
        }
        const labelClasses = {
          isInLupa: isInLupaBool
        };
        let result = {
          anchor: article.koodiArvo,
          components: [
            {
              anchor: "A",
              name: item.componentName,
              properties: {
                // This is for the Perustelut page and for showing or not showing a form for reasoning.
                forChangeObject: {
                  isReasoningRequired:
                    !isVaativatukiRadios || index !== sortedArticles.length - 1,
                  key: configObj.key,
                  code: configObj.code,
                  title: configObj.title,
                  isInLupa: isInLupaBool,
                  koodiarvo: article.koodiArvo,
                  koodisto: article.koodisto,
                  maaraysUuid: maarays ? maarays.uuid : null
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

        if (article.showAlert) {
          result.categories = [
            {
              anchor: "notification",
              components: [
                {
                  anchor: "A",
                  name: "Alert",
                  properties: {
                    id: `${article.koodiArvo}-notification`,
                    ariaLabel: "Notification",
                    message: __("info.osion.4.tayttamisesta"),
                    linkText: __("ilmoita.opiskelijavuosimaara"),
                    handleLinkClick: () => {
                      scrollToOpiskelijavuodet();
                    }
                  }
                }
              ]
            }
          ];
        }

        if (article.koodiArvo === "22") {
          result.categories = [
            {
              anchor: "other",
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    forChangeObject: {
                      key: configObj.key,
                      code: configObj.code,
                      title: configObj.title,
                      isInLupa: isInLupaBool,
                      koodiarvo: article.koodiArvo,
                      koodisto: article.koodisto
                    },
                    placeholder: __("other.placeholder")
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
}

export default function getMuutLomake(action, data, isReadOnly, locale) {
  switch (action) {
    case "modification":
      return getModificationForm(
        data.configObj,
        data.osiota5koskevatMaaraykset,
        R.toUpper(locale)
      );
    default:
      return [];
  }
}
