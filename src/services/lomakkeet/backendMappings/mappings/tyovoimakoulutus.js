import { map, path } from "ramda";

/**
 * Function contains mapping data for backend related to tyovoimakoulutus lomake.
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
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.tehtavan-tarpeellisuus.ensisijaisella-toiminta-alueella.textbox`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["henkilosto"],
      anchors: [
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.toiminnalliset-edellytykset.henkilostoresurssit.textbox`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["osaaminen"],
      anchors: [
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.toiminnalliset-edellytykset.osaaminen.textbox`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["pedagogiset"],
      anchors: [
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.toiminnalliset-edellytykset.jarjestelyt.textbox`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["sidosryhma"],
      anchors: [
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.toiminnalliset-edellytykset.sidosryhmayhteistyo.textbox`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["suunnitelma"],
      anchors: [
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.suunnitelma.suunnitelma-field.textbox`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["yhteistyo"],
      anchors: [
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.yhteistyo.elykeskukset.autocomplete`
      ],
      valueFn: changeObjects => {
        const selectionList = path([0, "properties", "value"], changeObjects);
        const resultList =
          selectionList &&
          map(item => {
            return { nimi: item.label };
          }, selectionList);
        return resultList;
      }
    },
    {
      path: ["opiskelija_vuodet"],
      anchors: [
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.5-4.5-4.vuodet.A`,
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.5-4.5-4.vuodet.B`,
        `perustelut_koulutukset_tyovoimakoulutukset.${koodiarvo}.5-4.5-4.vuodet.C`
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
        return [
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
        ].filter(Boolean);
      }
    }
  ];
}
