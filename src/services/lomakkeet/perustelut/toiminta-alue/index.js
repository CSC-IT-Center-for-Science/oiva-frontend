import * as R from "ramda";
import "../../i18n-config";
import { __ } from "i18n-for-browser";

function getReasoningForm(
  isReadOnly,
  lupakohde,
  _changeObjects,
  maakuntakunnat
) {
  const mapping = {
    "FI-18": "01",
    "FI-19": "02",
    "FI-17": "04",
    "FI-06": "05",
    "FI-11": "06",
    "FI-16": "07",
    "FI-09": "08",
    "FI-02": "09",
    "FI-04": "10",
    "FI-15": "11",
    "FI-13": "12",
    "FI-03": "14",
    "FI-07": "16",
    "FI-08": "13",
    "FI-12": "15",
    "FI-14": "17",
    "FI-05": "18",
    "FI-10": "19"
  };

  function getChangeObjects(isCheckedVal) {
    return R.mapObjIndexed((changeObjects, provinceKey) => {
      const province = R.find(
        R.propEq("koodiarvo", mapping[provinceKey]),
        maakuntakunnat
      );

      const relevantChangeObjects = R.filter(
        R.pathEq(["properties", "isChecked"], isCheckedVal),
        changeObjects
      );
      if (province) {
        if (relevantChangeObjects.length - 1 === province.kunnat.length) {
          return R.filter(
            R.compose(R.not, R.includes(".kunnat."), R.prop("anchor")),
            relevantChangeObjects
          );
        } else {
          return R.filter(
            R.compose(R.includes(".kunnat."), R.prop("anchor")),
            relevantChangeObjects
          );
        }
      }
    }, byProvince);
  }

  const current = {
    maakunnat: R.map(R.prop("arvo"), lupakohde.maakunnat),
    kunnat: R.map(R.prop("arvo"), lupakohde.kunnat)
  };

  const categoryFilterChangeObj = R.find(
    R.propEq("anchor", "categoryFilter"),
    _changeObjects
  );

  const byProvince = categoryFilterChangeObj
    ? categoryFilterChangeObj.properties.changesByProvince
    : {};

  const removalsByProvince = getChangeObjects(false);
  const additionsByProvince = getChangeObjects(true);

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
                    R.map(
                      R.path(["properties", "metadata", "title"]),
                      R.flatten(R.values(removalsByProvince))
                    ).filter(Boolean)
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
                    R.map(
                      R.path(["properties", "metadata", "title"]),
                      R.flatten(R.values(additionsByProvince))
                    ).filter(Boolean)
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
            isRequired: true,
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
        data.changeObjectsPage1,
        data.maakuntakunnat
      );
    default:
      return [];
  }
}
