import { postData } from "../../../fetch";

// muutospyynnot.tilanmuutos.valmisteluun
export const valmisteluun = {
  label: "Muutospyynnön saattaminen valmisteluun",
  input: ["id"],
  run: async ({ id }) => {
    const response = await postData(
      "muutospyyntoValmisteluun",
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
