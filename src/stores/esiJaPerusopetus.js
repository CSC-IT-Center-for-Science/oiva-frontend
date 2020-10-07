import { createStore, createHook } from "react-sweet-state";
import {
  append,
  assoc,
  assocPath,
  clone,
  dissocPath,
  filter,
  flatten,
  isEmpty,
  prop,
  split,
  startsWith
} from "ramda";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";
import initialChangeObjects from "./tempState";

const Store = createStore({
  initialState: {
    changeObjects: initialChangeObjects
  },
  actions: {
    addCriterion: rajoiteId => ({ getState, setState }) => {
      const currentChangeObjects = prop("changeObjects", getState());
      const rajoitekriteeritChangeObjects = filter(
        changeObj =>
          startsWith(`rajoitteet.${rajoiteId}.kriteeri`, changeObj.anchor),
        currentChangeObjects.rajoitteet
      );
      const nextChangeObjects = assoc(
        "rajoitteet",
        append(
          {
            anchor: `rajoitteet.${rajoiteId}.kriteeri${rajoitekriteeritChangeObjects.length}.valintaelementti`,
            properties: {
              value: { label: "Määräaika", value: "maaraaika" }
            }
          },
          currentChangeObjects.rajoitteet || []
        ),
        currentChangeObjects
      );
      setState({ ...getState(), changeObjects: nextChangeObjects });
    },
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
