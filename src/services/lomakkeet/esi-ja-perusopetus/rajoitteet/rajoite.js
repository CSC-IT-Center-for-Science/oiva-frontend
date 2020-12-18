import {
  append,
  assocPath,
  compose,
  drop,
  filter,
  head,
  includes,
  isEmpty,
  map,
  nth,
  path,
  prop,
  split,
  startsWith
} from "ramda";

import { getKokonaisopiskelijamaaralomake } from "./rajoitukset/6-opiskelijamaarat";
import { getAsetuksenKohdekomponentti } from "./rajoitukset/asetuksenKohdekomponentit";
import { getKohteenTarkenninlomake } from "./kohteenTarkenninlomake";
import { getAnchorPart } from "utils/common";
import { getAsetuksenTarkenninlomake } from "./rajoitukset/asetuksenTarkenninlomake";

const kohdevaihtoehdot = [
  {
    label: "Opetus, jota lupa koskee",
    value: "opetustehtavat"
  },
  {
    label: "Opiskelijamäärät",
    value: "opiskelijamaarat"
  }
];

const asetuslomakkeet = {
  opiskelijamaarastrategia: getKokonaisopiskelijamaaralomake
};

/**
 * Rajoitekriteereiden näyttäminen
 * @param {*} asetus
 * @param {*} locale
 * @param {*} changeObjects
 * @param {*} onRemoveCriterion
 */
async function getYksittainenAsetuslomake(
  osioidenData,
  asetus,
  locale,
  onRemoveCriterion,
  asetusvaihtoehdot
) {
  /**
   * Ensimmäistä asetusta ei voi käyttäliittymässä poistaa. Kun uutta
   * rajoitetta luodaan, näytetään käyttäjälle 1. asetuksen kohdekenttä, joka
   * on pudotusvalikko. Kun käyttäjä on valinnut kohteen, hänelle näytetään
   * ensimmäisen asetuksen rajoituskenttä. Rajoituskentän tyyppi ja sisältö
   * määrittyvät sen mukaan, mikä on tai mitkä ovat:
   *
   * 1. Asetuksen kohde.
   * 2. Käyttäjän lomakkeella tekemät muutokset.
   * 3. Lupaan kuuluvat määritykset (toteutetaan myöhemmin).
   *
   * Määritetään asetuksen rajoitusosaa vastaava lomakerakenne, mikäli
   * kohde on tiedossa.
   */
  if (asetus.kohde) {
    /**
     * Käydään noutamassa lomakerakenne rajoitusavaimen avulla. Rajoitusavain
     * voi olla esim. maaraaika tai opetustaAntavatKunnat.
     */
    const rajoitusavain = path(
      ["kohde", "A", "properties", "value", "value"],
      asetus
    );

    console.info(asetus.id, rajoitusavain);
    /**
     * Mikäli itse rajoitusta on muokattu, on siitä olemassa muutosobjekti.
     */
    const rajoitus = rajoitusavain
      ? await asetuslomakkeet[asetus.id](osioidenData[rajoitusavain], locale)
      : null;

    return {
      anchor: asetus.id,
      categories: [
        {
          anchor: "kohde",
          layout: { indentation: "none" },
          components: [
            {
              anchor: "A",
              name: "Autocomplete",
              styleClasses: ["mb-6 w-4/5 xl:w-2/3"],
              properties: {
                isMulti: false,
                options: asetusvaihtoehdot,
                title: "Rajoitekriteeri"
              }
            }
          ]
        },
        // Lisätään lomakerakenteeseen rajoituskenttä, jonka sisältö määrittyy sitä edeltävän kohdekentän perusteella
        rajoitusavain && asetus.rajoitus ? rajoitus : null
      ].filter(Boolean),
      isRemovable: asetus.id !== "0",
      onRemove: category => {
        onRemoveCriterion(asetus.id);
      },
      title: `Rajoitekriteeri ${asetus.id}`
    };
  }
  return null;
}

async function getAsetuslomakekokonaisuus(
  rajoiteId,
  kohdeavain,
  kohteenTarkenninavain,
  groupedChangeObjects,
  osioidenData,
  locale,
  onRemoveCriterion,
  index = 0,
  lomakerakenne = []
) {
  console.info(kohteenTarkenninavain, groupedChangeObjects);
  const asetuksenKohdeavain = path(
    [
      rajoiteId,
      "asetukset",
      `${index}`,
      "kohde",
      "properties",
      "value",
      "value"
    ],
    groupedChangeObjects
  );
  const asetuksenKohdekomponentti = getAsetuksenKohdekomponentti(
    kohteenTarkenninavain,
    kohdeavain
  );
  const asetuksenTarkenninlomake = getAsetuksenTarkenninlomake(
    asetuksenKohdeavain ||
      path(["properties", "value", "value"], asetuksenKohdekomponentti),
    locale
  );

  console.info(
    asetuksenKohdekomponentti,
    asetuksenKohdeavain,
    asetuksenTarkenninlomake
  );

  // {
  //   anchor: "asetukset",
  //   title: "Rajoitekriteerit",
  //   components: [asetuksenKohdekomponentti],
  //   categories: getAsetuksenTarkenninlomake(tarkennusavain)
  // }

  // const initialAsetus = nth(index, asetukset || []);
  // if (initialAsetus && !isEmpty(groupedChangeObjects)) {
  //   const asetusChangeObj = groupedChangeObjects[rajoiteId].asetukset
  //     ? groupedChangeObjects[rajoiteId].asetukset[initialAsetus.id]
  //     : {};
  //   const asetus = Object.assign({}, initialAsetus, asetusChangeObj);

  //   const updatedStructure = append(
  //     await getYksittainenAsetuslomake (
  //       osioidenData,
  //       asetus,
  //       locale,
  //       onRemoveCriterion,
  //       asetusvaihtoehdot
  //     ),
  //     structure
  //   );

  //   return getAsetuslomakekokonaisuus(
  //     osioidenData,
  //     rajoiteId,
  //     groupedChangeObjects,
  //     locale,
  //     onRemoveCriterion,
  //     index + 1,
  //     updatedStructure
  //   );
  // }

  // return structure;
  return [
    {
      anchor: index,
      title: `${index + 1})`,
      layout: { indentation: "none" },
      components: [asetuksenKohdekomponentti],
      categories: asetuksenTarkenninlomake
    }
  ];
}

/**
 * Lomake, joka funktion palauttaman rakenteen myötä muodostetaan, mahdollistaa
 * sen, että käyttäjä voi luoda asetuksia, jotka yhdessä muodostavat rajoitteen.
 * Jotta rajoitetta voidaan hyödyntää, tulee sen sisältää vähintään kaksi
 * asetusta.
 *
 * Esimerkkejä yksittäisestä asetuksesta:
 *
 * Esimerkki 1:

 * Kohde: Kunnat, joissa opetusta järjestetään
 * Rajoitus: Kuopio, Pielavesi, Siilinjärvi
 *
 * Esimerkki 2:
 *
 * Kohde: Määräaika
 * Rajoitus: 20.9.2021 - 14.3.2022
 *
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 * @param {*} changeObjects
 */
export async function rajoitelomake(
  data,
  { isReadOnly },
  locale,
  changeObjects,
  { onAddCriterion, onRemoveCriterion }
) {
  // const kohde = Object.assign({}, initialAsetus, asetusChangeObj);

  // let updatedSectionsList = { ...sections };
  // if (valittuOpiskelijamaarastrategia === "kokonaismaara") {
  //   updatedSectionsList = {
  //     ...sections,
  //     kokonaisopiskelijamaara: getKokonaisopiskelijamaaralomake
  //   };
  // } else if (valittuOpiskelijamaarastrategia === "vainKohdennetut") {
  //   updatedSectionsList = {
  //     ...sections,
  //     opiskelijamaarat: getOpiskelijaMaarat
  //   };
  // }

  const { lomakedata, osioidenData, rajoiteId } = data;

  const asetuksetChangeObjects = filter(
    cObj =>
      startsWith(`rajoitelomake.${rajoiteId}.asetukset`, cObj.anchor) &&
      !startsWith(`rajoitelomake.${rajoiteId}.asetukset.kohde`, cObj.anchor) &&
      !includes("rajoitus", cObj.anchor),
    changeObjects
  );

  // Rajoitekriteerivaihtoehdot muodostetaan tässä
  // const addedRajoitteet = map(cObj => {
  //   return {
  //     id: getAnchorPart(cObj.anchor, 3),
  //     kohde: {
  //       components: [
  //         {
  //           anchor: "A",
  //           name: "Autocomplete",
  //           properties: {
  //             isMulti: false,
  //             options: asetusvaihtoehdot,
  //             title: "Kohde"
  //           }
  //         }
  //       ]
  //     },
  //     rajoitus: {}
  //   };
  // }, kohdeChangeObjects || []).filter(Boolean);

  // const asetukset = {
  //   [rajoiteId]: addedRajoitteet
  // };

  // console.info(asetukset);

  function groupChangeObjects(changeObjects, index = 0, result = {}) {
    const changeObj = head(changeObjects);
    if (changeObj) {
      const fn = compose(
        assocPath,
        drop(1),
        split("."),
        prop("anchor")
      )(changeObj);
      const updatedResult = fn(changeObj, result);
      return groupChangeObjects(
        drop(1, changeObjects),
        index + 1,
        updatedResult
      );
    }
    return result;
  }

  const groupedChangeObjects = groupChangeObjects(changeObjects);

  console.info(groupedChangeObjects);

  /**
   * Käydään noutamassa lomakerakenne rajoitusavaimen avulla. Rajoitusavain
   * voi olla esim. maaraaika tai opetustaAntavatKunnat.
   */
  const kohdeavain = path(
    [rajoiteId, "kohde", "valikko", "properties", "value", "value"],
    groupedChangeObjects
  );

  const kohteenTarkenninLomake = await getKohteenTarkenninlomake(
    osioidenData,
    kohdeavain,
    locale
  );

  const kohteenTarkenninavain = path(
    [
      rajoiteId,
      "kohde",
      "tarkennin",
      kohdeavain,
      "properties",
      "value",
      "value"
    ],
    groupedChangeObjects
  );

  console.info(kohteenTarkenninLomake, kohdeavain, kohteenTarkenninavain);

  // const initialAsetus = nth(index, asetukset || []);
  //   if (initialAsetus && !isEmpty(groupedChangeObjects)) {
  //     const asetusChangeObj = groupedChangeObjects[rajoiteId].asetukset
  //       ? groupedChangeObjects[rajoiteId].asetukset[initialAsetus.id]
  //       : {};
  //     const asetus = Object.assign({}, initialAsetus, asetusChangeObj);

  // const kohdeChangeObj = find(
  //   obj =>
  //     obj.anchor === `${data.sectionId}.${data.rajoiteId}.asetukset.kohde.A`,
  //   changeObjects
  // );

  // const rajoitus = rajoitusavain
  //   ? await getKohteenTarkenninlomake[rajoitusavain](
  //       osioidenData[rajoitusavain],
  //       locale
  //     )
  //   : null;

  /**
   * Palautettava lomakemerkkaus
   */
  const lomakerakenne = [
    {
      anchor: data.rajoiteId,
      categories: [
        {
          anchor: "kohde",
          title: "Rajoituksen kohde",
          components: [
            {
              anchor: "valikko",
              name: "Autocomplete",
              styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
              properties: {
                isMulti: false,
                options: kohdevaihtoehdot
              }
            }
          ],
          categories: kohteenTarkenninLomake
        },
        kohteenTarkenninavain
          ? {
              anchor: "asetukset",
              title: "Rajoitekriteerit",
              categories: await getAsetuslomakekokonaisuus(
                rajoiteId,
                kohdeavain,
                kohteenTarkenninavain,
                groupedChangeObjects,
                osioidenData,
                locale,
                onRemoveCriterion
              )
            }
          : []
      ]
    }
  ];

  //     rajoitus ? rajoitus : {},
  //     await defineRajoituksetStructure(
  //       osioidenData,
  //       data.rajoiteId,
  //       asetukset[data.rajoiteId],
  //       groupedChangeObjects,
  //       locale,
  //       onRemoveCriterion,
  //       asetusvaihtoehdot
  //     ),
  //     {
  //       anchor: "asetuksenLisaaminen",
  //       styleClasses: ["mt-6"],
  //       components: [
  //         {
  //           anchor: "painike",
  //           name: "SimpleButton",
  //           onClick: payload => {
  //             return onAddCriterion({
  //               ...payload,
  //               metadata: {
  //                 ...payload.metadata,
  //                 rajoiteId: data.rajoiteId
  //               }
  //             });
  //           },
  //           properties: {
  //             isVisible: true,
  //             text: "Lisää rajoitekriteeri"
  //           }
  //         }
  //       ]
  //     }
  //   ]),
  //   title: "Asetukset"
  // }

  return lomakerakenne;
}
