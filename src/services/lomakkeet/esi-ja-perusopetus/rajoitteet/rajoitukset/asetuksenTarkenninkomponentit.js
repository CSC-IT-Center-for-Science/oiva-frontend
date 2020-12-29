import { prop } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "./tarkenninkomponentit";
import getOpetustehtavakomponentit from "./1-opetustehtavat";
import getOpetustaAntavatKunnat from "./2-opetustaAntavatKunnat";
import getOpetuskielikomponentit from "./3-opetuskielet";
import getOpetuksenJarjestamismuotokomponentit from "./4-opetuksenjarjestamismuoto";
import getErityisetKoulutustehtavat from "./5-erityisetKoulutustehtavat";
import getMuutEhdot from "./7-muutEhdot";

const asetuksenTarkenninlomakkeet = {
  enintaan: getLukumaarakomponentit,
  erityisetKoulutustehtavat: getErityisetKoulutustehtavat,
  maaraaika: getMaaraaikakomponentit,
  muutEhdot: getMuutEhdot,
  opetuksenJarjestamismuodot: getOpetuksenJarjestamismuotokomponentit,
  opetuskielet: getOpetuskielikomponentit,
  opetustehtavat: getOpetustehtavakomponentit,
  opiskelijamaarat: getLukumaarakomponentit,
  toimintaalue: getOpetustaAntavatKunnat,
  vahintaan: getLukumaarakomponentit
};

export const getAsetuksenTarkenninkomponentit = async (
  asetuksenKohdeavain,
  locale,
  osioidenData
) => {
  if (!asetuksenKohdeavain) {
    return false;
  }
  console.info(asetuksenKohdeavain, osioidenData);
  const tarkenninFn = prop(asetuksenKohdeavain, asetuksenTarkenninlomakkeet);
  return (
    (await tarkenninFn(prop(asetuksenKohdeavain, osioidenData), locale)) || []
  );
};
