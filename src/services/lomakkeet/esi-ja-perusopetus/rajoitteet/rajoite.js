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
  values,
  find,
  map,
  filter,
  startsWith,
  includes
} from "ramda";
import erityisetKoulutustehtavat from "./rajoitukset/5-erityisetKoulutustehtavat";
import { getMaaraaikalomake } from "./rajoitukset/maaraaika";
import getOpetustaAntavatKunnat from "./rajoitukset/2-opetustaAntavatKunnat";
import getOpetuksenJarjestamismuodotLomake from "./rajoitukset/4-opetuksenjarjestamismuoto";
import getOpetuskieletlomake from "./rajoitukset/3-opetuskielet";
import muutEhdot from "./rajoitukset/7-muutEhdot";
import opiskelijamaarat from "./rajoitukset/6-opiskelijamaarat";
import getOpetustehtavatlomake from "./rajoitukset/1-opetustehtavat";
import { getAnchorPart } from "../../../../utils/common";

const localizations = {
  maaraaika: "Määräaika",
  opetustehtavat: "1. Opetus, jota lupa koskee",
  erityisetKoulutustehtavat: "5. Erityinen koulutustehtävä",
  toimintaalue: "2. Kunnat, joissa opetusta järjestetään",
  opetuksenJarjestamismuodot: "4. Opetuksen järjestämismuoto",
  opetuskielet: "3. Opetuskieli",
  muutEhdot: "7. Muut koulutuksen järjestämiseen liittyvät ehdot",
  opiskelijamaarat: "6. Oppilas-/opiskelijamäärät"
};

const sections = {
  maaraaika: getMaaraaikalomake,
  opetustehtavat: getOpetustehtavatlomake,
  toimintaalue: getOpetustaAntavatKunnat,
  opetuskielet: getOpetuskieletlomake,
  opiskelijamaarat,
  opetuksenJarjestamismuodot: getOpetuksenJarjestamismuodotLomake,
  erityisetKoulutustehtavat,
  muutEhdot
};

/**
 * Rajoitekriteereiden näyttäminen
 * @param {*} asetus
 * @param {*} locale
 * @param {*} changeObjects
 * @param {*} onRemoveCriterion
 */
async function defineRajoitusStructure(
  osioidenData,
  asetus,
  locale,
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
    const rajoitus = rajoitusavain
      ? await sections[rajoitusavain](osioidenData[rajoitusavain], locale)
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

async function defineRajoituksetStructure(
  osioidenData,
  rajoiteId,
  asetukset,
  groupedChangeObjects,
  locale,
  onRemoveCriterion,
  index = 0,
  structure = []
) {
  const initialAsetus = nth(index, asetukset || []);
  if (initialAsetus && !isEmpty(groupedChangeObjects)) {
    const asetusChangeObj = groupedChangeObjects[rajoiteId].asetukset
      ? groupedChangeObjects[rajoiteId].asetukset[initialAsetus.id]
      : {};
    const asetus = Object.assign({}, initialAsetus, asetusChangeObj);

    const updatedStructure = append(
      await defineRajoitusStructure(
        osioidenData,
        asetus,
        locale,
        onRemoveCriterion
      ),
      structure
    );

    return defineRajoituksetStructure(
      osioidenData,
      rajoiteId,
      asetukset,
      groupedChangeObjects,
      locale,
      onRemoveCriterion,
      index + 1,
      updatedStructure
    );
  }

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
export async function rajoitelomake(
  data,
  { isReadOnly },
  locale,
  changeObjects,
  { onAddCriterion, onRemoveCriterion }
) {
  const rajoiteId = data.rajoiteId;
  const kohdeChangeObjects = filter(
    cObj =>
      startsWith(`rajoitelomake.${rajoiteId}.asetukset`, cObj.anchor) &&
      !startsWith(`rajoitelomake.${rajoiteId}.asetukset.kohde`, cObj.anchor) &&
      !includes("rajoitus", cObj.anchor),
    changeObjects
  );

  const addedRajoitteet = map(cObj => {
    return {
      id: getAnchorPart(cObj.anchor, 3),
      kohde: {
        components: [
          {
            anchor: "A",
            name: "Autocomplete",
            properties: {
              isMulti: false,
              options: values(
                mapObjIndexed((categoryFn, key) => {
                  return {
                    label: localizations[key],
                    value: key
                  };
                }, sections)
              ).filter(Boolean),
              title: "Kohde"
            }
          }
        ]
      },
      rajoitus: {}
    };
  }, kohdeChangeObjects || []).filter(Boolean);

  const asetukset = {
    [rajoiteId]: addedRajoitteet
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

  const kohdeChangeObj = find(
    obj =>
      obj.anchor === `${data.sectionId}.${data.rajoiteId}.asetukset.kohde.A`,
    changeObjects
  );
  const rajoitusavain = path(
    ["properties", "value", "value"],
    kohdeChangeObj || {}
  );

  const rajoitus = rajoitusavain
    ? await sections[rajoitusavain](data.osioidenData[rajoitusavain], locale)
    : null;

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
            {
              anchor: "kohde",
              title: "Rajoituksen kohde",
              components: [
                {
                  anchor: "A",
                  name: "Autocomplete",
                  styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
                  properties: {
                    isMulti: false,
                    options: values(
                      mapObjIndexed((categoryFn, key) => {
                        return {
                          label: localizations[key],
                          value: key
                        };
                      }, sections)
                    ).filter(Boolean),
                    title: "Kohde"
                  }
                }
              ]
            },
            rajoitus ? rajoitus : {},
            await defineRajoituksetStructure(
              data.osioidenData,
              data.rajoiteId,
              asetukset[data.rajoiteId],
              groupedChangeObjects,
              locale,
              onRemoveCriterion
            ),
            {
              anchor: "asetuksenLisaaminen",
              styleClasses: ["mt-6"],
              components: [
                {
                  anchor: "painike",
                  name: "SimpleButton",
                  onClick: payload => {
                    return onAddCriterion({
                      ...payload,
                      metadata: {
                        ...payload.metadata,
                        rajoiteId: data.rajoiteId
                      }
                    });
                  },
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

  return lomakerakenne;
}
