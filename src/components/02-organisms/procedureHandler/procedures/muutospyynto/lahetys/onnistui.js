import { toast } from "react-toastify";

// muutospyynto.lahetys.onnistui
export const onnistui = {
  label: "Lähettäminen onnistui",
  input: ["muutospyynto"],
  run: async ({ muutospyynto }) => {
    toast.success("Muutospyyntö lähetetty!", {
      autoClose: 2000,
      position: toast.POSITION.TOP_LEFT
    });
    return muutospyynto.jarjestajaYtunnus;
  },
  next: () => {
    return ["muutospyynnot.listaus"];
  }
};
