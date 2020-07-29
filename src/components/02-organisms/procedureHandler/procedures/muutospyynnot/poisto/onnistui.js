import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynnot.poisto.onnistui
export const onnistui = formatMessage => ({
  label: "Ilmoitus onnistumisesta",
  run: async () => {
    toast.success(formatMessage(informUser.muutospyyntoPoistettu), {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
});
