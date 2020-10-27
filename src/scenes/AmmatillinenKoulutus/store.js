import { createStore, createHook, createContainer } from "react-sweet-state";
import {
  assoc,
  assocPath,
  concat,
  flatten,
  isEmpty,
  map,
  mergeAll,
  path,
  prepend,
  split,
  symmetricDifference
} from "ramda";
import { recursiveTreeShake } from "utils/common";

const setLatestChanges = diff => ({ getState, setState }) => {
  setState(assoc("latestChanges", diff, getState()));
};

const Store = createStore({
  initialState: {
    changeObjects: {
      unsaved: {
        kielet: {
          opetuskielet: [
            {
              anchor: "kielet_opetuskielet.2.A",
              properties: {
                metadata: {
                  isInLupa: false,
                  maaraysUuid: undefined,
                  kuvaus: "ruotsi",
                  meta: undefined
                },
                isChecked: true
              }
            },
            {
              anchor: "kielet_opetuskielet.5.A",
              properties: {
                metadata: {
                  isInLupa: false,
                  maaraysUuid: undefined,
                  kuvaus: "saame",
                  meta: undefined
                },
                isChecked: true
              }
            }
          ]
        },
        tutkinnot: {
          "01": [
            {
              anchor: "tutkinnot_01.12.417101.tutkinto",
              properties: {
                isChecked: true
              }
            }
          ]
        }
      }
    },
    latestChanges: [
      {
        anchor: "tutkinnot_01.12.417101.tutkinto",
        properties: {
          isChecked: true
        }
      }
    ]
  },
  actions: {
    setChanges: (changeObjects, anchor = "", key = "unsaved") => ({
      getState,
      dispatch,
      setState
    }) => {
      const anchorParts = split("_", anchor);
      const fullPath = prepend(key, anchorParts).filter(Boolean);

      const currentStateOfAnchor = path(fullPath, getState().changeObjects);

      console.info(fullPath, changeObjects);
      // console.trace();

      let nextChangeObjects = assocPath(
        fullPath,
        changeObjects,
        getState().changeObjects
      );

      if (isEmpty(changeObjects)) {
        nextChangeObjects = recursiveTreeShake(fullPath, nextChangeObjects);
      }

      const nextStateOfAnchor = path(fullPath, nextChangeObjects);
      setState(assoc("changeObjects", nextChangeObjects, getState()));
      dispatch(
        setLatestChanges(
          symmetricDifference(
            nextStateOfAnchor || [],
            currentStateOfAnchor || []
          )
        )
      );
    }
  },
  name: "Muutokset"
});

const getChangeObjectsByAnchor = (
  state,
  { anchor },
  keys = ["unsaved", "saved"]
) => {
  return mergeAll(
    flatten(
      map(key => {
        return {
          [key]:
            path(prepend(key, split("_", anchor)), state.changeObjects) || []
        };
      }, keys)
    )
  );
};

const getChangeObjects = (state, { anchor }) => {
  const anchorParts = split("_", anchor);
  return flatten([
    path(prepend("saved", anchorParts), state.changeObjects) || [],
    path(prepend("unsaved", anchorParts), state.changeObjects) || []
  ]);
};

const getUnsavedChangeObjectsBySectionId = (state, { anchor }) => {
  return getChangeObjectsByAnchor(state, { anchor }, ["unsaved"]);
};

export const useMuutokset = createHook(Store);

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useChangeObjects = createHook(Store, {
  selector: getChangeObjects
});

export const useLomakeSection = createHook(Store, {
  selector: getChangeObjectsByAnchor
});

export const useUnsavedChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.unsaved
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
