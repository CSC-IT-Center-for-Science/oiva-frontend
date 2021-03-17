import {
  append,
  assocPath,
  compose,
  concat,
  drop,
  find,
  head,
  includes,
  init,
  join,
  length,
  map,
  path,
  prop,
  propEq,
  split
} from "ramda";

import { getAsetuksenKohdekomponentti } from "./rajoitukset/asetuksenKohdekomponentit";
import { getKohdennuksenKohdekomponentti } from "./rajoitukset/kohdennuksenKohdekomponentit";
import { getKohteenTarkenninkomponentit } from "./kohteenTarkenninkomponentit";
import { getAsetuksenTarkenninkomponentit } from "./rajoitukset/asetuksenTarkenninkomponentit";
import { getKohdennuksenTarkenninkomponentit } from "./rajoitukset/kohdennuksenTarkenninkomponentit";
import { getAnchorPart } from "utils/common";

export const kohdevaihtoehdot = [
  {
    label: "Opetus, jota lupa koskee",
    value: "opetustehtavat"
  },
  {
    label: "Kunnat, joissa opetusta järjestetään",
    value: "toimintaalue"
  },
  { label: "Opetuskieli", value: "opetuskielet" },
  { label: "Opetuksen järjestämismuodot", value: "opetuksenJarjestamismuodot" },
  {
    label: "Erityinen koulutustehtävä",
    value: "erityisetKoulutustehtavat"
  },
  {
    label: "Opiskelijamäärät",
    value: "opiskelijamaarat"
  },
  {
    label: "Muut koulutuksen järjestämiseen liittyvät ehdot",
    value: "muutEhdot"
  }
];

const bgColorClassesByIndex = {
  "0": "bg-gray-100",
  "1": "bg-blue-100",
  "2": "bg-green-100",
  "3": "bg-gray-200",
  "4": "bg-blue-200",
  "5": "bg-green-200"
};

async function getAsetuslomakekokonaisuus(
  rajoiteId,
  rajoiteChangeObjects,
  asetuksenKohdeavain,
  useMultiSelect,
  osioidenData,
  locale,
  onRemoveCriterion,
  isReadOnly = false,
  index = 0,
  lomakerakenne = []
) {
  const inputId = `${asetuksenKohdeavain}-${index}`;
  const asetuksenKohdekomponentti = await getAsetuksenKohdekomponentti(
    asetuksenKohdeavain,
    isReadOnly,
    locale,
    index,
    `asetuksenKohde-${inputId}`
  );

  const asetuksenTarkenninlomakkeenAvain =
    path(
      ["asetukset", index, "kohde", "properties", "value", "value"],
      rajoiteChangeObjects
    ) || path(["properties", "value", "value"], asetuksenKohdekomponentti);

  const asetuksenTarkenninkomponentit = asetuksenTarkenninlomakkeenAvain
    ? await getAsetuksenTarkenninkomponentit(
        asetuksenTarkenninlomakkeenAvain,
        useMultiSelect,
        locale,
        osioidenData,
        isReadOnly,
        `asetuksenTarkennin-${inputId}`
      )
    : [];

  // console.group();
  // console.info("Index:", index);
  // console.info("Asetuksen kohdeavain:", asetuksenKohdeavain);
  // console.info("Asetuksen kohdekomponentti:", asetuksenKohdekomponentti);
  // console.info(
  //   "Asetuksen tarkentimen avain:",
  //   asetuksenTarkenninlomakkeenAvain
  // );
  // console.info(
  //   "Asetuksen tarkenninkomponentit:",
  //   asetuksenTarkenninkomponentit
  // );
  // console.info("rajoiteChangeObjects:", rajoiteChangeObjects);
  // console.groupEnd();

  const updatedLomakerakenne =
    asetuksenKohdekomponentti || !!length(asetuksenTarkenninkomponentit)
      ? append(
          {
            anchor: index,
            title: `${index + 1})`,
            layout: { indentation: "none" },
            components: asetuksenKohdekomponentti
              ? [asetuksenKohdekomponentti]
              : [],
            categories: [
              {
                anchor: "tarkennin",
                layout: {
                  components: { justification: "start" },
                  indentation: "none"
                },
                components: asetuksenTarkenninkomponentit
              }
            ]
          },
          lomakerakenne
        )
      : lomakerakenne;

  const asetuksetLength = Object.keys(
    prop("asetukset", rajoiteChangeObjects) || {}
  ).length;

  if (index < asetuksetLength - 1) {
    // const asetuksenKohdeavain = prop("asetukset", rajoiteChangeObjects)
    //   ? path(
    //       ["asetukset", `${index}`, "kohde", "properties", "value", "value"],
    //       rajoiteChangeObjects
    //     )
    //   : asetuksenKohdeavain;

    return getAsetuslomakekokonaisuus(
      rajoiteId,
      rajoiteChangeObjects,
      asetuksenKohdeavain,
      useMultiSelect,
      osioidenData,
      locale,
      onRemoveCriterion,
      isReadOnly,
      index + 1,
      updatedLomakerakenne
    );
  }

  // console.info(updatedLomakerakenne);

  return updatedLomakerakenne;
}

const getKohdennuksetRecursively = async (
  kohdennustaso = 0,
  kohdennuksenKohdeavain,
  data,
  { isReadOnly },
  locale,
  changeObjects,
  { lisaaKohdennus, onAddCriterion, onRemoveCriterion },
  kohdennuksetChangeObjects = [],
  parentKohdennuksetChangeObjects = [],
  kohdennusindeksipolku = ["0"],
  index = 0,
  ensimmaisenKohdennuksenKohteenTarkenninavain,
  lomakerakenne = []
) => {
  const { osioidenData, rajoiteId } = data;

  const kohdennuksenKohdekomponentti = kohdennuksenKohdeavain
    ? await getKohdennuksenKohdekomponentti(isReadOnly, locale)
    : null;

  const kohdennuksenTarkenninKomponentit = kohdennuksenKohdekomponentti
    ? getKohdennuksenTarkenninkomponentit("joistaEnintaan", locale)
    : [];

  /**
   * Käydään noutamassa lomakerakenne rajoitusavaimen avulla. Rajoitusavain
   * voi olla esim. maaraaika tai opetustaAntavatKunnat.
   */
  const rajoiteChangeObjects = path(
    [index, "rajoite"],
    kohdennuksetChangeObjects
  );

  const kohteenTarkenninavain = path(
    ["kohde", "valikko", "properties", "value", "value"],
    rajoiteChangeObjects
  );

  const kohteenAvain = path(
    [
      "kohde",
      "tarkennin",
      kohteenTarkenninavain,
      "properties",
      "value",
      "value"
    ],
    rajoiteChangeObjects
  );

  const useMultiselect = includes("opiskelijamaarat", [
    kohteenAvain,
    kohdennuksenKohdeavain,
    kohteenTarkenninavain
  ]);

  const kohteenTarkenninkomponentit = await getKohteenTarkenninkomponentit(
    osioidenData,
    kohteenTarkenninavain,
    locale,
    isReadOnly,
    useMultiselect,
    kohdennusindeksipolku
  );

  let ensimmaisenAsetuksenKohdeavain =
    length(kohdennusindeksipolku) % 2 ? kohdennuksenKohdeavain : kohteenAvain;

  // Usein rajoituksen tarkentimen arvo on numeerinen, jolloin
  // 1. asetuksen kohdeavaimena tulee käyttäärajoitteen kohteen
  // arvoa. Esim. esiopetus = 6 (koodiarvo). Koodiarvolla ei
  // löydy asetuskomponentteja, mutta opetustehtavat (edellinen
  // pudotusvalikko) -avaimella löytyy.
  if (ensimmaisenAsetuksenKohdeavain !== "kokonaismaara") {
    ensimmaisenAsetuksenKohdeavain = path(
      ["kohde", "valikko", "properties", "value", "value"],
      rajoiteChangeObjects
    );
  }

  const alikohdennuksetChangeObjects = path(
    [index, "kohdennukset"],
    kohdennuksetChangeObjects
  );

  const asetuslomakekokonaisuus = await getAsetuslomakekokonaisuus(
    rajoiteId,
    rajoiteChangeObjects,
    ensimmaisenAsetuksenKohdeavain,
    true,
    osioidenData,
    locale,
    onRemoveCriterion,
    isReadOnly
  );

  const asetusvaihtoehdot = path(
    ["0", "components", "0", "properties", "options"],
    asetuslomakekokonaisuus
  );

  let lukumaarakomponentit = [];

  // Yksi ehto kohdistuksen lisäyspainikkeen näkymiseen on se, onko
  // kriteereiden joukossa vähintään yksi lukumääräkenttä. Se selvitetään
  // tässä.
  for (let i = 0; i < asetuslomakekokonaisuus.length; i += 1) {
    lukumaarakomponentit = map(category => {
      return (
        category.anchor === "tarkennin" &&
        find(propEq("anchor", "lukumaara"), category.components)
      );
    }, asetuslomakekokonaisuus[i].categories).filter(Boolean);
    if (length(lukumaarakomponentit)) {
      break;
    }
  }

  // console.group();
  // console.info("Index", index);
  // console.info("Lukumaarakomponentit:", lukumaarakomponentit);
  // console.info(
  //   "Asetuslomakekokonaisuus:",
  //   JSON.stringify(asetuslomakekokonaisuus)
  // );
  // console.info("Asetusvaihtoehdot (1. asetus)", asetusvaihtoehdot);
  // console.info("Kohdennusindeksipolku", kohdennusindeksipolku);
  // console.info(
  //   "Muutosobjektit tasoa ylempänä:",
  //   parentKohdennuksetChangeObjects
  // );
  // console.info("kohdennuksetChangeObjects", kohdennuksetChangeObjects);
  // console.info("RajoiteChangeObjects", rajoiteChangeObjects);
  // console.info("kohdennuksen kohdeavain", kohdennuksenKohdeavain);
  // console.info("kohdennuksen kohdekomponentti", kohdennuksenKohdekomponentti);
  // console.info(
  //   "kohdennuksen tarkenninkomponentit",
  //   kohdennuksenTarkenninKomponentit
  // );
  // console.info("Kohteen tarkenninavain", kohteenTarkenninavain);
  // console.info("Kohdevaihtoehdot", kohdevaihtoehdot);
  // console.info("Kohteen tarkenninkomponentit", kohteenTarkenninkomponentit);
  // console.info("1. asetuksen kohdeavain", ensimmaisenAsetuksenKohdeavain);
  // console.info(
  //   "1. kohdennuksen kohteen tarkenninavain",
  //   ensimmaisenKohdennuksenKohteenTarkenninavain
  // );
  // console.info("alikohdennuksetChangeObjects", alikohdennuksetChangeObjects);
  // console.groupEnd();

  const paivitettyLomakerakenne = append(
    {
      anchor: "kohdennukset",
      // title: "Kohdennukset",
      layout: { indentation: "none" },
      styleClasses: isReadOnly
        ? []
        : [
            bgColorClassesByIndex[String(length(kohdennusindeksipolku) - 1)]
          ].filter(Boolean),
      components: [],
      categories: [
        {
          // index on kohdennuksen juokseva järjestysnumero
          anchor: String(index),
          layout: { indentation: isReadOnly ? "none" : undefined },
          styleClasses: isReadOnly
            ? []
            : [
                "border-t",
                length(kohdennusindeksipolku) === 1 ? "border-b" : "",
                "border-gray-300"
              ],
          title: `Kohdennus ${join(
            ".",
            map(value => {
              return String(parseInt(value, 10) + 1);
            }, kohdennusindeksipolku)
          )}`,
          components: kohdennuksenKohdekomponentti
            ? [kohdennuksenKohdekomponentti]
            : [],
          categories: concat(
            [
              {
                anchor: "tarkennin",
                layout: { indentation: "none" },
                isRemovable: true,
                components: kohdennuksenTarkenninKomponentit
              },
              {
                anchor: "rajoite",
                layout: { indentation: "none" },
                categories: [
                  {
                    anchor: "kohde",
                    layout: { indentation: "none" },
                    title: "Rajoituksen kohde",
                    components: [
                      {
                        anchor: "valikko",
                        name: "Autocomplete",
                        styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
                        properties: {
                          inputId: `kohde-${join("-", kohdennusindeksipolku)}`,
                          isMulti: false,
                          isReadOnly,
                          isVisible: !isReadOnly,
                          options: kohdevaihtoehdot
                        }
                      }
                    ],
                    categories:
                      length(kohteenTarkenninkomponentit) > 0
                        ? [
                            {
                              anchor: "tarkennin",
                              layout: { indentation: "none" },
                              components: kohteenTarkenninkomponentit
                            }
                          ]
                        : []
                  },
                  ensimmaisenAsetuksenKohdeavain
                    ? {
                        anchor: "asetukset",
                        title: "Rajoitekriteerit",
                        categories: asetuslomakekokonaisuus
                      }
                    : null
                ].filter(Boolean)
              },
              {
                anchor: "kohdennuksenLisaaminen",
                styleClasses: ["flex justify-end py-6 pr-8"],
                components: [
                  {
                    anchor: "painike",
                    name: "SimpleButton",
                    onClick: payload => {
                      const kohdennusId = getAnchorPart(payload.fullAnchor, 2);
                      return lisaaKohdennus({
                        ...payload,
                        metadata: {
                          ...payload.metadata,
                          rajoiteId: data.rajoiteId,
                          kohdennusId,
                          kohdennusindeksipolku
                        }
                      });
                    },
                    properties: {
                      isVisible:
                        !isReadOnly &&
                        kohteenAvain !== "yksittainen" &&
                        kohdennustaso === 0 &&
                        (kohdennuksenKohdeavain === "kokonaismaara" ||
                          kohdennuksenKohdeavain === "opiskelijamaarat" ||
                          !!length(lukumaarakomponentit)),
                      text: "Lisää kohdennus"
                    }
                  },
                  ((!!length(asetusvaihtoehdot) &&
                    length(asetuslomakekokonaisuus) <
                      length(asetusvaihtoehdot)) ||
                    kohteenAvain === "yksittainen") &&
                  !isReadOnly
                    ? {
                        anchor: "lisaa-asetus",
                        name: "SimpleButton",
                        styleClasses: ["ml-4"],
                        onClick: payload => {
                          console.info(payload.fullAnchor);
                          const kohdennusId = getAnchorPart(
                            payload.fullAnchor,
                            2
                          );
                          return onAddCriterion({
                            ...payload,
                            metadata: {
                              ...payload.metadata,
                              rajoiteId: data.rajoiteId,
                              kohdennusId,
                              kohdennusindeksipolku
                            }
                          });
                        },
                        properties: {
                          text: "Lisää kriteeri"
                        }
                      }
                    : null
                ].filter(Boolean)
              }
            ],
            alikohdennuksetChangeObjects
              ? await getKohdennuksetRecursively(
                  kohdennustaso + 1,
                  ensimmaisenAsetuksenKohdeavain || kohdennuksenKohdeavain,
                  data,
                  { isReadOnly },
                  locale,
                  changeObjects,
                  { lisaaKohdennus, onAddCriterion, onRemoveCriterion },
                  alikohdennuksetChangeObjects,
                  kohdennuksetChangeObjects,
                  append("0", kohdennusindeksipolku)
                )
              : []
          )
        }
      ]
    },
    lomakerakenne
  );

  // Jos kohdennuksia on luotu lisää, otetaan nekin mukaan lopulliseeen
  // palautettavaan lomakerakenteeseen.
  if (prop(index + 1, kohdennuksetChangeObjects)) {
    return getKohdennuksetRecursively(
      kohdennustaso,
      kohdennuksenKohdeavain,
      data,
      { isReadOnly },
      locale,
      changeObjects,
      { lisaaKohdennus, onAddCriterion, onRemoveCriterion },
      kohdennuksetChangeObjects,
      parentKohdennuksetChangeObjects,
      append(String(index + 1), init(kohdennusindeksipolku)),
      index + 1,
      ensimmaisenKohdennuksenKohteenTarkenninavain,
      paivitettyLomakerakenne
    );
  }

  return paivitettyLomakerakenne;
};

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
  booleans,
  locale,
  changeObjects,
  functions
) {
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
  const kohdennuksetChangeObjects = prop("kohdennukset", groupedChangeObjects);

  /**
   * Palautettava lomakemerkkaus
   */
  let lomakerakenne = await getKohdennuksetRecursively(
    0,
    null,
    data,
    booleans,
    locale,
    changeObjects,
    functions,
    kohdennuksetChangeObjects
  );

  return lomakerakenne;
}
