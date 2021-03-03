import getOpetustehtavakomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/1-opetustehtavat";
import getOpetustaAntavatKunnat from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/2-opetustaAntavatKunnat";
import getOpetuskielikomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/3-opetuskielet";
import getOpetuksenJarjestamismuotokomponentit from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/4-opetuksenjarjestamismuoto";
import getErityisetKoulutustehtavat from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/5-erityisetKoulutustehtavat";
import getMuutEhdot from "services/lomakkeet/rajoite/tarkenninkomponentit/esi-ja-perusopetus/7-muutEhdot";
import { getMaaraaikalomake } from "services/lomakkeet/rajoite/tarkenninkomponentit/yhteiset/maaraaika";
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
  isReadOnly = false,
  useMultiselect = false
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

  const fn = prop(kohdeavain, komponentitByKey);

  return fn
    ? await fn(
        isReadOnly,
        prop(kohdeavain, osioidenData),
        locale,
        useMultiselect
      )
    : [];
};
