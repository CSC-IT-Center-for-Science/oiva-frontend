import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.lahetys.onnistui
export const onnistui = formatMessage => ({
  label: "Lähettäminen onnistui",
  input: ["muutospyynto"],
  run: async ({ muutospyynto }) => {
    toast.success(formatMessage(informUser.muutospyyntoLahetetty), {
      autoClose: 2000,
      position: toast.POSITION.TOP_LEFT
    });
    return muutospyynto.jarjestajaYtunnus;
  },
  next: () => {
    return ["muutospyynnot.listaus"];
  }
});
