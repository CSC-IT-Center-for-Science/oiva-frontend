import {
  concat,
  find,
  flatten,
  groupBy,
  head,
  isNil,
  lensIndex,
  map,
  mapObjIndexed,
  omit,
  path,
  prop,
  propEq,
  reject,
  uniq,
  view
} from "ramda";
import localforage from "localforage";
import { Kieli, Kielet, KieliRaw } from "types";
import { LocaleUpper } from "enums";
import { sortLanguagesByName } from "./utils";

/**
 * Järjestää OPH-koodiston kielet järjestykseen siten, että
 * arrangeOpetuskieletOPH-funktiolle 1. parametrinä annettuja
 * lyhenteitä vastaavat kielet ovat funktion palauttamassa
 * taulukossa ensimmäisinä.
 * @param kielet - Kielet-tyyppinen objekti.
 * @param localeUpper - Käyttöliittymän kieli kokonaan isoilla kirjaimilla kirjoitettuna.
 * @returns Kielet-tyyppinen objekti järjestettynä yllä kuvatulla tavalla.
 */
export const arrangeOpetuskieletOPH = (
  kieltenLyhenteet: Array<String>,
  ophKielet: Kielet,
  localeUpper: LocaleUpper
) => {
  const listanKarkeenAsetettavat: Kielet = reject(
    isNil,
    map(
      kielikoodi => find(propEq("koodiarvo", kielikoodi), ophKielet)!,
      kieltenLyhenteet
    )
  );
  return uniq(
    concat(
      listanKarkeenAsetettavat,
      sortLanguagesByName(ophKielet, localeUpper)
    )
  );
};

/**
 * Ottaa vastaan backend-muotoisen kieliobjektin (KieliRaw) ja palauttaa
 * sen mukaisen käsitellyn kieliobjektin (Kieli).
 * @param kieli - KieliRaw-tyyppinen objekti.
 * @returns Kieli-tyyppinen objekti.
 */
export const initializeKieli = (kieli: KieliRaw): Kieli => {
  return omit(["koodiArvo"], {
    ...kieli,
    koodiarvo: kieli.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), kieli.metadata))
  });
};

export function getKieletFromStorage() {
  return localforage.getItem("kielet");
}

export const getChangesToSave = (
  changeObjects: any,
  kohde: any,
  maaraystyypit: any
) =>
  map(changeObj => {
    const anchorParts = changeObj.anchor.split(".");
    const code = view(lensIndex(1), anchorParts);
    // const perustelut = filter(
    //   compose(equals(code), view(lensIndex(1)), split("."), prop("anchor")),
    //   changeObjects.perustelut
    // );
    const perustelut: Array<any> = [];
    const meta: any = path(["properties", "metadata"], changeObj) || {};

    return {
      koodiarvo: code,
      koodisto: "oppilaitoksenopetuskieli",
      nimi: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
      kuvaus: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
      isInLupa: meta.isInLupa,
      kohde, //: meta.kohde.kohdeArvot[0].kohde,
      maaraystyyppi: find(propEq("tunniste", "VELVOITE"), maaraystyypit), // : meta.maaraystyyppi,
      maaraysUuid: meta.maaraysUuid,
      meta: {
        tunniste: "opetuskieli",
        changeObjects: flatten([[changeObj], perustelut]),
        perusteluteksti: map(perustelu => {
          if (path(["properties", "value"], perustelu)) {
            return { value: path(["properties", "value"], perustelu) };
          }
          return {
            value: path(["properties", "metadata", "fieldName"], perustelu)
          };
        }, perustelut)
      },
      tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
      type: changeObj.properties.isChecked ? "addition" : "removal"
    };
  }, changeObjects.muutokset).filter(Boolean);
