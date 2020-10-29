import { createStore, createHook, createContainer } from "react-sweet-state";
import { assocPath, path, split } from "ramda";
import { recursiveTreeShake } from "utils/common";

const Store = createStore({
  initialState: {
    validity: {}
  },
  actions: {
    setLomakedata: (data, anchor) => ({ getState, setState }) => {
      const anchorParts = split("_", anchor);
      const nextStateCandidate = assocPath(anchorParts, data, getState());
      const shakedTree = recursiveTreeShake(anchorParts, nextStateCandidate);
      setState(shakedTree);
    },
    setValidity: (status, anchor) => ({ getState, setState }) => {
      setState(assocPath(["validity", anchor], status, getState()));
    }
  },
  name: "Lomakedata"
});

const getLomakedataByAnchor = (state, { anchor }) => {
  return anchor ? path(split("_", anchor), state) || {} : state;
};

export const useValidity = createHook(Store, {
  selector: state => state.validity
});

export const useLomakedata = createHook(Store, {
  selector: getLomakedataByAnchor
});

export const LomakedataContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
