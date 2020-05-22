import * as R from "ramda";
import "../../i18n-config";
import { __ } from "i18n-for-browser";

function getReasoningForm(isReadOnly, lupakohde, changeObjects) {
  const current = {
    maakunnat: R.map(R.prop("arvo"), lupakohde.maakunnat),
    kunnat: R.map(R.prop("arvo"), lupakohde.kunnat)
  };

  const diff = (a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  };

  return [
    {
      anchor: "changes",
      layout: { indentation: "none", margins: { top: "none" } },
      categories: [
        {
          anchor: "current",
          layout: { indentation: "none", margins: { top: "none" } },
          title: __("current"),
          components: [
            {
              name: "StatusTextRow",
              properties: {
                title: R.join(
                  ", ",
                  R.sort(diff, R.concat(current.maakunnat, current.kunnat))
                )
              }
            }
          ]
        },
        {
          anchor: "removed",
          layout: {
            margins: { top: "none" }
          },
          title: __("toBeRemoved"),
          components: [
            {
              name: "StatusTextRow",
              properties: {
                title: R.join(
                  ", ",
                  R.sort(
                    diff,
                    R.map(changeObj => {
                      if (
                        R.equals(
                          false,
                          R.path(["properties", "isChecked"], changeObj)
                        )
                      ) {
                        return (
                          R.path(
                            ["properties", "metadata", "title"],
                            changeObj
                          ) ||
                          R.path(["properties", "metadata", "label"], changeObj)
                        );
                      }
                      return null;
                    }, changeObjects).filter(Boolean)
                  )
                )
              }
            }
          ]
        },
        {
          anchor: "added",
          layout: {
            margins: { top: "none" }
          },
          title: __("toBeAdded"),
          components: [
            {
              name: "StatusTextRow",
              properties: {
                title: R.join(
                  ", ",
                  R.sort(
                    diff,
                    R.map(changeObj => {
                      if (
                        R.equals(
                          true,
                          R.path(["properties", "isChecked"], changeObj)
                        )
                      ) {
                        return (
                          R.path(
                            ["properties", "metadata", "title"],
                            changeObj
                          ) ||
                          R.path(["properties", "metadata", "label"], changeObj)
                        );
                      }
                      return null;
                    }, changeObjects).filter(Boolean)
                  )
                )
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "reasoning",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title: "Perustelut",
            value: ""
          }
        }
      ]
    }
  ];
}

export default function getToimintaaluePerustelulomake(
  action,
  data,
  isReadOnly
) {
  switch (action) {
    case "reasoning":
      return getReasoningForm(
        isReadOnly,
        data.lupakohde,
        data.changeObjectsPage1
      );
    default:
      return [];
  }
}
