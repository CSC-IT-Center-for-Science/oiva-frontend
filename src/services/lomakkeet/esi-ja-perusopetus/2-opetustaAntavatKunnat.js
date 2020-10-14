import {__} from "i18n-for-browser";

export const opetustaAntavatKunnat = (data, isReadOnly, locale) => {
    return [
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
        anchor: "maakunnatjakunnat",
        layout: { margins: { top: "large" } },
        components: [
          {
            anchor: "lisatiedot-info",
            name: "StatusTextRow",
            styleClasses: ["pt-8 border-t"],
            properties: {
              title:
                __("common.lisatiedotInfo")
            }
          }
        ]
      },
      {
        anchor: "maakunnatjakunnat",
        components: [
          {
            anchor: "lisatiedot",
            name: "TextBox",
            properties: {
              placeholder: __("common.lisatiedot")
            }
          }
        ]
      }
    ];
  }