import { getAsetuksenKohdekomponentti } from "./rajoitukset/asetuksenKohdekomponentit";
import { getAsetuksenTarkenninlomake } from "./rajoitukset/asetuksenTarkenninlomake";
import { path } from "ramda";

export async function getAlirajoitelomake(
  data,
  { isReadOnly },
  locale,
  changeObjects,
  { lisaaKriteeri }
) {
  const { osioidenData } = data;
  const kohdekomponentti = getAsetuksenKohdekomponentti("lukumaara");

  const tarkenninavain = path(
    [0, "properties", "value", "value"],
    changeObjects
  );

  const tarkenninkomponentti = tarkenninavain
    ? await getAsetuksenTarkenninlomake(tarkenninavain, locale)
    : null;

  console.info(tarkenninavain, tarkenninkomponentti);

  return [
    {
      anchor: "alirajoite",
      components: [kohdekomponentti],
      categories: tarkenninkomponentti || []
    },
    {
      anchor: "toiminnot",
      components: [
        {
          anchor: "Lisää kriteeri",
          name: "SimpleButton",
          onClick: () => lisaaKriteeri(1), // 1 = alirajoitteen id
          properties: {
            text: "Lisää kriteeri"
          }
        }
      ]
    }
  ];
}

// const rajoite = {
//   id,
//   asetukset,
//   toiminnot: ["lisää kriteeri"]
// }

// RAJOITE -> kohdevaihtoehdot, tarkenninvaihtoehdot
// + lisää kriteeri
// ALIRAJOITE -> kohdevaihtoehdot, tarkenninvaihtoehdot
// + lisää kriteeri
