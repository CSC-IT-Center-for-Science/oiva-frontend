import { isAdded, isInLupa, isRemoved } from "css/label";
import { filter, find, flatten, map, pathEq, propEq } from "ramda";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getLocalizedProperty } from "../utils";
import localforage from "localforage";
import { createDynamicTextFields } from "../dynamic";
import { __ } from "i18n-for-browser";

export async function muutEhdot(
  { maaraykset, sectionId },
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects,
  { onAddButtonClick }
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const muutEhdot = await localforage.getItem(
    "lukioMuutKoulutuksenJarjestamiseenLiittyvatEhdot"
  );
  const lisatiedot = await getLisatiedotFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  const lomakerakenne = flatten([
    map(ehto => {
      const ehtoonLiittyvatMaaraykset = filter(
        m =>
          propEq("koodiarvo", ehto.koodiarvo, m) &&
          propEq(
            "koodisto",
            "lukiomuutkoulutuksenjarjestamiseenliittyvatehdot",
            m
          ),
        maaraykset
      );

      return {
        anchor: ehto.koodiarvo,
        components: [
          {
            anchor: "valintaelementti",
            name: "CheckboxWithLabel",
            properties: {
              isPreviewModeOn,
              isReadOnly: _isReadOnly,
              title: getLocalizedProperty(ehto.metadata, locale, "nimi"),
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object.assign(
                  {},
                  !!ehtoonLiittyvatMaaraykset.length ? isInLupa : {}
                )
              },
              isChecked: !!ehtoonLiittyvatMaaraykset.length,
              isIndeterminate: false
            }
          }
        ],
        categories: createDynamicTextFields(
          sectionId,
          ehtoonLiittyvatMaaraykset,
          changeObjects,
          ehto.koodiarvo,
          onAddButtonClick,
          isPreviewModeOn,
          isReadOnly,
          ehto.koodiarvo === "99" ? 10 : 1,
          muutEhdot,
          locale
        )
      };
    }, muutEhdot),
    lisatiedotObj
      ? [
          {
            anchor: "lisatiedotTitle",
            layout: { margins: { top: "large" } },
            components: [
              {
                anchor: lisatiedotObj.koodiarvo,
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
                  title: __("common.lisatiedot"),
                  value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
                }
              }
            ]
          }
        ].filter(Boolean)
      : null
  ]).filter(Boolean);

  return lomakerakenne;
}
