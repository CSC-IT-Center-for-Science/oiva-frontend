import { postData } from "../../../fetch";

// muutospyynnot.tilanmuutos.paatetyksi
export const paatetyksi = {
  label: "Muutospyynnön saattaminen päätetyksi",
  input: ["id"],
  run: async ({ id }) => {
    const response = await postData(
      "muutospyyntoPaatetyksi",
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
