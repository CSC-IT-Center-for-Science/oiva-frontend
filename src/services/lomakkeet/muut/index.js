import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import "../i18n-config";
import { __ } from "i18n-for-browser";
import * as R from "ramda";
import _ from "lodash";
import { sortArticlesByHuomioitavaKoodi } from "../utils";
import { scrollToOpiskelijavuodet } from "./utils";

async function getModificationForm(
  configObj,
  opiskelijavuodetChangeObjects,
  osiota5koskevatMaaraykset,
  locale
) {
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
        const maarays = R.find(R.propEq("koodiarvo", article.koodiarvo))(
          osiota5koskevatMaaraykset
        );
        const isInLupaBool = !!maarays;
        if (isInLupaBool) {
          noItemsInLupa = false;
        }
        const labelClasses = {
          isInLupa: isInLupaBool
        };
        const section4changeObj = R.find(
          R.pathEq(["properties", "metadata", "koodiarvo"], article.koodiarvo),
          opiskelijavuodetChangeObjects
        );
        const showAlertBecauseOfSection4 =
          !section4changeObj ||
          !section4changeObj.properties.applyForValue.length;
        let result = {
          anchor: article.koodiarvo,
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
                  koodiarvo: article.koodiarvo,
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
        if (article.showAlertBecauseOfSection5 && showAlertBecauseOfSection4) {
          result.categories = [
            {
              anchor: "notification",
              components: [
                {
                  anchor: "A",
                  name: "Alert",
                  properties: {
                    id: `${article.koodiarvo}-notification`,
                    ariaLabel: "Notification",
                    message: __("info.osion.4.tayttamisesta"),
                    linkText: __("ilmoita.opiskelijavuosimaara"),
                    handleLinkClick: scrollToOpiskelijavuodet
                  }
                }
              ]
            }
          ];
        }

        if (article.koodiarvo === "22") {
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
                      koodiarvo: article.koodiarvo,
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

export default async function getMuutLomake(action, data, isReadOnly, locale) {
  switch (action) {
    case "modification":
      return await getModificationForm(
        data.configObj,
        data.opiskelijavuodetChangeObjects,
        data.osiota5koskevatMaaraykset,
        R.toUpper(locale)
      );
    default:
      return [];
  }
}
