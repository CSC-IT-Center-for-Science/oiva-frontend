import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynnot.poisto.epaonnistui
export const epaonnistui = formatMessage => ({
  label: "Ilmoitus epäonnistumisesta",
  run: async () => {
    toast.error(formatMessage(informUser.muutospyynnonPoistaminenEpaonnistui), {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
});

