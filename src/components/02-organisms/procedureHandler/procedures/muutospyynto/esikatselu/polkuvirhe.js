import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.esikatselu.polkuvirhe
export const polkuvirhe = formatMessage => ({
  label: "Dokumentin sijaintia backendissä ei voitu määrittää",
  run: async () => {
    toast.error(formatMessage(informUser.dokumenttiaEiLoytynyt), {
      autoClose: 5000,
      position: toast.POSITION.BOTTOM_LEFT
    });
    return false;
  }
});
