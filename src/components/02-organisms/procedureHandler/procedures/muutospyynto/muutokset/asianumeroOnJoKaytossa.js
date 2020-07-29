import { toast } from "react-toastify";

// muutospyynto.muutokset.asianumeroOnJoKaytossa
export const asianumeroOnJoKaytossa = {
  label: "Ilmoitus siitä että asianumero on jo käytössä",
  run: async () => {
    //TODO: Lokalisointi käyttöön (error.duplicateAsianumero)
    toast.error("Asianumero on jo käytössä toisella muutospyynnöllä", {
      autoClose: 5000,
      position: toast.POSITION.TOP_CENTER
    });
    return true;
  }
};
