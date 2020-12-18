import { prop } from "ramda";
import { getLukumaaralomake, getMaaraaikalomake } from "./tarkenninlomakkeet";

const asetuksenTarkenninlomakkeet = {
  enintaan: getLukumaaralomake,
  joistaEnintaan: getLukumaaralomake,
  joistaVahintaan: getLukumaaralomake,
  maaraaika: getMaaraaikalomake,
  vahintaan: getLukumaaralomake
};

export const getAsetuksenTarkenninlomake = (asetuksenKohdeavain, locale) => {
  const tarkenninFn = prop(asetuksenKohdeavain, asetuksenTarkenninlomakkeet);
  return tarkenninFn(locale) || [];
};
