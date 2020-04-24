import { toast } from "react-toastify";

// muutospyynto.esikatselu.polkuvirhe
export const polkuvirhe = {
  label: "Dokumentin sijaintia backendissä ei voitu määrittää",
  run: async () => {
    toast.error("Dokumenttia ei syystä tai toisesta löytynyt", {
      autoClose: 5000,
      position: toast.POSITION.BOTTOM_LEFT
    });
    return false;
  }
};
