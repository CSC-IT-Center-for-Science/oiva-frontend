import "../i18n-config";
import { __ } from "i18n-for-browser";

function getModificationForm(
  isEditViewActive,
  changeObjectsByProvince = {},
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
            onChanges: payload => {
              onChanges(payload);
            },
            toggleEditView,
            provinces: options,
            provincesWithoutMunicipalities: maakunnat,
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
