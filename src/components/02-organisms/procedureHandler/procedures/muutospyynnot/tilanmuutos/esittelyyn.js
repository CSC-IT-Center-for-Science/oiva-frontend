import { postData } from "../../../fetch";

// muutospyynnot.tilanmuutos.esittelyyn
export const esittelyyn = {
  label: "Muutospyynnön saattaminen esiteltäväksi",
  input: ["id"],
  run: async ({ id }) => {
    console.info(id);
    const response = await postData(
      "muutospyyntoEsittelyyn",
      {},
      {
        urlEnding: id,
        credentials: "include"
      }
    );
    const json = await response.json();
    return {
      result: json,
      status: response.status
    };
  },
  next: output => {
    if (output.inform !== false) {
      if (output.status === 200) {
        return ["muutospyynnot.tilanmuutos.onnistui"];
      } else if (output.status !== 200) {
        return ["muutospyynnot.tilanmuutos.epaonnistui"];
      }
    }
  }
};
