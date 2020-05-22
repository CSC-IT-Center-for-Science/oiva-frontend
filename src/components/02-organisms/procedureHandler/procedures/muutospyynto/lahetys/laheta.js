import { postData } from "../../../fetch";

// muutospyynto.lahetys.laheta
export const laheta = {
  label: "Muutospyynnön lähettäminen",
  input: ["muutospyynto"],
  run: async ({ muutospyynto }) => {
    const response = await postData("lahetaMuutospyynto", null, {
      urlEnding: muutospyynto.uuid
    });
    return { muutospyynto, status: response.status };
  },
  next: ({ status }) => {
    if (status === 200) {
      return ["muutospyynto.lahetys.onnistui"];
    }
    return ["muutospyynto.lahetys.epaonnistui"];
  },
  output: fromRun => {
    return fromRun.muutospyynto;
  }
};
