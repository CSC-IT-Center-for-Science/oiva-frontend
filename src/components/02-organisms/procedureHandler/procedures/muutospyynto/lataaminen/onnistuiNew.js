import { toast } from "react-toastify";

// muutospyynto.lataaminen.onnistuiNew
export const onnistuiNew = {
  label: "Muutospyynnön lataaminen onnistui (uusi ikkuna)",
  run: async () => {
    toast.success(
      "Muutospyynnön lataaminen onnistui. PDF-muotoinen dokumentti avattiin uuteen selainikkunaan.",
      {
        autoClose: 8000,
        position: toast.POSITION.BOTTOM_LEFT
      }
    );
    return true;
  }
};
