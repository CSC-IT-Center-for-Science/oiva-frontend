import { toast } from "react-toastify";

// muutospyynto.esikatselu.polkuOK
export const polkuOK = {
  label: "Polku OK.",
  run: async () => {
    toast.success("PDF-dokumentti löytyi.", {
      autoClose: 8000,
      position: toast.POSITION.BOTTOM_LEFT
    });
    return true;
  }
};
