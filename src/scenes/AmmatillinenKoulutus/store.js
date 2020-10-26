import { createStore, createHook, createContainer } from "react-sweet-state";
import { assoc, assocPath, path, split, symmetricDifference } from "ramda";

const setLatestChanges = diff => ({ getState, setState }) => {
  setState(assoc("latestChanges", diff, getState()));
};

const Store = createStore({
  initialState: {},
  actions: {
    setChanges: (changeObjects, anchor) => ({
      getState,
      dispatch,
      setState
    }) => {
      const anchorParts = split("_", anchor);

      if (anchor && changeObjects) {
        const currentStateOfAnchor = path(anchorParts, getState());
        const nextState = assocPath(anchorParts, changeObjects, getState());
        const nextStateOfAnchor = path(anchorParts, nextState);
        setState(nextState);
        dispatch(
          setLatestChanges(
            symmetricDifference(
              nextStateOfAnchor || [],
              currentStateOfAnchor || []
            )
          )
        );
      }
    }
  },
  name: "Muutokset"
});

const getChangeObjectsBySectionId = (state, { anchor }) => {
  return path(split("_", anchor), state) || [];
};

export const useMuutokset = createHook(Store);

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useLomakeSection = createHook(Store, {
  selector: getChangeObjectsBySectionId
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
