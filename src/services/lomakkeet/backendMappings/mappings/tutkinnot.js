import { path } from "ramda";

/**
 * Function contains mapping data for backend related to tyovoimakoulutus lomake.
 * Return value is an array of config objects. The first property of a config object is
 * 'path'. It defines where the value (calculated by valueFn) is put to. Second property
 * is 'anchors'. Function 'valueFn' is called with change objects of those anchors.
 * @param {anchor} anchor
 *
 */
export function getMapping(anchor) {
  return [
    {
      path: ["value"],
      anchors: [`perustelut_${anchor}.perustelut.1.A`],
      valueFn: changeObjects =>
        path([0, "properties", "metadata", "fieldName"], changeObjects)
    },
    {
      path: ["value"],
      anchors: [`perustelut_${anchor}.perustelut.2.A`],
      valueFn: changeObjects =>
        path([0, "properties", "metadata", "fieldName"], changeObjects)
    },
    {
      path: ["value"],
      anchors: [`perustelut_${anchor}.perustelut.3.A`],
      valueFn: changeObjects =>
        path([0, "properties", "metadata", "fieldName"], changeObjects)
    },
    {
      path: ["value"],
      anchors: [`perustelut_${anchor}.vapaa-tekstikentta.A`],
      valueFn: changeObjects => path([0, "properties", "value"], changeObjects)
    }
  ];
}
