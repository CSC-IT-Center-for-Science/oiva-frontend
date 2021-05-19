import { isAdded, isInLupa, isRemoved } from "css/label";
import { find, flatten, length, map, pathEq, propEq } from "ramda";
import { __ } from "i18n-for-browser";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getLocalizedProperty } from "../utils";
import { getOikeusSisaoppilaitosmuotoiseenKoulutukseenFromStorage } from "helpers/oikeusSisaoppilaitosmuotoiseenKoulutukseen/index";

export async function getOikeusSisaoppilaitosmuotoiseenKoulutukseen(
  { maaraykset },
  { isPreviewModeOn, isReadOnly },
  locale
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const lisatiedot = await getLisatiedotFromStorage();
  const oikeudet = await getOikeusSisaoppilaitosmuotoiseenKoulutukseenFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  return flatten(
    [
      map(oikeus => {
        const maarays = find(
          m =>
            propEq("koodiarvo", oikeus.koodiarvo, m) &&
            propEq(
              "koodisto",
              "lukiooikeussisaooppilaitosmuotoiseenkoulutukseen",
              m
            ),
          maaraykset
        );
        return {
          anchor: oikeus.koodiarvo,
          categories: [
            {
              anchor: "kuvaus",
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    forChangeObject: {
                      koodiarvo: oikeus.koodiarvo
                    },
                    isPreviewModeOn,
                    isReadOnly: _isReadOnly,
                    placeholder: __("common.kuvausPlaceholder"),
                    title: __("common.kuvaus"),
                    value: getLocalizedProperty(
                      oikeus.metadata,
                      locale,
                      "kuvaus"
                    )
                  }
                }
              ],
              layout: { indentation: "none" }
            }
          ],
          components: [
            {
              anchor: "valinta",
              name: "RadioButtonWithLabel",
              properties: {
                forChangeObject: {
                  koodiarvo: oikeus.koodiarvo
                },
                isChecked: !!maarays,
                isIndeterminate: false,
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  custom: Object.assign({}, !!maarays ? isInLupa : {}),
                  removal: isRemoved
                },
                title: getLocalizedProperty(oikeus.metadata, locale, "nimi")
              }
            }
          ]
        };
      }, oikeudet),
      {
        anchor: "0",
        components: [
          {
            anchor: "valinta",
            name: "RadioButtonWithLabel",
            properties: {
              isChecked: !length(maaraykset),
              isIndeterminate: false,
              isPreviewModeOn,
              isReadOnly: _isReadOnly,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved
              },
              title: __("education.koulutuksellaEiOleSisaoppilaitosmuotoista")
            }
          }
        ]
      },
      {
        anchor: "lisatiedot",
        components: [
          {
            anchor: "info",
            name: "StatusTextRow",
            properties: {
              title: __("common.lisatiedotInfo")
            }
          }
        ],
        layout: { margins: { top: "large" } },
        styleClasses: ["mt-10", "pt-10", "border-t"]
      },
      {
        anchor: "lisatiedot",
        components: [
          {
            anchor: lisatiedotObj.koodiarvo,
            name: "TextBox",
            properties: {
              forChangeObject: {
                koodiarvo: lisatiedotObj.koodiarvo,
                koodisto: lisatiedotObj.koodisto,
                versio: lisatiedotObj.versio,
                voimassaAlkuPvm: lisatiedotObj.voimassaAlkuPvm
              },
              isPreviewModeOn,
              isReadOnly: _isReadOnly,
              title: __("common.lisatiedot"),
              value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
            }
          }
        ]
      }
    ].filter(Boolean)
  );
}
