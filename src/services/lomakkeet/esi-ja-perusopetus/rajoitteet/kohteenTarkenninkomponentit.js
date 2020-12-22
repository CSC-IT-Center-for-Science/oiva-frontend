import getOpetustehtavatlomake from "./rajoitukset/1-opetustehtavat";
import getOpetustaAntavatKunnat from "./rajoitukset/2-opetustaAntavatKunnat";
import getOpetuskieletlomake from "./rajoitukset/3-opetuskielet";
import getOpetuksenJarjestamismuodotLomake from "./rajoitukset/4-opetuksenjarjestamismuoto";
import getErityisetKoulutustehtavat from "./rajoitukset/5-erityisetKoulutustehtavat";
import getMuutEhdot from "./rajoitukset/7-muutEhdot";
import { getMaaraaikalomake } from "./rajoitukset/maaraaika";
import { prop } from "ramda";

/** 
Oheiset funktiot palauttavat listan kohteen tarkenninvaihtoehdoista.

Tämän objektin järjestyksellä on väliä, vaikka objektin järjestykseen ei
nyrkkisääntönä kannattaisi luottaa.
*/
export const getKohteenTarkenninkomponentit = async (
  osioidenData,
  kohdeavain,
  locale
) => {
  console.info(kohdeavain);
  const komponentitByKey = {
    maaraaika: getMaaraaikalomake,
    opetustehtavat: getOpetustehtavatlomake,
    toimintaalue: getOpetustaAntavatKunnat,
    opetuskielet: getOpetuskieletlomake,
    opetuksenJarjestamismuodot: getOpetuksenJarjestamismuodotLomake,
    erityisetKoulutustehtavat: getErityisetKoulutustehtavat,
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

  const fn = prop(kohdeavain, komponentitByKey);

  return fn ? await fn(osioidenData, locale) : [];
};
