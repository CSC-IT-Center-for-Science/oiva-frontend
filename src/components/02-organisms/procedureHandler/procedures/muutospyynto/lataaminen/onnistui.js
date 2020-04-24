import { toast } from "react-toastify";

// muutospyynto.lataaminen.onnistui
export const onnistui = {
  label: "Muutospyynnön lataaminen onnistui",
  run: async () => {
    toast.success(
      "Muutospyynnön lataaminen onnistui. PDF-muotoinen dokumentti on valmis tarkasteltavaksi.",
      {
        autoClose: 8000,
        position: toast.POSITION.BOTTOM_LEFT
      }
    );
    return true;
  }
};
