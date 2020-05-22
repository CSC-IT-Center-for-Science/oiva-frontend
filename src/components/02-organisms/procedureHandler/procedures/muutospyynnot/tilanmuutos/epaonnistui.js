import { toast } from "react-toastify";

// muutospyynnot.tilanmuutos.epaonnistui
export const epaonnistui = {
  label: "Ilmoitus epäonnistumisesta",
  run: async () => {
    toast.error("Muutospyynnön eli asian tilaa ei voitu muuttaa.", {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
};
