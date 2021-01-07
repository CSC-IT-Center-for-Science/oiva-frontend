import getOpetustehtavakomponentit from "./rajoitukset/1-opetustehtavat";
import getOpetustaAntavatKunnat from "./rajoitukset/2-opetustaAntavatKunnat";
import getOpetuskielikomponentit from "./rajoitukset/3-opetuskielet";
import getOpetuksenJarjestamismuotokomponentit from "./rajoitukset/4-opetuksenjarjestamismuoto";
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
  locale,
  isReadOnly = false
) => {
  const komponentitByKey = {
    maaraaika: getMaaraaikalomake,
    opetustehtavat: getOpetustehtavakomponentit,
    toimintaalue: getOpetustaAntavatKunnat,
    opetuskielet: getOpetuskielikomponentit,
    opetuksenJarjestamismuodot: getOpetuksenJarjestamismuotokomponentit,
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

  console.info(osioidenData);

  const fn = prop(kohdeavain, komponentitByKey);

  return fn ? await fn(isReadOnly, prop(kohdeavain, osioidenData), locale) : [];
};
