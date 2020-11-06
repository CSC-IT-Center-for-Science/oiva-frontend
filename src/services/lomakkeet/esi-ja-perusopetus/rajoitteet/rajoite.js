import {
  append,
  assocPath,
  compose,
  drop,
  flatten,
  head,
  isEmpty,
  mapObjIndexed,
  nth,
  path,
  prop,
  split,
  values
} from "ramda";
import maaraaika from "./rajoitukset/maaraaika";
import opetustaAntavatKunnat from "./rajoitukset/2-opetustaAntavatKunnat";
import opetuksenJarjestamismuoto from "./rajoitukset/4-opetuksenjarjestamismuoto";
import opetuskielet from "./rajoitukset/3-opetuskielet";
import opetustehtavat from "./rajoitukset/1-opetustehtavat";
import getOpetustehtavatLomake from "./rajoitukset/1-opetustehtavat";

const localizations = {
  maaraaika: "Määräaika",
  opetustaAntavatKunnat: "2. Kunnat, joissa opetusta järjestetään",
  opetuksenJarjestamismuoto: "4. Opetuksen järjestämismuoto",
  opetuskielet: "3. Opetuskieli",
  opetustehtavat: "1. Opetus, jota lupa koskee"
};

const changeObjectMapping = {
  maaraaika: "maaraaika",
  opetustaAntavatKunnat: "toimintaalue",
  opetuksenJarjestamismuoto: "opetuksenJarjestamismuodot",
  opetuskielet: "opetuskielet",
  opetustehtavat: "opetustehtavat"
};

const sections = {
  maaraaika,
  opetustehtavat,
  opetustaAntavatKunnat,
  opetuskielet,
  opetuksenJarjestamismuoto,
};

async function defineRajoitusStructure(
  asetus,
  locale,
  changeObjects,
  onRemoveCriterion
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
    /**
     * Mikäli itse rajoitusta on muokattu, on siitä olemassa muutosobjekti.
     */
    const rajoitus =
      rajoitusavain && asetus.rajoitus
        ? await sections[rajoitusavain](
            asetus,
            path([changeObjectMapping[rajoitusavain]], changeObjects),
            locale
          )
        : null;
    console.info(rajoitus, rajoitusavain);
    return {
      anchor: asetus.id,
      categories: [
        {
          anchor: "kohde",
          components: [
            {
              anchor: "A",
              name: "Autocomplete",
              properties: {
                isMulti: false,
                options: values(
                  mapObjIndexed((categoryFn, key) => {
                    return key !== rajoitusavain
                      ? {
                          label: localizations[key],
                          value: key
                        }
                      : null;
                  }, sections)
                ).filter(Boolean),
                title: asetus.id === "0" ? "Kohde" : "Rajoitekriteeri"
              }
            }
          ]
        },
        rajoitusavain && asetus.rajoitus ? rajoitus : null
      ].filter(Boolean),
      isRemovable: asetus.id !== "0",
      onRemove: category => {
        onRemoveCriterion(asetus.id);
      },
      title:
        asetus.id === "0" ? "Rajoituksen kohde" : `Rajoitekriteeri ${asetus.id}`
    };
  }
  return null;
}

async function defineRajoituksetStructure(
  rajoiteId,
  asetukset,
  groupedChangeObjects,
  locale,
  changeObjects,
  onRemoveCriterion,
  index = 0,
  structure = []
) {
  const initialAsetus = nth(index, asetukset);
  if (initialAsetus && !isEmpty(groupedChangeObjects)) {
    console.info(initialAsetus, groupedChangeObjects[rajoiteId].asetukset);
    const asetusChangeObj = groupedChangeObjects[rajoiteId].asetukset
      ? groupedChangeObjects[rajoiteId].asetukset[initialAsetus.id]
      : {};
    const asetus = Object.assign({}, initialAsetus, asetusChangeObj);

    const updatedStructure = append(
      await defineRajoitusStructure(
        asetus,
        locale,
        changeObjects,
        onRemoveCriterion
      ),
      structure
    );

    return defineRajoituksetStructure(
      rajoiteId,
      asetukset,
      groupedChangeObjects,
      locale,
      changeObjects,
      onRemoveCriterion,
      index + 1,
      updatedStructure
    );
  }

  console.info(structure);

  return structure;
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
export async function rajoitelomake(data, isReadOnly, locale, changeObjects) {
  const asetukset = {
    eka: [
      {
        id: "0",
        kohde: {
          A: "opetustaAntavatKunnat"
        },
        rajoitus: {
          opetustaAntavatKunnat: []
        }
      },
      {
        id: "1",
        kohde: {
          A: "opetustehtavat"
        },
        rajoitus: {
          opetustehtavat: []
        }
      }
    ]
  };

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
   * Palautettava lomakemerkkaus
   */
  const lomakerakenne = [
    {
      anchor: data.rajoiteId,
      categories: [
        {
          anchor: "asetukset",
          categories: flatten([
            await defineRajoituksetStructure(
              data.rajoiteId,
              asetukset[data.rajoiteId],
              groupedChangeObjects,
              locale,
              data.changeObjects,
              data.onRemoveCriterion
            ),
            {
              anchor: "asetuksenLisaaminen",
              components: [
                {
                  anchor: "painike",
                  name: "SimpleButton",
                  onClick: payload =>
                    data.onAddCriterion({
                      ...payload,
                      metadata: {
                        ...payload.metadata,
                        rajoiteId: data.rajoiteId
                      }
                    }),
                  properties: {
                    isVisible: true,
                    text: "Lisää rajoitekriteeri"
                  }
                }
              ]
            }
          ]),
          title: "Asetukset"
        }
      ].filter(Boolean)
    }
  ];

  console.info("Lomakkeen rakenne: ", lomakerakenne);

  return lomakerakenne;
}
