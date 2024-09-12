import { createStore, createHook, createContainer } from "react-sweet-state";
import { assocPath, path, prepend, split } from "ramda";
import { recursiveTreeShake } from "utils/common";
import equal from "react-fast-compare";

const Store = createStore({
  initialState: {
    validity: {}
  },
  actions: {
    setLomakedata:
      (data, anchor) =>
      ({ getState, setState }) => {
        const anchorParts = prepend("sections", split("_", anchor));
        const nextStateCandidate = assocPath(anchorParts, data, getState());
        const shakedTree = recursiveTreeShake(anchorParts, nextStateCandidate);
        if (!equal(getState(), shakedTree)) {
          setState(shakedTree);
        }
      },
    setValidity:
      (status, anchor) =>
      ({ getState, setState }) => {
        setState(assocPath(["validity", anchor], status, getState()));
      }
  },
  name: "Lomakedata"
});

const getLomakedataByAnchor = (state, { anchor }) => {
  return anchor
    ? path(prepend("sections", split("_", anchor)), state) || {}
    : state;
};

export const useValidity = createHook(Store, {
  selector: state => state.validity
});

export const useLomakedata = createHook(Store, {
  selector: getLomakedataByAnchor
});

export const useAllSections = createHook(Store, {
  selector: state => state.sections
});

export const LomakedataContainer = createContainer(Store, {
  onInit:
    () =>
    ({ setState }, initialState) => {
      setState(initialState);
    }
});
