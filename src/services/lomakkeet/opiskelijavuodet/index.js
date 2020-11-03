import "../i18n-config";
import * as helper from "../../../helpers/opiskelijavuodet";
import { __ } from "i18n-for-browser";
import {
  values,
  flatten,
  find,
  toUpper,
  pathEq,
  path,
  prop,
  includes,
  propEq,
  head,
  isNil,
  reject
} from "ramda";
import {
  findSisaoppilaitosRajoitus,
  findVaativatukiRajoitus
} from "../../../helpers/opiskelijavuodet";
import { getMaarayksetByTunniste } from "helpers/lupa";
import { getMuutFromStorage } from "helpers/muut";

async function getModificationForm(
  locale,
  visibility = {},
  isSisaoppilaitosValueRequired,
  isVaativaTukiValueRequired,
  muutChanges = [],
  sectionId
) {
  const titles = [__("current"), __("applyFor"), __("difference")];
  const titlesSisaoppilaitosAndVaativa = [
    __("current"),
    __("applyForVaativaAndSisaoppilaitos"),
    __("difference")
  ];
  const currentDate = new Date();
  const muutChangesFlatten = flatten(values(head(muutChanges)));

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

  /**
   * Muodostetaan boolean-tyyppinen muuttuja sille, pitääkö sisäoppilaitosta
   * koskeva tietue näyttää lomakkeella. Jos sisäoppilaitosta koskeva määräys
   * on olemassa ja sitä ei olla kumoamassa tai jos määräystä ollaan
   * lisäämässä, näytetään sisäoppilaitoksen tietue käyttäjälle, jotta hän
   * voi täyttää sen tiedot.
   **/

  // const isSisaoppilaitosVisible = helper.isSisaoppilaitosRajoitusVisible(
  //   muutMaaraykset,
  //   muutChangesFlatten
  // );

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

  // Etsitään sisäoppilaitosvalintaan kohdistunut muutos.
  const vaativaTukiChangeObj = find(changeObj => {
    const { key, koodiarvo } = changeObj.properties.metadata;
    return key === "vaativatuki" && includes(koodiarvo, helper.vaativatCodes);
  }, muutChangesFlatten);

  /**
   * Muodostetaan boolean-tyyppinen muuttuja sille, pitääkö sisäoppilaitosta
   * koskeva tietue näyttää lomakkeella. Jos sisäoppilaitosta koskeva määräys
   * on olemassa ja sitä ei olla kumoamassa tai jos määräystä ollaan
   * lisäämässä, näytetään sisäoppilaitoksen tietue käyttäjälle, jotta hän
   * voi täyttää sen tiedot.
   **/
  // const isVaativaTukiVisible = helper.isVaativatukiRajoitusVisible(
  //   muutMaaraykset,
  //   muutChangesFlatten
  // );

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
      title: __("minimumAmountOfYears"),
      components: [
        {
          anchor: "A",
          name: "Difference",
          properties: {
            forChangeObject: reject(isNil, {
              koodiarvo: helper.vahimmaisopiskelijamaaraKoodiarvo,
              maaraysUuid: (vahimmaisopiskelijavuodetMaarays || {}).uuid
            }),
            initialValue: vahimmaisopiskelijavuodetMaarays
              ? parseInt(vahimmaisopiskelijavuodetMaarays.arvo, 10)
              : 0,
            applyForValue: vahimmaisopiskelijavuodetMaarays
              ? parseInt(vahimmaisopiskelijavuodetMaarays.arvo, 10)
              : undefined,
            name: `${sectionId}-difference-1`,
            titles
          }
        }
      ]
    },
    visibility.vaativaTuki === true
      ? {
          anchor: "vaativatuki",
          title: __("limitForSpecialSupport"),
          components: [
            {
              anchor: "A",
              name: "Difference",
              properties: {
                forChangeObject: reject(isNil, {
                  koodiarvo:
                    prop("koodiarvo", vaativaTukiMaarays) ||
                    path(
                      ["properties", "metadata", "koodiarvo"],
                      vaativaTukiChangeObj
                    ),
                  maaraysUuid: (findVaativatukiRajoitus(maaraykset) || {}).uuid
                }),
                isRequired: isVaativaTukiValueRequired,
                initialValue: opiskelijavuosimaaraysVaativaTuki
                  ? parseInt(opiskelijavuosimaaraysVaativaTuki.arvo, 10)
                  : 0,
                applyForValue: opiskelijavuosimaaraysVaativaTuki
                  ? parseInt(opiskelijavuosimaaraysVaativaTuki.arvo, 10)
                  : undefined,
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
          title: __("limitForBoardingSchool"),
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
                isRequired: isSisaoppilaitosValueRequired,
                initialValue: opiskelijavuosimaaraysSisaoppilaitos
                  ? parseInt(opiskelijavuosimaaraysSisaoppilaitos.arvo, 10)
                  : 0,
                applyForValue: opiskelijavuosimaaraysSisaoppilaitos
                  ? parseInt(opiskelijavuosimaaraysSisaoppilaitos.arvo, 10)
                  : undefined,
                name: `${sectionId}-difference-3`,
                titles: titlesSisaoppilaitosAndVaativa
              }
            }
          ]
        }
      : null
  ].filter(Boolean);
}

export default async function getOpiskelijavuodetLomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "modification":
      return await getModificationForm(
        locale,
        data.visibility,
        data.isSisaoppilaitosValueRequired,
        data.isVaativaTukiValueRequired,
        data.muutChanges,
        data.sectionId
      );
    default:
      return [];
  }
}
