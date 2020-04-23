import { toast } from "react-toastify";

// muutospyynnot.poisto.epaonnistui
export const epaonnistui = {
  label: "Ilmoitus epäonnistumisesta",
  run: async () => {
    toast.error("Muutospyynnön eli asian poistaminen epäonnistui.", {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
};
