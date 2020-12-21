import { prop } from "ramda";
import { getLukumaaralomake, getMaaraaikalomake } from "./tarkenninlomakkeet";

const asetuksenTarkenninlomakkeet = {
  enintaan: getLukumaaralomake,
  joistaEnintaan: getLukumaaralomake,
  joistaVahintaan: getLukumaaralomake,
  lisaksiEnintaan: getLukumaaralomake,
  lisaksiVahintaan: getLukumaaralomake,
  maaraaika: getMaaraaikalomake,
  vahintaan: getLukumaaralomake
};

export const getAsetuksenTarkenninlomake = (asetuksenKohdeavain, locale) => {
  if (!asetuksenKohdeavain) {
    return false;
  }
  const tarkenninFn = prop(asetuksenKohdeavain, asetuksenTarkenninlomakkeet);
  return tarkenninFn(locale) || [];
};
