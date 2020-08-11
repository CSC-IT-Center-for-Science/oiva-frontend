import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.lahetys.epaonnistui
export const epaonnistui = formatMessage => ({
  label: "Lähettäminen epäonnistui",
  run: async () => {
    toast.error(formatMessage(informUser.muutospyyntoLahetetty), {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
});
