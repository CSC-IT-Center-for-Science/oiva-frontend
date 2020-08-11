import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynnot.tilanmuutos.epaonnistui
export const epaonnistui = formatMessage => ({
  label: "Ilmoitus epäonnistumisesta",
  run: async () => {
    toast.error(
      formatMessage(informUser.muutospyynonTilanMuuttaminenEpaonnistui),
      {
        autoClose: 5000,
        position: toast.POSITION.TOP_LEFT
      }
    );
    return true;
  }
});
