import { toast } from "react-toastify";

// muutospyynnot.poisto.onnistui
export const onnistui = {
  label: "Ilmoitus onnistumisesta",
  run: async () => {
    toast.success("Muutospyynnön eli asian tila muutettu!", {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
};
