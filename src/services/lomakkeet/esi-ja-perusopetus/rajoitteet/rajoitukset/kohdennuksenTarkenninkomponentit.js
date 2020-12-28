import { prop } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "./tarkenninkomponentit";

const kohdennuksenTarkenninkomponentit = {
  enintaan: getLukumaarakomponentit,
  joistaEnintaan: getLukumaarakomponentit,
  joistaVahintaan: getLukumaarakomponentit,
  lisaksiEnintaan: getLukumaarakomponentit,
  lisaksiVahintaan: getLukumaarakomponentit,
  maaraaika: getMaaraaikakomponentit,
  vahintaan: getLukumaarakomponentit
};

export const getKohdennuksenTarkenninkomponentit = (
  kohdennuksenKohdeavain,
  locale
) => {
  if (!kohdennuksenKohdeavain) {
    return false;
  }
  const tarkenninFn = prop(
    kohdennuksenKohdeavain,
    kohdennuksenTarkenninkomponentit
  );
  return tarkenninFn(locale) || [];
};
