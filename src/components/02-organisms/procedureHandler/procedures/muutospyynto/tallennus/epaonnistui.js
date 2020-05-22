import { toast } from "react-toastify";

// muutospyynto.tallennus.epaonnistui
export const epaonnistui = {
  label: "Ilmoitus epäonnistumisesta",
  run: async () => {
    toast.error("Tallennus epäonnistui.", {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
};
