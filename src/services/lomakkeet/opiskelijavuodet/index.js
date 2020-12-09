import "../i18n-config";
import * as helper from "../../../helpers/opiskelijavuodet";
import { __ as translate } from "i18n-for-browser";
import {
  __,
  filter,
  find,
  head,
  includes,
  isNil,
  path,
  pathEq,
  propEq,
  reject,
  toUpper
} from "ramda";
import {
  findSisaoppilaitosRajoitus,
  findVaativatukiRajoitus
} from "../../../helpers/opiskelijavuodet";
import { getMaarayksetByTunniste } from "helpers/lupa";
import { getMuutFromStorage } from "helpers/muut";

const radioButtonKoodiarvotVaativaTuki = [
  "2",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21"
];

export default async function getOpiskelijavuodetLomake(
  { lomakedata, muutLomakedata },
  { isReadOnly },
  locale
) {
  const {
    visibility = {},
    isSisaoppilaitosValueRequired,
    isVaativaTukiValueRequired,
    sectionId
  } = lomakedata;

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

  /**
   * VÄHIMMÄISOPISKELIJAVUODET
   */
  const vahimmaisopiskelijavuodetMaarays = find(
    propEq("koodisto", "koulutussektori"),
    maaraykset
  );

  return [
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
    visibility.vaativaTuki === true
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
                    filter(
                      includes(
                        __,
                        path(["02", "valitutKoodiarvot"], muutLomakedata) || []
                      ),
                      radioButtonKoodiarvotVaativaTuki
                    )
                  ),
                  maaraysUuid: (findVaativatukiRajoitus(maaraykset) || {}).uuid
                }),
                isReadOnly,
                isRequired: isVaativaTukiValueRequired,
                applyForValue: opiskelijavuosimaaraysVaativaTuki
                  ? parseInt(opiskelijavuosimaaraysVaativaTuki.arvo, 10)
                  : undefined,
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
    visibility.sisaoppilaitos === true
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
                isRequired: isSisaoppilaitosValueRequired,
                applyForValue: opiskelijavuosimaaraysSisaoppilaitos
                  ? parseInt(opiskelijavuosimaaraysSisaoppilaitos.arvo, 10)
                  : undefined,
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
  ].filter(Boolean);
}
