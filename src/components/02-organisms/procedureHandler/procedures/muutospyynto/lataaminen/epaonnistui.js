import { toast } from "react-toastify";

// muutospyynto.lataaminen.epaonnistui
export const epaonnistui = {
  label: "Virhe muutospyynnön lataamisessa käyttäjän koneelle",
  run: async () => {
    toast.error("Virhe dokumentin lataamisessa", {
      autoClose: 8000,
      position: toast.POSITION.BOTTOM_LEFT
    });
    return false;
  }
};
