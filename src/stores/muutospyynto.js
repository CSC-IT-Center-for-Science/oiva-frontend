import { createStore, createHook } from "react-sweet-state";
import { execute } from "./utils/loadFromBackend";
import ProcedureHandler from "../components/02-organisms/procedureHandler";

const refreshIntervalInSeconds = 60;
const initialState = {};

const Store = createStore({
  initialState,
  actions: {
    download: path => () => {
      const procedureHandler = new ProcedureHandler();
      procedureHandler.run("muutospyynto.lataaminen.download", [path]);
    },
    downloadAndShowInAnotherWindow: path => () => {
      const procedureHandler = new ProcedureHandler();
      procedureHandler.run("muutospyynto.lataaminen.downloadAndShow", [
        path,
        true
      ]);
    },
    downloadAndShowInSameWindow: path => () => {
      const procedureHandler = new ProcedureHandler();
      procedureHandler.run("muutospyynto.lataaminen.downloadAndShow", [
        path,
        false
      ]);
    },
    getDownloadPath: uuid => async () => {
      const procedureHandler = new ProcedureHandler();
      const outputs = await procedureHandler.run(
        "muutospyynto.esikatselu.latauspolku",
        [uuid]
      );
      return outputs.muutospyynto.esikatselu.latauspolku.output;
    },
    getLupaPreviewDownloadPath: uuid => async () => {
      const procedureHandler = new ProcedureHandler();
      const outputs = await procedureHandler.run(
          "muutospyynto.esittelijanEsikatselu.latauspolku",
          [uuid]
      );

      return outputs.muutospyynto.esittelijanEsikatselu.latauspolku.output;
    },
    load: (uuid, isForceReloadRequested) => ({ getState, setState }) => {
      return execute(
        { getState, setState },
        {
          key: "muutospyynto",
          urlEnding: uuid
        },
        { uuid },
        isForceReloadRequested ? 0 : refreshIntervalInSeconds
      );
    },
    reset: () => ({ setState }) => {
      setState(initialState);
    }
  },
  name: "Muutospyyntö"
});

export const useMuutospyynto = createHook(Store);
