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
import getOppilaitokset from "./oppilaitokset";

const asetuksenTarkenninlomakkeet = {
  // Enintään
  kujalisamaareet_1: getLukumaarakomponentit,
  // Vähintään
  kujalisamaareet_2: getLukumaarakomponentit,
  // Ajalla
  kujalisamaareetlisaksiajalla_1: getMaaraaikakomponentit,

  erityisetKoulutustehtavat: getErityisetKoulutustehtavat,
  muutEhdot: getMuutEhdot,
  opetuksenJarjestamismuodot: getOpetuksenJarjestamismuotokomponentit,
  opetuskielet: getOpetuskielikomponentit,
  opetustehtavat: getOpetustehtavakomponentit,
  opiskelijamaarat: getLukumaarakomponentit,
  oppilaitokset: getOppilaitokset,
  toimintaalue: getOpetustaAntavatKunnat
};

export const getAsetuksenTarkenninkomponentit = async (
  asetuksenKohdeavain,
  useMultiselect,
  locale,
  osioidenData,
  isReadOnly = false
) => {
  if (!asetuksenKohdeavain) {
    return false;
  }
  const tarkenninFn = prop(asetuksenKohdeavain, asetuksenTarkenninlomakkeet);
  if (tarkenninFn) {
    return (
      (await tarkenninFn(
        isReadOnly,
        prop(asetuksenKohdeavain, osioidenData),
        locale,
        useMultiselect
      )) || []
    );
  } else {
    console.warn(asetuksenKohdeavain, "tarkenninkomponentteja ei löytynyt");
    return [];
  }
};
