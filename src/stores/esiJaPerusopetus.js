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
import tmpState from "./tempState";
import { getAnchorPart } from "utils/common";

const Store = createStore({
  initialState: tmpState,
  actions: {
    addCriterion: (sectionId, rajoiteId) => ({ getState, setState }) => {
      const currentChangeObjects = prop("changeObjects", getState());
      const rajoitekriteeritChangeObjects = filter(
        changeObj =>
          startsWith(`${sectionId}.${rajoiteId}.kriteeri`, changeObj.anchor),
        currentChangeObjects[sectionId]
      );
      const nextChangeObjects = assoc(
        sectionId,
        append(
          {
            anchor: `${sectionId}.${rajoiteId}.kriteeri${rajoitekriteeritChangeObjects.length}.valintaelementti`,
            properties: {
              value: { label: "Määräaika", value: "maaraaika" }
            }
          },
          currentChangeObjects[sectionId] || []
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
    closeRestrictionDialog: () => ({ getState, setState }) => {
      setState({ ...getState(), isRestrictionDialogVisible: false });
    },
    removeCriterion: (sectionId, anchor) => ({ getState, setState }) => {
      const currentChangeObjects = prop("changeObjects", getState());
      const nextChangeObjects = filter(changeObj => {
        const criterionAnchor = getAnchorPart(changeObj.anchor, 2);
        console.info(changeObj.anchor, anchor, criterionAnchor);
        return criterionAnchor !== anchor;
      }, currentChangeObjects[sectionId]);
      setState(
        assocPath(["changeObjects", sectionId], nextChangeObjects, getState())
      );
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
    },
    showNewRestrictionDialog: () => ({ getState, setState }) => {
      setState({ ...getState(), isRestrictionDialogVisible: true });
    }
  },
  name: "Esi- ja perusopetus"
});

export const useEsiJaPerusopetus = createHook(Store);
