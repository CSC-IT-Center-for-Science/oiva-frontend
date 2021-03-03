import { prop } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/tarkenninkomponentit";
import getOpetustehtavakomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/1-opetustehtavat";
import getOpetuksenJarjestamismuotokomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/4-opetuksenjarjestamismuoto";
import getMuutEhdot from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/7-muutEhdot";
// Koulutusmuodoille yhteiset tarkentimet
import getKunnat from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/kunnat";
import getOpetuskielikomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/opetuskielet";
import getErityisetKoulutustehtavat from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/erityisetKoulutustehtavat";
import getOppilaitokset from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/oppilaitokset";
import { getMaaraaikalomake } from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/maaraaika";

const tarkenninlomakkeet = {
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
  //   opiskelijamaarat: getLukumaarakomponentit,
  oppilaitokset: getOppilaitokset,
  toimintaalue: getKunnat,
  maaraaika: getMaaraaikalomake,
  opiskelijamaarat: () => [
    {
      anchor: "opiskelijamaarat",
      name: "Autocomplete",
      styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
      properties: {
        forChangeObject: {
          section: "opiskelijamaarat"
        },
        isMulti: false,
        options: [
          {
            value: "kokonaismaara",
            label: "Kokonaisoppilas-/opiskelijamäärä"
          },
          {
            value: "yksittainen",
            label: "Yksittäinen oppilasmääräkohdennus"
          }
        ],
        value: []
      }
    }
  ],
  muutEhdot: getMuutEhdot
};

export const getTarkenninkomponentit = async (
  // getAsetuksenTarkenninkomponentit = async (
  key, // asetuksenKohdeavain,
  locale,
  osioidenData,
  isReadOnly = false
) => {
  if (!key) {
    return false;
  }
  console.info(key);
  const tarkenninFn = prop(key, tarkenninlomakkeet);
  if (tarkenninFn) {
    return (
      (await tarkenninFn(isReadOnly, prop(key, osioidenData), locale)) || []
    );
  } else {
    console.info(key, "tarkenninkomponentteja ei löytynyt");
    return [];
  }
};
