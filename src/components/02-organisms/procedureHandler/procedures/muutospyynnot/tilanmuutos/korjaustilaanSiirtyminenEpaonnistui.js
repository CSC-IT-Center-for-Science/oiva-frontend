import { toast } from "react-toastify";

// muutospyynnot.tilanmuutos.korjaustilaanSiirtyminenEpaonnistui
export const korjaustilaanSiirtyminenEpaonnistui = () => ({
  label: "Ilmoitus epäonnistumisesta",
  run: async () => {
    toast.error(
      "Tämä on väliaikainen ilmoitus. Korjaustilaan siirtymistä ei ole vielä toteutettu, joten muutospyyntö pysyy aiemmassa tilassaan. TODO: Toteuta korjaustilaan siirtyminen tekemällä oikeanlainen kutsu backendille.",
      {
        autoClose: 10000,
        position: toast.POSITION.TOP_LEFT
      }
    );
    return true;
  }
});
