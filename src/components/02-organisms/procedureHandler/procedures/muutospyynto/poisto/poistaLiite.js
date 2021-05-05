import { deleteDocument } from "../../../delete";
import { toast } from "react-toastify";
import informUser from "../../../../../../i18n/definitions/informUser";

// muutospyynto.poisto.poistaLiite
export const poistaLiite = formatMessage => ({
  label: "Liitteen poistaminen",
  input: ["uuid", "inform"],
  run: async ({ uuid, inform }) => {
    const response = await deleteDocument("poistaLiite", { urlEnding: uuid });
    return {
      inform,
      status: response.status
    };
  },
  next: output => {
    if (output.inform !== false) {
      if (output.status === 200) {
        toast.success(formatMessage(informUser.liitePoistettu), {
          autoClose: 5000,
          position: toast.POSITION.TOP_LEFT
        });
      } else if (output.status !== 200) {
        toast.error(formatMessage(informUser.liitteenPoistaminenEpaonnistui), {
          autoClose: 5000,
          position: toast.POSITION.TOP_LEFT
        });
      }
    }
  }
});
