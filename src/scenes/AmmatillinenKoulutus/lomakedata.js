import { createStore, createHook, createContainer } from "react-sweet-state";
import { assocPath, path, split } from "ramda";

const Store = createStore({
  initialState: {},
  actions: {
    setLomakedata: (data, anchor) => ({ getState, setState }) => {
      setState(assocPath(split("_", anchor), data, getState()));
    }
  },
  name: "Lomakedata"
});

const getLomakedataByAnchor = (state, { anchor }) => {
  return path(split("_", anchor), state) || {};
};

export const useLomakedata = createHook(Store, {
  selector: getLomakedataByAnchor
});

export const LomakedataContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
