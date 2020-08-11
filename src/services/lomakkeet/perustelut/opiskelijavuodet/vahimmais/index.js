import { getMuutostarveCheckboxes } from "../../common";
import { generateDifferenceComponent } from "../../muut";
import { toUpper } from "ramda";

function getReasoningForm(
  changeObject,
  oivaperustelut,
  differenceComponentTitles,
  isReadOnly = false,
  locale
) {
  const checkboxes = getMuutostarveCheckboxes(
    oivaperustelut,
    toUpper(locale),
    isReadOnly
  );

  return [
    {
      anchor: "vahimmaisopiskelijavuodet",
      title: "Haettava määrä",
      components: [
        generateDifferenceComponent({
          changeObject,
          titles: differenceComponentTitles,
          isReadOnly: true
        })
      ]
    },
    {
      anchor: "perustelut",
      title: "Mikä on aiheuttanut muutostarpeen?",
      categories: checkboxes
    }
  ];
}

export default function getVahimmaisopiskelijavuodetPerustelulomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "reasoning":
      return getReasoningForm(
        data.changeObject,
        data.oivaperustelut,
        data.differenceTitles,
        isReadOnly,
        locale
      );
    default:
      return [];
  }
}
