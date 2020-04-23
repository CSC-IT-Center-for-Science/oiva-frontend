import { deleteDocument } from "../../../delete";

// muutospyynnot.poista
export const poista = {
  label: "Muutospyynnön poisto",
  input: ["id"],
  run: async ({ id }) => {
    console.info(id);
    const response = await deleteDocument("poistaMuutospyynto", {
      urlEnding: id
    });
    const json = await response.json();
    return {
      result: json,
      status: response.status
    };
  },
  next: output => {
    if (output.inform !== false) {
      if (output.status === 200) {
        return ["muutospyynnot.poisto.onnistui"];
      } else if (output.status !== 200) {
        return ["muutospyynnot.poisto.epaonnistui"];
      }
    }
  }
};
