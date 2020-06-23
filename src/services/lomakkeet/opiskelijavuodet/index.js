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
  propEq
} from "ramda";
import {
  findSisaoppilaitosRajoitus,
  findVaativatukiRajoitus
} from "../../../helpers/opiskelijavuodet";

function getModificationForm(
  locale,
  isSisaoppilaitosValueRequired,
  isVaativaTukiValueRequired,
  maaraykset,
  muut,
  muutChanges,
  muutMaaraykset,
  sectionId
) {
  const titles = [__("current"), __("applyFor"), __("difference")];
  const titlesSisaoppilaitosAndVaativa = [
    __("current"),
    __("applyForVaativaAndSisaoppilaitos"),
    __("difference")
  ];
  const currentDate = new Date();
  const muutChangesFlatten = flatten(values(muutChanges));

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
  const isSisaoppilaitosVisible = helper.isSisaoppilaitosRajoitusVisible(
    muutMaaraykset,
    muutChangesFlatten
  );

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
  const isVaativaTukiVisible = helper.isVaativatukiRajoitusVisible(
    muutMaaraykset,
    muutChangesFlatten
  );

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
            forChangeObject: {
              koodiarvo: helper.vahimmaisopiskelijamaaraKoodiarvo,
              maaraysUuid: (vahimmaisopiskelijavuodetMaarays || {}).uuid
            },
            initialValue: vahimmaisopiskelijavuodetMaarays
              ? vahimmaisopiskelijavuodetMaarays.arvo
              : 0,
            applyForValue: vahimmaisopiskelijavuodetMaarays
              ? vahimmaisopiskelijavuodetMaarays.arvo
              : 0,
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
                  koodiarvo:
                    prop("koodiarvo", vaativaTukiMaarays) ||
                    path(
                      ["properties", "metadata", "koodiarvo"],
                      vaativaTukiChangeObj
                    ),
                  maaraysUuid: (findVaativatukiRajoitus(maaraykset) || {}).uuid
                },
                isRequired: isVaativaTukiValueRequired,
                initialValue: opiskelijavuosimaaraysVaativaTuki
                  ? opiskelijavuosimaaraysVaativaTuki.arvo
                  : 0,
                applyForValue: opiskelijavuosimaaraysVaativaTuki
                  ? opiskelijavuosimaaraysVaativaTuki.arvo
                  : 0,
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
                  koodiarvo: helper.sisaoppilaitosOpiskelijamaaraKoodiarvo,
                  maaraysUuid: (findSisaoppilaitosRajoitus(maaraykset) || {})
                    .uuid
                },
                isRequired: isSisaoppilaitosValueRequired,
                initialValue: opiskelijavuosimaaraysSisaoppilaitos
                  ? opiskelijavuosimaaraysSisaoppilaitos.arvo
                  : 0,
                applyForValue: opiskelijavuosimaaraysSisaoppilaitos
                  ? opiskelijavuosimaaraysSisaoppilaitos.arvo
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

export default function getOpiskelijavuodetLomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "modification":
      return getModificationForm(
        locale,
        data.isSisaoppilaitosValueRequired,
        data.isVaativaTukiValueRequired,
        data.maaraykset,
        data.muut,
        data.muutChanges,
        data.muutMaaraykset,
        data.sectionId
      );
    default:
      return [];
  }
}
