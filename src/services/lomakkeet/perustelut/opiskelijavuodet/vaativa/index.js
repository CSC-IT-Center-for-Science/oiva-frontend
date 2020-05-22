import { generateDifferenceComponent } from "../../muut";

function getReasoningForm(
  changeObject,
  differenceComponentTitles,
  isReadOnly = false
) {
  return [
    {
      anchor: "vaativatuki",
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
      styleClasses: ["px-10 py-10"],
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title: "Perustele lyhyesti miksi tälle muutokselle on tarvetta",
            value: ""
          }
        }
      ]
    }
  ];
}

export default function getVaativaTukiOpiskelijavuodetPerustelulomake(
  action,
  data,
  isReadOnly
) {
  switch (action) {
    case "reasoning":
      return getReasoningForm(
        data.changeObject,
        data.differenceTitles,
        isReadOnly
      );
    default:
      return [];
  }
}
