import { head, prop, split } from "ramda";
import {
  getLukumaarakomponentit,
  getMaaraaikakomponentit
} from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/yhteiset/tarkenninkomponentit";
import getOpetustehtavakomponentit from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/esi-ja-perusopetus/1-opetustehtavat";
import getOikeusSisaoppilaitosmuotoiseenKoulutukseen from "./lukiokoulutus/3-oikeusSisaoppilaitosmuotoiseenKoulutukseen";
import getOpetuksenJarjestamismuotokomponentit from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/esi-ja-perusopetus/4-opetuksenjarjestamismuoto";
import getMuutEhdot from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/esi-ja-perusopetus/7-muutEhdot";
// Koulutusmuodoille yhteiset tarkentimet
import getKunnat from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/yhteiset/kunnat";
import getOpetuskielikomponentit from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/yhteiset/opetuskielet";
import getErityisetKoulutustehtavat from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/yhteiset/erityisetKoulutustehtavat";
import getOppilaitokset from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/yhteiset/oppilaitokset";
import { getMaaraaikalomake } from "services/lomakkeet/rajoitteet/rajoitedialogi/tarkenninkomponentit/yhteiset/maaraaika";
import { __ } from "i18n-for-browser";

const tarkenninlomakkeet = {
  // Enintään
  kujalisamaareet_1: getLukumaarakomponentit,
  // Vähintään
  kujalisamaareet_2: getLukumaarakomponentit,
  // Ajalla
  kujalisamaareetlisaksiajalla_1: getMaaraaikakomponentit,

  erityisetKoulutustehtavat: getErityisetKoulutustehtavat,
  muutEhdot: getMuutEhdot,
  oikeusSisaoppilaitosmuotoiseenKoulutukseen: getOikeusSisaoppilaitosmuotoiseenKoulutukseen,
  opetuksenJarjestamismuodot: getOpetuksenJarjestamismuotokomponentit,
  opetuskielet: getOpetuskielikomponentit,
  opetustehtavat: getOpetustehtavakomponentit,
  oppilaitokset: getOppilaitokset,
  toimintaalue: getKunnat,
  maaraaika: getMaaraaikalomake,
  opiskelijamaarat: () => [
    {
      anchor: "komponentti",
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
            label: __("opiskelijamaara.kokonaismaara")
          },
          {
            value: "yksittainen",
            label: __("opiskelijamaara.yksittainenKohdennus")
          }
        ],
        value: []
      }
    }
  ]
};

export const getTarkenninkomponentit = async (
  key,
  locale,
  osioidenData,
  isReadOnly = false,
  koulutustyyppi,
  voidaankoValitaUseita = false,
  inputId
) => {
  if (!key) {
    return false;
  }
  const tarkenninFn = prop(key, tarkenninlomakkeet);
  if (tarkenninFn) {
    return await tarkenninFn(
      isReadOnly,
      prop(head(split("_", key)), osioidenData),
      locale,
      voidaankoValitaUseita,
      inputId,
      koulutustyyppi
    );
  } else {
    console.info(key, "tarkenninkomponentteja ei löytynyt");
    return [];
  }
};
