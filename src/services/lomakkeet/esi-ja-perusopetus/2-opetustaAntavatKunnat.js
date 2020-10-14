import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import { find, flatten, pathEq, toUpper } from "ramda";

export const opetustaAntavatKunnat = (data, isReadOnly, locale) => {
  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    data.lisatiedot
  );

  return flatten(
    [
      {
        anchor: "valintakentta",
        components: [
          {
            anchor: "maakunnatjakunnat",
            name: "CategoryFilter",
            styleClasses: ["mt-4"],
            properties: {
              anchor: "areaofaction",
              changeObjectsByProvince: data.changeObjectsByProvince,
              isEditViewActive: data.isEditViewActive,
              localizations: data.localizations,
              municipalities: data.kunnat,
              onChanges: data.onChanges,
              toggleEditView: data.toggleEditView,
              provinces: data.options,
              provincesWithoutMunicipalities: data.maakunnat,
              quickFilterChanges: data.quickFilterChanges,
              showCategoryTitles: false
            }
          }
        ]
      },
      {
        anchor: "suomenulkopuolinenopetus",
        components: [
          {
            anchor: "jarjestaminen",
            name: "CheckboxWithLabel",
            properties: {
              title: __("education.opetustaSuomenUlkopuolella"),
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object.assign({}, !!false ? isInLupa : {}) // TODO: määritä oikea arvo
              },
              isChecked: false,
              isIndeterminate: false
            },
            styleClasses: "mt-8"
          }
        ],
        categories: [
          {
            anchor: "sijainti",
            components: [
              {
                anchor: "maajapaikkakunta",
                name: "TextBox",
                properties: {
                  placeholder: __("common.maaJaPaikkakunta"),
                  title: __("common.maaJaPaikkakunta")
                }
              }
            ]
          }
        ]
      },
      lisatiedotObj
        ? [
            {
              anchor: "lisatiedotTitle",
              layout: { margins: { top: "large" } },
              components: [
                {
                  anchor: lisatiedotObj.koodiarvo,
                  name: "StatusTextRow",
                  styleClasses: ["pt-8 border-t"],
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
                    placeholder: (lisatiedotObj.metadata[toUpper(locale)] || {})
                      .nimi
                  }
                }
              ]
            }
          ]
        : null
    ].filter(Boolean)
  );
};
