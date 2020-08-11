import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.tallennus.epaonnistui
export const epaonnistui = formatMessage => ({
  label: "Ilmoitus epäonnistumisesta",
  input: ["formData", "inform"],
  run: async () => {
    toast.error(formatMessage(informUser.tallennusEpaonnistui), {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
});
