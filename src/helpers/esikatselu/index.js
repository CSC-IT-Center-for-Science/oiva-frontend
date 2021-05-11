import {
  getKohdistuvatRajoitteet,
  getRajoitteet,
  getRajoitteetFromMaarays
} from "../../utils/rajoitteetUtils";
import { __ } from "i18n-for-browser";

/**
 * Palauttaa html-muotoisen merkkijonon osion tietylle koodiarvolle esikatselua varten
 * @param maarays
 * @param koodiarvo - Koodistopalvelusta tuleva arvo, johon voi kohdistua määräyksiä ja muutoksia
 * @param rajoiteChangeObjs
 * @param locale
 * @param naytettavaArvo
 * @param parentMaaraysArvo -
 * @returns {string}
 */
export const createEsikatseluHTML = (
  maarays,
  koodiarvo,
  rajoiteChangeObjs,
  locale,
  naytettavaArvo,
  parentMaaraysArvo
) => {
  const koodiarvoonKohdistuvatRajoitemuutosobjektit = getRajoitteet(
    koodiarvo,
    rajoiteChangeObjs
  );

  /** Luodaan html-muotoinen listaesitys rajoitteita sisältäviltä määräyksiltä */
  const rajoitteetFromMaaraysHtml = maarays
    ? getRajoitteetFromMaarays(
        maarays.aliMaaraykset,
        locale,
        __("rajoitteet.ajalla"),
        naytettavaArvo,
        true
      )
    : null;

  /** Luodaan html-muotoinen listaesitys rajoitemuutosobjekteista */
  let rajoitteetFromChangeObjectsHtml = getKohdistuvatRajoitteet(
    koodiarvoonKohdistuvatRajoitemuutosobjektit,
    locale
  );

  /** getKohdistuvatRajoitteet - funktion luoma html sisältää parent-määräyksen. Otetaan tämä pois. */
  rajoitteetFromChangeObjectsHtml = rajoitteetFromChangeObjectsHtml.substring(
    rajoitteetFromChangeObjectsHtml.indexOf("<ul>", 8)
  );

  /** Parent-määräys */
  const titlehtml = `<ul><li>${parentMaaraysArvo}`;

  /** Yhdistetty html: parent-määräys, rajoite muutosobjektit sekä rajoitemääräykset */
  return `${titlehtml}${
    rajoitteetFromChangeObjectsHtml ? rajoitteetFromChangeObjectsHtml : ""
  }${rajoitteetFromMaaraysHtml ? rajoitteetFromMaaraysHtml : ""}`;
};
