import "../i18n-config";
import * as helper from "../../../helpers/opiskelijavuodet";
import { __ as translate } from "i18n-for-browser";
import {
  find,
  head,
  includes,
  isNil,
  path,
  pathEq,
  propEq,
  reject,
  toUpper,
  map,
  length,
  difference,
  prop,
  compose
} from "ramda";
import {
  findSisaoppilaitosRajoitus,
  findVaativatukiRajoitus
} from "../../../helpers/opiskelijavuodet";
import { getMaarayksetByTunniste } from "helpers/lupa";
import { getMuutFromStorage } from "helpers/muut";
import { generateDifferenceComponent } from "../perustelut/muut";
import { getMuutostarveCheckboxes } from "../perustelut/common";
import { getOivaPerustelutFromStorage } from "helpers/oivaperustelut";

export const getValitutKoodiarvot = (stateObjects = []) => {
  return map(stateObj => {
    const isChecked = pathEq(["properties", "isChecked"], true, stateObj);
    return isChecked
      ? path(["properties", "forChangeObject", "koodiarvo"], stateObj)
      : false;
  }, stateObjects).filter(Boolean);
};

const getCurrentApplyForValue = (initialValue, changeObjects, anchor) => {
  const changeObj = find(propEq("anchor", anchor), changeObjects);

  return changeObj
    ? path(["properties", "applyForValue"], changeObj)
    : initialValue;
};

/**
 * Mikäli jokin näistä koodeista on valittuna osion 5 (Muut) kohdassa 03
 * (sisäoppilaitos), näytetään sisäoppilaitosta koskevat kentät tässä osiossa
 * (Opiskelijavuodet).
 **/
export const sisaoppilaitosCodes = ["4"];

/**
 * Mikäli jokin näistä koodeista on valittuna osion 5 (Muut) kohdassa 02
 * (vaativa tuki), näytetään vaativaa tukea koskevat kentät tässä osiossa
 * (Opiskelijavuodet).
 **/
export const vaativatCodes = ["2", "16", "17", "18", "19", "20", "21"];

const radioButtonKoodiarvotVaativaTuki = [
  "2",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21"
];

async function getModificationForm(
  { muutLomakedata, sectionId },
  { isReadOnly },
  locale,
  changeObjects
) {
  // Mikäli Muut-osion lomakkeelta 02 (vaativa tuki) on valittu jokin
  // listatuista koodiarvoista, on vaativaa tukea koskeva tietue näytettävä
  // opiskelijavuosiosiossa.
  const amountOfUnselectedVaativaTukiRadioButtons = length(
    difference(vaativatCodes, getValitutKoodiarvot(prop("02", muutLomakedata)))
  );

  const amountOfUnselectedSisaoppilaitosCheckboxes = length(
    difference(
      sisaoppilaitosCodes,
      getValitutKoodiarvot(prop("03", muutLomakedata))
    )
  );

  const visibility = {
    // Mikäli Muut-osion lomakkeelta 03 (sisäoppilaitos) on valittu mitä
    // tahansa, on sisäoppilaitosta koskeva tietue näytettävä
    // opiskelijavuosiosiossa.
    sisaoppilaitos:
      amountOfUnselectedSisaoppilaitosCheckboxes < length(sisaoppilaitosCodes),
    vaativaTuki:
      amountOfUnselectedVaativaTukiRadioButtons < length(vaativatCodes)
  };

  const titles = [
    translate("current"),
    translate("applyFor"),
    translate("difference")
  ];

  const titlesSisaoppilaitosAndVaativa = [
    translate("current"),
    translate("applyForVaativaAndSisaoppilaitos"),
    translate("difference")
  ];

  const currentDate = new Date();

  const maaraykset = await getMaarayksetByTunniste("opiskelijavuodet");
  const muutMaaraykset = await getMaarayksetByTunniste("muut");
  const muut = await getMuutFromStorage();

  /**
   * SISÄOPPILAITOSTIETUEEN NÄYTTÄMISEN MÄÄRITTÄMINEN
   *
   * Etsitään sisäoppilaitosvalintaa koskevat yleiset tiedot.
   **/
  const sisaoppilaitos = find(
    pathEq(["metadata", toUpper(locale), "kasite"], "sisaoppilaitos"),
    muut
  );

  // Etsitään sisäoppilaitosvalintaa koskeva voimassa oleva määräys.
  const sisaoppilaitosmaarays = find(maarays => {
    return (
      maarays.koodiarvo === sisaoppilaitos.koodiarvo &&
      new Date(maarays.koodi.voimassaAlkuPvm) < currentDate
    );
  }, muutMaaraykset);

  const opiskelijavuosimaaraysSisaoppilaitos = sisaoppilaitosmaarays
    ? find(propEq("koodiarvo", sisaoppilaitosmaarays.koodiarvo), maaraykset)
    : null;

  const applyForValueSisaoppilaitos = opiskelijavuosimaaraysSisaoppilaitos
    ? parseInt(opiskelijavuosimaaraysSisaoppilaitos.arvo, 10)
    : undefined;

  const currentSisaoppilaitosApplyForValue = getCurrentApplyForValue(
    applyForValueSisaoppilaitos,
    changeObjects,
    `${sectionId}.sisaoppilaitos.A`
  );

  /**
   * VAATIVAA ERITYISTUKEA KOSKEVAN TIETUEEN NÄYTTÄMISEN MÄÄRITTÄMINEN
   *
   * Etsitään vaativaa erityistä tukea koskevat yleiset tiedot radio button-
   * valintojen eli käsitteen vaativa_1 osalta. Koodiarvo 23 tarkoittaa,
   * että koulutuksen järjestäjällä ei ole velvollisuutta järjestää koulutusta.
   * Se jätetään muutoksia tarkasteltaessa huomioimatta.
   **/
  // Etsitään vaativaa erityistä tukea koskevat ja voimassa olevat määräykset.
  const vaativaTukiMaarays = find(maarays => {
    return (
      includes(maarays.koodiarvo, helper.vaativatCodes) &&
      new Date(maarays.koodi.voimassaAlkuPvm) < currentDate
    );
  }, muutMaaraykset);

  const opiskelijavuosimaaraysVaativaTuki = vaativaTukiMaarays
    ? find(propEq("koodiarvo", vaativaTukiMaarays.koodiarvo), maaraykset)
    : null;

  const applyForValueVaativaTuki = opiskelijavuosimaaraysVaativaTuki
    ? parseInt(opiskelijavuosimaaraysVaativaTuki.arvo, 10)
    : undefined;

  const currentVaativaTukiApplyForValue = getCurrentApplyForValue(
    applyForValueVaativaTuki,
    changeObjects,
    `${sectionId}.vaativatuki.A`
  );

  /**
   * VÄHIMMÄISOPISKELIJAVUODET
   */
  const vahimmaisopiskelijavuodetMaarays = find(
    propEq("koodisto", "koulutussektori"),
    maaraykset
  );

  const isSisaoppilaitosApplyForValueValid =
    !visibility.sisaoppilaitos || !isNil(currentSisaoppilaitosApplyForValue);

  const isVaativaTukiApplyForValueValid =
    !visibility.vaativaTuki || !isNil(currentVaativaTukiApplyForValue);

  return {
    isValid:
      isSisaoppilaitosApplyForValueValid && isVaativaTukiApplyForValueValid,
    structure: [
      {
        anchor: "vahimmaisopiskelijavuodet",
        title: translate("minimumAmountOfYears"),
        components: [
          {
            anchor: "A",
            name: "Difference",
            properties: {
              forChangeObject: reject(isNil, {
                koodiarvo: helper.vahimmaisopiskelijamaaraKoodiarvo,
                maaraysUuid: (vahimmaisopiskelijavuodetMaarays || {}).uuid
              }),
              applyForValue: vahimmaisopiskelijavuodetMaarays
                ? parseInt(vahimmaisopiskelijavuodetMaarays.arvo, 10)
                : undefined,
              initialValue: vahimmaisopiskelijavuodetMaarays
                ? parseInt(vahimmaisopiskelijavuodetMaarays.arvo, 10)
                : 0,
              isReadOnly,
              name: `${sectionId}-difference-1`,
              titles
            }
          }
        ]
      },
      visibility.vaativaTuki
        ? {
            anchor: "vaativatuki",
            title: translate("limitForSpecialSupport"),
            components: [
              {
                anchor: "A",
                name: "Difference",
                properties: {
                  forChangeObject: reject(isNil, {
                    koodiarvo: head(
                      map(stateObj => {
                        const koodiarvo = path(
                          ["properties", "forChangeObject", "koodiarvo"],
                          stateObj
                        );
                        const isInKoodiarvot = includes(
                          koodiarvo,
                          radioButtonKoodiarvotVaativaTuki
                        );
                        return isInKoodiarvot &&
                          pathEq(["properties", "isChecked"], true, stateObj)
                          ? koodiarvo
                          : false;
                      }, prop("02", muutLomakedata) || []).filter(Boolean)
                    ),
                    maaraysUuid: (findVaativatukiRajoitus(maaraykset) || {})
                      .uuid
                  }),
                  isReadOnly,
                  isRequired: true,
                  applyForValueVaativaTuki,
                  initialValue: opiskelijavuosimaaraysVaativaTuki
                    ? parseInt(opiskelijavuosimaaraysVaativaTuki.arvo, 10)
                    : 0,
                  name: `${sectionId}-difference-2`,
                  titles: titlesSisaoppilaitosAndVaativa
                }
              }
            ]
          }
        : null,
      visibility.sisaoppilaitos
        ? {
            anchor: "sisaoppilaitos",
            title: translate("limitForBoardingSchool"),
            components: [
              {
                anchor: "A",
                name: "Difference",
                properties: {
                  forChangeObject: reject(isNil, {
                    koodiarvo: helper.sisaoppilaitosOpiskelijamaaraKoodiarvo,
                    maaraysUuid: (findSisaoppilaitosRajoitus(maaraykset) || {})
                      .uuid
                  }),
                  isReadOnly,
                  isRequired: true,
                  applyForValueSisaoppilaitos,
                  initialValue: opiskelijavuosimaaraysSisaoppilaitos
                    ? parseInt(opiskelijavuosimaaraysSisaoppilaitos.arvo, 10)
                    : 0,
                  name: `${sectionId}-difference-3`,
                  titles: titlesSisaoppilaitosAndVaativa
                }
              }
            ]
          }
        : null
    ].filter(Boolean)
  };
}

async function getReasoningForm({ isReadOnly }, locale, changeObjects) {
  const oivaperustelut = await getOivaPerustelutFromStorage();

  const vahimmaisopiskelijavuodetChangeObj = find(
    compose(includes(`.vahimmaisopiskelijavuodet.`), prop("anchor")),
    changeObjects
  );
  const sisaoppilaitosChangeObj = find(
    compose(includes(`.sisaoppilaitos.`), prop("anchor")),
    changeObjects
  );
  const vaativaTukiChangeObj = find(
    compose(includes(`.vaativatuki.`), prop("anchor")),
    changeObjects
  );
  const checkboxes = getMuutostarveCheckboxes(
    oivaperustelut,
    toUpper(locale),
    isReadOnly
  );

  const differenceTitles = [
    translate("common.current"),
    translate("common.applyFor"),
    translate("common.difference")
  ];

  return [
    {
      anchor: "vahimmaisopiskelijavuodet",
      title: translate("minimumAmountOfYears"),
      components: [
        generateDifferenceComponent({
          vahimmaisopiskelijavuodetChangeObj,
          titles: differenceTitles,
          isReadOnly: true
        })
      ]
    },
    {
      anchor: "perustelut",
      title: "Mikä on aiheuttanut muutostarpeen?",
      categories: checkboxes
    },
    {
      anchor: "vaativatuki",
      title: translate("limitForSpecialSupport"),
      components: [
        generateDifferenceComponent({
          vaativaTukiChangeObj,
          titles: differenceTitles,
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
          anchor: "vaativatuki",
          name: "TextBox",
          properties: {
            isReadOnly,
            title: "Perustele lyhyesti miksi tälle muutokselle on tarvetta",
            value: ""
          }
        }
      ]
    },
    {
      anchor: "sisaoppilaitos",
      title: translate("limitForBoardingSchool"),
      components: [
        generateDifferenceComponent({
          sisaoppilaitosChangeObj,
          titles: differenceTitles,
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
          anchor: "sisaoppilaitos",
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

export default async function getOpiskelijavuodetLomake(
  mode,
  data,
  booleans,
  locale,
  changeObjects,
  functions,
  prefix
) {
  switch (mode) {
    case "modification":
      return await getModificationForm(data, booleans, locale, changeObjects);
    case "reasoning":
      return await getReasoningForm(booleans, locale, changeObjects, prefix);
    default:
      return [];
  }
}
