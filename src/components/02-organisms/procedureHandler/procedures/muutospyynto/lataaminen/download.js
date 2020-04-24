import { downloadFile } from "../../../../../../utils/common";

// muutospyynto.lataaminen.download
export const download = {
  label: "Muutospyynnön lataaminen käyttäjän koneelle",
  input: ["url"],
  run: ({ url }) => {
    return downloadFile(url);
  },
  next: wasDownloadSuccessful => {
    return wasDownloadSuccessful
      ? ["muutospyynto.lataaminen.onnistui"]
      : ["muutospyynto.lataaminen.epaonnistui"];
  }
};
