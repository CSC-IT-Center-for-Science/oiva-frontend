import { path } from "ramda";

/**
 * Function contains mapping data for backend related to Vaativa erityinen tuki -form.
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
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.A.tehtavan-tarpeellisuus-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["henkilosto"],
      anchors: [
        `perustelut_{koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.B.henkilostoresurssit-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["osaaminen"],
      anchors: [
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.B.osaaminen-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["pedagogiset"],
      anchors: [
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.B.jarjestelyt-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["sidosryhma"],
      anchors: [
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.B.sidosryhmayhteistyo-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["suunnitelma"],
      anchors: [
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.C.suunnitelma-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    // OPISKELIJAVUODET
    {
      path: ["opiskelija_vuodet"],
      anchors: [
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.4-4.4-4.vuodet.A`,
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.4-4.4-4.vuodet.B`,
        `perustelut_${koodiarvo}.vaativa-erityinen-tuki-perustelut-lomake.4-4.4-4.vuodet.C`
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
    }
  ];
}
