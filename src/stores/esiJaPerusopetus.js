import { createStore, createHook } from "react-sweet-state";
import {
  assocPath,
  clone,
  dissocPath,
  filter,
  flatten,
  isEmpty,
  split
} from "ramda";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";

const Store = createStore({
  initialState: {
    changeObjects: {}
  },
  actions: {
    addAClick: (sectionId, anchor) => ({ getState, setState }) => {
      if (sectionId && anchor) {
        const currentChangeObjects = getState().changeObjects[sectionId];
        let nextChangeObjects = clone(currentChangeObjects);
        let changeObj = getChangeObjByAnchor(
          anchor,
          getState().changeObjects[sectionId]
        );
        if (changeObj) {
          nextChangeObjects = filter(changeObj => {
            return changeObj.anchor !== anchor;
          }, currentChangeObjects);
          changeObj = assocPath(
            ["properties", "amountOfClicks"],
            changeObj.properties.amountOfClicks + 1,
            changeObj
          );
        } else {
          changeObj = {
            anchor: anchor,
            properties: {
              amountOfClicks: 1
            }
          };
        }
        const path = flatten(["changeObjects", split("_", sectionId)]);
        setState(
          assocPath(path, flatten([nextChangeObjects, changeObj]), getState())
        );
      }
    },
    setChangeObjects: (sectionId, changeObjects) => ({
      getState,
      setState
    }) => {
      if (sectionId && changeObjects) {
        const path = flatten(["changeObjects", split("_", sectionId)]);
        setState(assocPath(path, changeObjects, getState()));
      }
      // Properties not including Toimintaalue and Tutkintokielet are deleted if empty.
      if (
        sectionId &&
        sectionId !== "toimintaalue" &&
        sectionId !== "kielet_tutkintokielet" &&
        isEmpty(changeObjects)
      ) {
        setState(dissocPath(split("_", sectionId), getState().changeObjects));
      }
    }
  },
  name: "Esi- ja perusopetus"
});

export const useEsiJaPerusopetus = createHook(Store);
