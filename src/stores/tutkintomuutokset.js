import { map, mergeAll } from "ramda";
import { createHook, createContainer, createStore } from "react-sweet-state";
import { muutokset } from "scenes/Koulutusmuodot/AmmatillinenKoulutus/sivun1tietojaTaytettyKattavasti";
import { setChanges } from "./actions";
import {
  getAllChangeObjectsByKeyAnchor,
  getChangeObjectsByAnchorWithoutUnderRemoval,
  getLatestChangesByAnchorByKey
} from "./hooksAndSelectors";

const Store = createStore({
  initialState: muutokset,
  // initialState: {
  //   changeObjects: {
  //     saved: {},
  //     unsaved: {},
  //     underRemoval: {}
  //   },
  //   focusOn: null,
  //   latestChanges: {},
  //   validity: {}
  // },
  actions: { setChanges },
  name: "Tutkintomuutokset"
});

export const TutkintomuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useLatestChangesByAnchor = createHook(Store, {
  selector: getLatestChangesByAnchorByKey
});

export const useChangeObjectsByAnchor = createHook(Store, {
  selector: getAllChangeObjectsByKeyAnchor
});

export const useChangeObjectsByAnchorWithoutUnderRemoval = createHook(Store, {
  selector: getChangeObjectsByAnchorWithoutUnderRemoval
});

export const useChangeObjectsByMultipleAnchorsWithoutUnderRemoval = createHook(
  Store,
  {
    selector: (state, { anchors }) => {
      return mergeAll(
        map(anchor => {
          return {
            [anchor]: getChangeObjectsByAnchorWithoutUnderRemoval(state, {
              anchor
            })
          };
        }, anchors)
      );
    }
  }
);

export const useChangeObjects = createHook(Store);

export const useUnsavedChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.unsaved
});

export const useUnderRemovalChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.underRemoval
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
