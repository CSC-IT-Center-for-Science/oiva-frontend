import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.lataaminen.onnistui
export const onnistui = formatMessage => ({
  label: "Muutospyynnön lataaminen onnistui",
  run: async () => {
    toast.success(
      formatMessage(informUser.lataaminenOnnistuiJaPDFTarkasteltavana),
      {
        autoClose: 8000,
        position: toast.POSITION.BOTTOM_LEFT
      }
    );
    return true;
  }
});
