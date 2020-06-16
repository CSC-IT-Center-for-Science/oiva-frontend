import "../i18n-config";
import { __ } from "i18n-for-browser";

function getModificationForm(
  isEditViewActive,
  changeObjectsByProvince = {},
  quickFilterChanges = [],
  options = [],
  onChanges,
  kunnat,
  maakunnat,
  localizations,
  toggleEditView
) {
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
            changeObjectsByProvince,
            isEditViewActive,
            localizations,
            municipalities: kunnat,
            onChanges,
            toggleEditView,
            provinces: options,
            provincesWithoutMunicipalities: maakunnat,
            quickFilterChanges,
            showCategoryTitles: false
          }
        }
      ]
    }
  ];
}

export default function getToimintaaluelomake(action, data) {
  switch (action) {
    case "modification":
      return getModificationForm(
        data.isEditViewActive,
        data.changeObjectsByProvince,
        data.quickFilterChanges,
        data.options,
        data.onChanges,
        data.kunnat,
        data.maakunnat,
        data.localizations,
        data.toggleEditView
      );
    default:
      return [];
  }
}
