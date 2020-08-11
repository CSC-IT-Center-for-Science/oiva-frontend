import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynnot.tilanmuutos.onnistui
export const onnistui = formatMessage => ({
  label: "Ilmoitus onnistumisesta",
  run: async () => {
    toast.success(formatMessage(informUser.muutospyynnonTilaMuutettu), {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
});
