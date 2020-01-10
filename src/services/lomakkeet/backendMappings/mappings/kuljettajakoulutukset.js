import { isNil, path } from "ramda";

/**
 * Function contains mapping data for backend related to kuljettajien peruskoulutuslomake.
 * Return value is an array of config objects. The first property of a config object is
 * 'path'. It defines where the value (calculated by valueFn) is put to. Second property
 * is 'anchors'. Function 'valueFn' is called with change objects of those anchors.
 * @param {number} koodiarvo
 */
export function getMapping(koodiarvo) {
  return [
    {
      path: ["tarpeellisuus"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.tehtavan-tarpeellisuus.textbox.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["voimassaoleva"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.voimassaolo.voimassaolo-field-yes.A`,
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.voimassaolo.voimassaolo-field-no.A`
      ],
      valueFn: changeObjects => {
        const yesValue = path([0, "properties", "isChecked"], changeObjects);
        const noValue = path([1, "properties", "isChecked"], changeObjects);
        let isValid = null;
        if (!isNil(yesValue)) {
          isValid = true;
        } else if (!isNil(noValue)) {
          isValid = false;
        }
        return isValid;
      }
    },
    {
      path: ["suunnitelma_koulutus_toteutus"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.suunnitelma.suunnitelma-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["osaaminen"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.osaaminen.osaaminen-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["suunnitelma_koulutus_paikka"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.ammattipatevyyskoulutuksen-jarjestamispaikat.suunnitelma-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["kelpoisuus_ja_tyokokemus"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtaja.johtaja-info.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    // AJONEUVOKANTA
    {
      path: ["kanta_linja_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.ajoneuvokanta.ajoneuvokanta-kentat.linja-autoja`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["kanta_kuorma_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.ajoneuvokanta.ajoneuvokanta-kentat.kuorma-autoja`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["kanta_peravaunu"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.ajoneuvokanta.ajoneuvokanta-kentat.peravaunuja`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["kanta_muut"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.ajoneuvokanta.ajoneuvokanta-kentat.muut-ajoneuvot`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    // JOHTAJA
    {
      path: ["johtajat", "liikenneopettajalupa"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.liikenneopettajalupa.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "voimassa_kuorma_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.kuorma-autonkuljettajan-ammattipatevyys.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "voimassa_linja_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.linja-autonkuljettajan-ammattipatevyys.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "luokka_C"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.c-luokka.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "luokka_CE"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.ce-luokka.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "luokka_D"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.d-luokka.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "tutkinto_linja_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.linja-autonkuljettajan-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "tutkinto_yhdistelma"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.yhdistelma-ajoneuvonkuljettajan-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "tutkinto_puutavara"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.puutavaran-autonkuljetuksen-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "tutkinto_kuljetuspalvelu"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.kuljetuspalvelujen-osaamisalalla-suoritettu-logistiikan-perustutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["johtajat", "tutkinto_kuljetusala"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.johtajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.kuljetusalan-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    // OPETTAJAT
    {
      path: ["opettajat", "liikenneopettajalupa"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.liikenneopettajalupa.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "voimassa_kuorma_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.kuorma-autonkuljettajan-ammattipatevyys.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "voimassa_linja_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.linja-autonkuljettajan-ammattipatevyys.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "luokka_C"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.c-luokka.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "luokka_CE"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.ce-luokka.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "luokka_D"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.d-luokka.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "tutkinto_linja_auto"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.linja-autonkuljettajan-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "tutkinto_yhdistelma"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.yhdistelma-ajoneuvonkuljettajan-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "tutkinto_puutavara"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.puutavaran-autonkuljetuksen-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "tutkinto_kuljetuspalvelu"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.kuljetuspalvelujen-osaamisalalla-suoritettu-logistiikan-perustutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opettajat", "tutkinto_kuljetusala"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.opettajien-kelpoisuus-ja-tyokokemus.lupien-ja-tutkintojen-maarat.vahintaan-1-vuoden-kokemus.kuljetusalan-ammattitutkinto.lkm`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    // OPISKELIJAVUODET
    {
      path: ["opiskelija_vuodet"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.5-4.5-4.vuodet.A`,
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.5-4.5-4.vuodet.B`,
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.5-4.5-4.vuodet.C`
      ],
      valueFn: changeObjects => {
        const firstYear = path(
          [0, "properties", "metadata", "year"],
          changeObjects
        );
        const secondYear = path(
          [1, "properties", "metadata", "year"],
          changeObjects
        );
        const thirdYear = path(
          [2, "properties", "metadata", "year"],
          changeObjects
        );
        return firstYear || secondYear || thirdYear
          ? [
              firstYear
                ? {
                    vuosi: firstYear,
                    arvo: path([0, "properties", "value"], changeObjects)
                  }
                : null,
              secondYear
                ? {
                    vuosi: secondYear,
                    arvo: path([1, "properties", "value"], changeObjects)
                  }
                : null,
              thirdYear
                ? {
                    vuosi: thirdYear,
                    arvo: path([2, "properties", "value"], changeObjects)
                  }
                : null
            ].filter(Boolean)
          : null;
      }
    },
    // VÄLINEET
    {
      path: ["valineet_asetus"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.muut-opetusvalineet.asetuksen-mukaiset.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["valineet_muut"],
      anchors: [
        `perustelut_koulutukset_kuljettajakoulutukset.${koodiarvo}.muut-opetusvalineet.muut.B`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    }
  ];
}
