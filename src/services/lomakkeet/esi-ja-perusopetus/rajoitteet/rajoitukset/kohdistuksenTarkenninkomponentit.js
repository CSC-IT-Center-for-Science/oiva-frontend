import { prop } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "./tarkenninkomponentit";

const kohdistuksenTarkenninkomponentit = {
  enintaan: getLukumaarakomponentit,
  joistaEnintaan: getLukumaarakomponentit,
  joistaVahintaan: getLukumaarakomponentit,
  lisaksiEnintaan: getLukumaarakomponentit,
  lisaksiVahintaan: getLukumaarakomponentit,
  maaraaika: getMaaraaikakomponentit,
  vahintaan: getLukumaarakomponentit
};

export const getKohdistuksenTarkenninkomponentit = (
  kohdistuksenKohdeavain,
  locale
) => {
  if (!kohdistuksenKohdeavain) {
    return false;
  }
  const tarkenninFn = prop(
    kohdistuksenKohdeavain,
    kohdistuksenTarkenninkomponentit
  );
  return tarkenninFn(locale) || [];
};
