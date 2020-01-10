import { path } from "ramda";

export function getMapping() {
  return [
    {
      path: ["tarpeellisuus"],
      anchors: [
        "perustelut_muut_01.laajennettu.1.oppisopimus-perustelut-lomake.4-1.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["henkilosto"],
      anchors: [
        "perustelut_muut_01.laajennettu.1.oppisopimus-perustelut-lomake.4-2.henkilostoresurssit-textbox.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["osaaminen"],
      anchors: [
        "perustelut_muut_01.laajennettu.1.oppisopimus-perustelut-lomake.4-2.osaaminen-textbox.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["sidosryhma"],
      anchors: [
        "perustelut_muut_01.laajennettu.1.oppisopimus-perustelut-lomake.4-2.sidosryhmayhteistyo-textbox.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["opiskelija_vuodet"],
      anchors: [
        "perustelut_muut_01.laajennettu.1.oppisopimus-perustelut-lomake.3-3.3-3.vuodet.A",
        "perustelut_muut_01.laajennettu.1.oppisopimus-perustelut-lomake.3-3.3-3.vuodet.B",
        "perustelut_muut_01.laajennettu.1.oppisopimus-perustelut-lomake.3-3.3-3.vuodet.C"
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
