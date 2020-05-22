import { path } from "ramda";

/**
 * Function contains mapping data for backend related to opiskeluvuodet lomake.
 * Return value is an array of config objects. The first property of a config object is
 * 'path'. It defines where the value (calculated by valueFn) is put to. Second property
 * is 'anchors'. Function 'valueFn' is called with change objects of those anchors.
 */
export function getMapping() {
  return [
    {
      path: ["value"],
      anchors: [
        `perustelut_opiskelijavuodet_vahimmaisopiskelijavuodet.perustelut.1.A`
      ],
      valueFn: changeObjects =>
        path([0, "properties", "metadata", "fieldName"], changeObjects)
    },
    {
      path: ["value"],
      anchors: [
        `perustelut_opiskelijavuodet_vahimmaisopiskelijavuodet.perustelut.2.A`
      ],
      valueFn: changeObjects =>
        path([0, "properties", "metadata", "fieldName"], changeObjects)
    },
    {
      path: ["value"],
      anchors: [
        `perustelut_opiskelijavuodet_vahimmaisopiskelijavuodet.perustelut.3.A`
      ],
      valueFn: changeObjects =>
        path([0, "properties", "metadata", "fieldName"], changeObjects)
    },
    {
      path: ["value"],
      anchors: [
        `perustelut_opiskelijavuodet_vahimmaisopiskelijavuodet.2.tehtavan-tarpeellisuus-field.A`
      ],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    }
  ];
}
