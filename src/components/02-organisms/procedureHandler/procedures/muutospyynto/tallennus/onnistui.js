import { toast } from "react-toastify";

// muutospyynto.tallennus.onnistui
export const onnistui = {
  label: "Ilmoitus onnistumisesta",
  run: async () => {
    toast.success("Muutospyyntö tallennettu!", {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
};
