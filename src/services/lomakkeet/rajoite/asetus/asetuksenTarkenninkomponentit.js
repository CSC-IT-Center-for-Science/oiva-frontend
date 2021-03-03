import { prop } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/tarkenninkomponentit";
import getOpetustehtavakomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/1-opetustehtavat";
import getOpetustaAntavatKunnat from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/2-opetustaAntavatKunnat";
import getOpetuskielikomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/3-opetuskielet";
import getOpetuksenJarjestamismuotokomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/4-opetuksenjarjestamismuoto";
import getErityisetKoulutustehtavat from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/5-erityisetKoulutustehtavat";
import getMuutEhdot from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/7-muutEhdot";
import getOppilaitokset from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/oppilaitokset";

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
