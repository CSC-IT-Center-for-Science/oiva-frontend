import { postData } from "../../../fetch";

// muutospyynnot.tilanmuutos.korjattavaksi
export const korjattavaksi = {
  label: "Muutospyynnön asettaminen korjaustilaan",
  input: ["id"],
  run: async ({ id }) => {
    const response = await postData(
      "muutospyyntoKorjattavaksi",
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
        return [
          "muutospyynnot.tilanmuutos.korjaustilaanSiirtyminenEpaonnistui"
        ];
      }
    }
  }
};
