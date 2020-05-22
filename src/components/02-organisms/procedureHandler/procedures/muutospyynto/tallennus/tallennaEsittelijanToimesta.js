import { postData } from "../../../fetch";

// muutospyynto.tallennus.tallennaEsittelijanToimesta
export const tallennaEsittelijanToimesta = {
  label: "Muutospyynnön tallennus (by Esittelijä)",
  input: ["formData", "inform"],
  run: async ({ formData, inform }) => {
    const response = await postData("tallennaMuutospyyntoEsittelijanToimesta", formData);
    const json = await response.json();
    return {
      inform,
      result: json,
      status: response.status
    };
  },
  next: output => {
    if (output.inform !== false) {
      if (output.status === 200) {
        return ["muutospyynto.tallennus.onnistui"];
      } else if (output.status !== 200) {
        return ["muutospyynto.tallennus.epaonnistui"];
      }
    }
  }
};
