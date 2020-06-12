import "../i18n-config";
import { __ } from "i18n-for-browser";
import { path } from "ramda";

function getModificationForm(
  applyFor,
  applyForSisaoppilaitos,
  applyForVaativa,
  initialValue,
  initialValueSisaoppilaitos,
  initialValueVaativa,
  isSisaoppilaitosVisible,
  isVaativaTukiVisible,
  isSisaoppilaitosValueRequired,
  isVaativaTukiValueRequired,
  koodiarvot,
  sectionId
) {
  const titles = [__("current"), __("applyFor"), __("difference")];
  const titlesSisaoppilaitosAndVaativa = [
    __("current"),
    __("applyForVaativaAndSisaoppilaitos"),
    __("difference")
  ];
  return [
    {
      anchor: "vahimmaisopiskelijavuodet",
      title: __("minimumAmountOfYears"),
      components: [
        {
          anchor: "A",
          name: "Difference",
          properties: {
            forChangeObject: {
              koodiarvo: path(["vahimmaisopiskelijavuodet", "koodiarvo"], koodiarvot),
              maaraysUuid: path(["vahimmaisopiskelijavuodet", "maaraysUuid"], koodiarvot)
            },
            initialValue: initialValue,
            applyForValue: applyFor,
            name: `${sectionId}-difference-1`,
            titles
          }
        }
      ]
    },
    isVaativaTukiVisible
      ? {
          anchor: "vaativatuki",
          title: __("limitForSpecialSupport"),
          components: [
            {
              anchor: "A",
              name: "Difference",
              properties: {
                forChangeObject: {
                  koodiarvo: path(["vaativatuki", "koodiarvo"], koodiarvot),
                  maaraysUuid: path(["vaativatuki", "maaraysUuid"], koodiarvot)
                },
                isRequired: isVaativaTukiValueRequired,
                initialValue: initialValueVaativa,
                applyForValue: applyForVaativa,
                name: `${sectionId}-difference-2`,
                titles: titlesSisaoppilaitosAndVaativa
              }
            }
          ]
        }
      : null,
    isSisaoppilaitosVisible
      ? {
          anchor: "sisaoppilaitos",
          title: __("limitForBoardingSchool"),
          components: [
            {
              anchor: "A",
              name: "Difference",
              properties: {
                forChangeObject: {
                  koodiarvo: path(["sisaoppilaitos", "koodiarvo"], koodiarvot),
                  maaraysUuid: path(["sisaoppilaitos", "maaraysUuid"], koodiarvot)
                },
                isRequired: isSisaoppilaitosValueRequired,
                initialValue: initialValueSisaoppilaitos,
                applyForValue: applyForSisaoppilaitos,
                name: `${sectionId}-difference-3`,
                titles: titlesSisaoppilaitosAndVaativa
              }
            }
          ]
        }
      : null
  ].filter(Boolean);
}

export default function getOpiskelijavuodetLomake(action, data) {
  switch (action) {
    case "modification":
      return getModificationForm(
        data.applyFor,
        data.applyForSisaoppilaitos,
        data.applyForVaativa,
        data.initialValue,
        data.initialValueSisaoppilaitos,
        data.initialValueVaativa,
        data.isSisaoppilaitosVisible,
        data.isVaativaTukiVisible,
        data.isSisaoppilaitosValueRequired,
        data.isVaativaTukiValueRequired,
        data.koodiarvot,
        data.sectionId
      );
    default:
      return [];
  }
}
