import { downloadFileFn } from "../../../../../../utils/common";

// muutospyynto.lataaminen.downloadAndShow
export const downloadAndShow = {
  label: "Muutospyynnön lataaminen ja näyttäminen käyttäjälle",
  input: ["url", "openInNewWindow"],
  run: ({ url, openInNewWindow = true }) => {
    return {
      wasDownloadSuccessful: downloadFileFn({ url, openInNewWindow })(),
      openInNewWindow
    };
  },
  next: ({ wasDownloadSuccessful, openInNewWindow }) => {
    if (wasDownloadSuccessful) {
      if (openInNewWindow) {
        return ["muutospyynto.lataaminen.onnistuiNew"];
      } else {
        return ["muutospyynto.lataaminen.onnistui"];
      }
    }
    return ["muutospyynto.lataaminen.epaonnistui"];
  }
};
