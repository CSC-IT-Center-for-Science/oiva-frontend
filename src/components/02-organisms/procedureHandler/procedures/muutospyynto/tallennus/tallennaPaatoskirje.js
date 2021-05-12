import { postData } from "../../../fetch";

// muutospyynto.tallennus.tallennaPaatoskirje
export const tallennaPaatoskirje = () => ({
  label: "Päätöskirjeen tallennus",
  input: ["paatoskirje", "muutospyynto", "inform"],
  run: async ({ paatoskirje, muutospyynto, inform }) => {
    const formData = new FormData();
    const muutos = new Blob([JSON.stringify(muutospyynto)], {
      type: "application/json"
    });
    formData.append("muutospyynto", muutos);
    formData.append(
      paatoskirje.tiedostoId,
      paatoskirje.tiedosto,
      paatoskirje.filename
    );
    const response = await postData("tallennaPaatoskirje", formData, {
      urlEnding: muutospyynto.uuid
    });
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
});
