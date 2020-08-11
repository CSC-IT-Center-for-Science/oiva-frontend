import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.muutokset.asianumeroOnJoKaytossa
export const asianumeroOnJoKaytossa = formatMessage => ({
  label: "Ilmoitus siitä että asianumero on jo käytössä",
  run: async () => {
    toast.error(formatMessage(informUser.asianumeroOnJoKaytossa), {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER
    });
    return true;
  }
});
