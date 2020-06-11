import {
  find,
  map,
  propEq,
  filter,
  compose,
  flatten,
  values,
  not,
  pathEq,
  assocPath,
  append
} from "ramda";
import { getMaarayksetByTunniste } from "../lupa";

/**
 * Palauttaa taulukollisen backend-muotoisia muutosobjekteja.
 * @param {*} changeObjects
 * @param {*} kohde
 * @param {*} maaraystyypit
 * @param {*} locale
 */
export async function defineBackendChangeObjects(
  changeObjects = {},
  kohde,
  maaraystyypit
) {
  const { quickFilterChanges, changesByProvince, perustelut } = changeObjects;

  const maaraystyyppi = find(propEq("tunniste", "VELVOITE"), maaraystyypit);

  /**
   * Noudetaan toiminta-alueeseen liittyvät määräykset. Määräysten uuid-arvoja
   * tarvitaan lupaan kuuluvien alueiden poistamisen yhteydessä.
   */
  const maaraykset = await getMaarayksetByTunniste("toimintaalue");

  /**
   * PIKAVALINTOJEN LÄPIKÄYNTI
   *
   * Käydään läpi pikavalinnat eli nuts1-koodiston koodiarvoja FI1 ja FI2
   * vastaavat muutosobjektit muodostaen niistä backend-muotoiset muutos-
   * objektit.
   */
  let quickFilterBEchangeObjects = map(changeObj => {
    /**
     * Jos kaikki maakunnat ja kunnat on valittuna, on backendille lähetettävä
     * muutosobjekti nuts1-koodiston arvolla FI1. Mikäli yksikään maakunnista
     * ei ole valittuna eli toiminta-aluetta ei ole määritelty, on backendille
     * lähetettävä muutosobjekti nuts1-koodiston arvolla FI2.
     */
    const { isChecked } = changeObj.properties;
    const { koodiarvo } = changeObj.properties.metadata;

    let muutos = {
      tila: isChecked ? "LISAYS" : "POISTO",
      meta: {
        changeObjects: perustelut,
        perusteluteksti: [
          {
            value:
              perustelut && perustelut.length > 0
                ? perustelut[0].properties.value
                : ""
          }
        ]
      },
      kohde,
      maaraystyyppi,
      koodisto: "nuts1",
      koodiarvo
    };

    if (!isChecked) {
      /**
       * Mikäli kyseessä on poisto, lisätään muutosobjektiin määräyksen uuid.
       */
      const maarays = find(propEq("koodiarvo", koodiarvo), maaraykset);
      // Varmistetaan vielä, että määräys on olemassa.
      if (maarays) {
        muutos.maaraysUuid = maarays.uuid;
      } else {
        console.warn("Unable to find maaraysUuid for ", koodiarvo);
      }
    }

    return muutos;
  }, quickFilterChanges);

  /**
   * YKSITTÄISTEN MAAKUNTIEN JA KUNTIEN LÄPIKÄYNTI
   *
   * Käyttäjä on voinut tehdä monenlaisia muutoksia toiminta-alueeseen. Käydään
   * läpi pikavalintojen - eli nuts1-koodiston - ulkopuolelle jäävät muutokset.
   */
  const muutosFI1 = find(
    propEq("koodiarvo", "FI1"),
    quickFilterBEchangeObjects
  );

  const provinceChangeObjects = flatten(values(changesByProvince));

  const provinceBEchangeObjects = {};

  // YKSITTÄISTEN MAAKUNTIEN JA KUNTIEN POISTAMINEN
  provinceBEchangeObjects.poistot = map(maarays => {
    // Selvitetään, ollaanko alue aikeissa poistaa luvan piiristä.
    const changeObj = find(
      pathEq(["properties", "metadata", "koodiarvo"], maarays.koodiarvo),
      provinceChangeObjects
    );
    const isGoingToBeRemoved =
      (changeObj && !changeObj.properties.isChecked) ||
      (muutosFI1 && muutosFI1.tila === "LISAYS");
    if (isGoingToBeRemoved) {
      // Alue täytyy poistaa. Luodaan backend-muotoinen muutosobjekti.
      return {
        tila: "POISTO",
        meta: {
          changeObjects: perustelut,
          perusteluteksti: [
            {
              value:
                perustelut && perustelut.length > 0
                  ? perustelut[0].properties.value
                  : ""
            }
          ]
        },
        kohde,
        koodisto: maarays.koodisto,
        koodiarvo: maarays.koodiarvo,
        maaraystyyppi,
        maaraysUuid: maarays.uuid
      };
    }
    return null;
  }, filter(compose(not, propEq("koodisto", "nuts1")), maaraykset)).filter(
    Boolean
  );

  /**
   * YKSITTÄISTEN MAAKUNTIEN JA KUNTIEN LISÄÄMINEN
   *
   * Yksittäiset maakunnat lisätään vain siinä tapauksessa, jos nust1-koodiston
   * koodiarvon FI1-mukaista muutosobjektia ei olla lisäämässä. FI1 kattaa
   * koko maan kaikki maakunnat - pois lukien Ahvenanmaan maakunta - ja niinpä
   * kyseisen koodiarvon mukaisen muutosobjektin ollessa backendille
   * lähetettävien muutosobjektien joukossa eivät yksittäiset maakunta- ja
   * kuntalisäykset ole tarpeellisia.
   **/
  if (!muutosFI1 || (muutosFI1 && muutosFI1.tila !== "LISAYS")) {
    provinceBEchangeObjects.lisaykset = map(changeObj => {
      const maarays = find(
        propEq("koodiarvo", changeObj.properties.metadata.koodiarvo),
        maaraykset
      );
      if (changeObj.properties.isChecked && !maarays) {
        // Alue täytyy lisätä luvan piiriin. Luodaan tarvittava muutosobjekti.
        const { koodiarvo } = changeObj.properties.metadata;
        return {
          tila: "LISAYS",
          meta: {
            changeObjects: perustelut,
            perusteluteksti: [
              {
                value:
                  perustelut && perustelut.length > 0
                    ? perustelut[0].properties.value
                    : ""
              }
            ]
          },
          kohde,
          koodisto: koodiarvo.length === 2 ? "maakunta" : "kunta",
          koodiarvo,
          maaraystyyppi
        };
      }
    }, provinceChangeObjects).filter(Boolean);
  }

  let allBEobjects = flatten([
    [quickFilterBEchangeObjects],
    [provinceBEchangeObjects.lisaykset],
    [provinceBEchangeObjects.poistot]
  ]).filter(Boolean);

  // Lisätään vielä frontin muutokset ensimmäiselle backend-muutosobjektille.
  allBEobjects = assocPath(
    [0, "meta", "changeObjects"],
    append(
      {
        anchor: "categoryFilter",
        properties: {
          quickFilterChanges,
          changesByProvince
        }
      },
      allBEobjects[0].meta.changeObjects
    ),
    allBEobjects
  );

  return allBEobjects;
}
