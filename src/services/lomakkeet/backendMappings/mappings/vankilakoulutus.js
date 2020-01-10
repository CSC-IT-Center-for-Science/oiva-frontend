import { path, map } from "ramda";

export function getMapping(koodiarvo) {
  return [
    {
      path: ["tarpeellisuus"],
      anchors: [
        "perustelut_muut_04.vankila.5.vankilaopetus.tehtavan-tarpeellisuus.perustelut.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["henkilosto"],
      anchors: [
        "perustelut_muut_04.vankila.5.vankilaopetus.toiminnalliset-edellytykset.resurssit-field.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["osaaminen"],
      anchors: [
        "perustelut_muut_04.vankila.5.vankilaopetus.toiminnalliset-edellytykset.osaaminen-field.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["pedagogiset"],
      anchors: [
        "perustelut_muut_04.vankila.5.vankilaopetus.toiminnalliset-edellytykset.jarjestelyt-field.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["sidosryhma"],
      anchors: [
        "perustelut_muut_04.vankila.5.vankilaopetus.toiminnalliset-edellytykset.yhteistyo-field.A"
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    },
    {
      path: ["vankilat"],
      anchors: [
        "perustelut_muut_04.vankila.5.vankilaopetus.vankilaopetuksen-toteuttaminen.autocomplete.A"
      ],
      valueFn: changeObjects => {
        const filteredChangeObjects = changeObjects.filter(Boolean);
        if (filteredChangeObjects.length) {
          return map(vankila => {
            return { nimi: vankila.label };
          }, path([0, "properties", "value"], filteredChangeObjects) || []);
        }
        return null;
      }
    },
    {
      path: ["opiskelija_vuodet"],
      anchors: [
        "perustelut_muut_04.vankila.5.vankilaopetus.4-4.4-4.vuodet.A",
        "perustelut_muut_04.vankila.5.vankilaopetus.4-4.4-4.vuodet.B",
        "perustelut_muut_04.vankila.5.vankilaopetus.4-4.4-4.vuodet.C"
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
