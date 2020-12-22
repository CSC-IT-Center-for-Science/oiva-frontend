import { prop } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "./tarkenninkomponentit";

const asetuksenTarkenninlomakkeet = {
  enintaan: getLukumaarakomponentit,
  maaraaika: getMaaraaikakomponentit,
  vahintaan: getLukumaarakomponentit
};

export const getAsetuksenTarkenninkomponentit = (
  asetuksenKohdeavain,
  locale
) => {
  if (!asetuksenKohdeavain) {
    return false;
  }
  const tarkenninFn = prop(asetuksenKohdeavain, asetuksenTarkenninlomakkeet);
  return tarkenninFn(locale) || [];
};
