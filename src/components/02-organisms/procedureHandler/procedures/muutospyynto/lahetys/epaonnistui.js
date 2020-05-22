import { toast } from "react-toastify";

// muutospyynto.lahetys.epaonnistui
export const epaonnistui = {
  label: "Lähettäminen epäonnistui",
  run: async () => {
    toast.error("Lähettäminen epäonnistui.", {
      autoClose: 5000,
      position: toast.POSITION.TOP_LEFT
    });
    return true;
  }
};
