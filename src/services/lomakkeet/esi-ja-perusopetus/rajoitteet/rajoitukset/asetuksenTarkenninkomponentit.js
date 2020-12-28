import { prop } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "./tarkenninkomponentit";
import getOpetustaAntavatKunnat from "./2-opetustaAntavatKunnat";

const asetuksenTarkenninlomakkeet = {
  enintaan: getLukumaarakomponentit,
  maaraaika: getMaaraaikakomponentit,
  toimintaalue: getOpetustaAntavatKunnat,
  vahintaan: getLukumaarakomponentit
};

export const getAsetuksenTarkenninkomponentit = (
  asetuksenKohdeavain,
  locale,
  osioidenData
) => {
  if (!asetuksenKohdeavain) {
    return false;
  }
  console.info(asetuksenKohdeavain, osioidenData);
  const tarkenninFn = prop(asetuksenKohdeavain, asetuksenTarkenninlomakkeet);
  return tarkenninFn(prop(asetuksenKohdeavain, osioidenData), locale) || [];
};
