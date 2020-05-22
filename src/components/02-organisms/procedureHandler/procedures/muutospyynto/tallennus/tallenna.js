import { postData } from "../../../fetch";

// muutospyynto.tallennus.tallenna
export const tallenna = {
  label: "Muutospyynnön tallennus",
  input: ["formData", "inform"],
  run: async ({ formData, inform }) => {
    const response = await postData("tallennaMuutospyynto", formData);
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
