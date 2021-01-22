import { isAdded, isRemoved } from "css/label";
import { find, flatten, map, pathEq, propEq } from "ramda";
import { __ } from "i18n-for-browser";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getOpetuksenJarjestamismuodotFromStorage } from "helpers/opetuksenJarjestamismuodot";
import { getLocalizedProperty } from "../utils";

export async function opetuksenJarjestamismuoto(
  { maaraykset },
  { isPreviewModeOn, isReadOnly },
  locale
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const lisatiedot = await getLisatiedotFromStorage();
  const opetuksenJarjestamismuodot = await getOpetuksenJarjestamismuodotFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  return flatten(
    [
      map(muoto => {
        const maarays = find(
          m =>
            propEq("koodiarvo", muoto.koodiarvo, m) &&
            propEq("koodisto", "opetuksenjarjestamismuoto", m),
          maaraykset
        );
        return {
          anchor: muoto.koodiarvo,
          categories: [
            {
              anchor: "kuvaus",
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    forChangeObject: {
                      koodiarvo: muoto.koodiarvo
                    },
                    isPreviewModeOn,
                    isReadOnly: _isReadOnly,
                    placeholder: __("common.kuvausPlaceholder"),
                    title: __("common.kuvaus"),
                    value: getLocalizedProperty(muoto.metadata, locale, "kuvaus")
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
                  koodiarvo: muoto.koodiarvo
                },
                isChecked: !!maarays,
                isIndeterminate: false,
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  removal: isRemoved
                },
                title: getLocalizedProperty(muoto.metadata, locale, "nimi")
              }
            }
          ]
        };
      }, opetuksenJarjestamismuodot),
      {
        anchor: "0",
        components: [
          {
            anchor: "valinta",
            name: "RadioButtonWithLabel",
            properties: {
              isChecked: true,
              isIndeterminate: false,
              isPreviewModeOn,
              isReadOnly: _isReadOnly,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved
              },
              title: __("education.eiSisaOppilaitosTaiKotikoulumuotoinen")
            }
          }
        ]
      },
      {
        anchor: "lisatiedot",
        layout: { margins: { top: "large" } },
        components: [
          {
            anchor: "info",
            name: "StatusTextRow",
            styleClasses: ["pt-8", "border-t"],
            properties: {
              title: __("common.lisatiedotInfo")
            }
          }
        ]
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
              placeholder: __("common.lisatiedot"),
              value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
            }
          }
        ]
      }
    ].filter(Boolean)
  );
}
