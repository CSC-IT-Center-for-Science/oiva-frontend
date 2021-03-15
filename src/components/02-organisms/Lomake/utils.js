import { map, prop } from "ramda";
import { getChangeObjByAnchor } from "../CategorizedListRoot/utils";

export const getReducedStructureIncludingChanges = (
  baseAnchor,
  reducedStructure = [],
  changeObjects
) => {
  return map(component => {
    const anchor = `${baseAnchor}.${component.fullAnchor}`;
    const changeObj = getChangeObjByAnchor(anchor, changeObjects);
    return {
      anchor,
      properties: Object.assign(
        {},
        component.properties,
        prop("properties", changeObj) || {}
      )
    };
  }, reducedStructure);
};

export const getCurrentStateOfLomake = async () => {};
