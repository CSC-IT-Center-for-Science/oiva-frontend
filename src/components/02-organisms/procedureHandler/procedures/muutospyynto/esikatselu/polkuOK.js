import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.esikatselu.polkuOK
export const polkuOK = formatMessage => ({
  label: "Polku OK.",
  run: async () => {
    toast.success(formatMessage(informUser.pdfDokumenttiLoytyi), {
      autoClose: 8000,
      position: toast.POSITION.BOTTOM_LEFT
    });
    return true;
  }
});
