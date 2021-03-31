import { isAdded, isInLupa, isRemoved } from "css/label";
import { filter, find, flatten, hasPath, map, pathEq, propEq } from "ramda";
import { getPOErityisetKoulutustehtavatFromStorage } from "helpers/poErityisetKoulutustehtavat";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getLocalizedProperty } from "../utils";
import { createDynamicTextFields } from "../dynamic";
import { __ } from "i18n-for-browser";

export async function erityisetKoulutustehtavat(
  { maaraykset, sectionId },
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects,
  { onAddButtonClick }
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const poErityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  return flatten(
    [
      map(erityinenKoulutustehtava => {
        const tehtavaanLiittyvatMaaraykset = filter(
          m =>
            propEq("koodiarvo", erityinenKoulutustehtava.koodiarvo, m) &&
            propEq("koodisto", "poerityinenkoulutustehtava", m),
          maaraykset
        );
        const kuvausmaaraykset = filter(
          hasPath(["meta", "kuvaus"]),
          tehtavaanLiittyvatMaaraykset
        );

        return {
          anchor: erityinenKoulutustehtava.koodiarvo,
          categories: createDynamicTextFields(
            sectionId,
            kuvausmaaraykset,
            changeObjects,
            erityinenKoulutustehtava.koodiarvo,
            onAddButtonClick,
            isPreviewModeOn,
            isReadOnly,
            erityinenKoulutustehtava.koodiarvo === "1" ? 1 : 10,
            poErityisetKoulutustehtavat,
            locale
          ),
          components: [
            {
              anchor: "valintaelementti",
              name: "CheckboxWithLabel",
              properties: {
                isChecked: !!tehtavaanLiittyvatMaaraykset.length,
                isIndeterminate: false,
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  custom: Object.assign(
                    {},
                    !!tehtavaanLiittyvatMaaraykset.length ? isInLupa : {}
                  ),
                  removal: isRemoved
                },
                title: getLocalizedProperty(
                  erityinenKoulutustehtava.metadata,
                  locale,
                  "nimi"
                )
              }
            }
          ]
        };
      }, poErityisetKoulutustehtavat),
      {
        anchor: "erityiset-koulutustehtavat",
        layout: { margins: { top: "large" } },
        styleClasses: ["mt-10", "pt-10", "border-t"],
        components: [
          {
            anchor: "lisatiedot-info",
            name: "StatusTextRow",
            properties: {
              title: __("common.lisatiedotInfo")
            }
          }
        ]
      },
      lisatiedotObj
        ? {
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
        : null
    ].filter(Boolean)
  );
}
