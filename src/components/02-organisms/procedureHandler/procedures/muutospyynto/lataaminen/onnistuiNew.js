import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.lataaminen.onnistuiNew
export const onnistuiNew = formatMessage => ({
  label: "Muutospyynnön lataaminen onnistui (uusi ikkuna)",
  run: async () => {
    toast.success(formatMessage(informUser.latausOnnistuiPDFUudessaIkkunassa), {
      autoClose: 8000,
      position: toast.POSITION.BOTTOM_LEFT
    });
    return true;
  }
});
