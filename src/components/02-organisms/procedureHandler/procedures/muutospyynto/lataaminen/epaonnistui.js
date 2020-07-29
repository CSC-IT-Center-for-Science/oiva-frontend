import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.lataaminen.epaonnistui
export const epaonnistui = formatMessage => ({
  label: "Virhe muutospyynnön lataamisessa käyttäjän koneelle",
  run: async () => {
    toast.error(formatMessage(informUser.virheDokumentinLataamisessa), {
      autoClose: 8000,
      position: toast.POSITION.BOTTOM_LEFT
    });
    return false;
  }
});
