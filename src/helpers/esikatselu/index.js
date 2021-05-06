import {
  getKohdistuvatRajoitteet,
  getRajoitteet,
  getRajoitteetFromMaarays
} from "../../utils/rajoitteetUtils";
import { __ } from "i18n-for-browser";

export const createEsikatseluHTML = (
  maarays,
  koodiarvo,
  rajoitteet,
  locale,
  naytettavaArvo,
  parentMaaraysArvo
) => {
  const kohdistuvatRajoitemuutosobjektit = getRajoitteet(koodiarvo, rajoitteet);

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

  /** Luodaan html-muotoinen listaesitys rajoite-muutosobjekteista */
  let rajoitteetFromChangeObjectsHtml = getKohdistuvatRajoitteet(
    kohdistuvatRajoitemuutosobjektit,
    locale
  );

  /** getKohdistuvatRajoitteet - funktion luoma html sisältää parent-määräyksen. Otetaan tämä pois. */
  rajoitteetFromChangeObjectsHtml = rajoitteetFromChangeObjectsHtml.substring(
    rajoitteetFromChangeObjectsHtml.indexOf("<ul>", 8)
  );

  /** Parent-määräys */
  const titlehtml = `<ul><li>${parentMaaraysArvo}`;

  /** Yhdistetty html parent-määräys, rajoite muutos-objektit sekä rajoitemääräykset */
  return `${titlehtml}${
    rajoitteetFromChangeObjectsHtml ? rajoitteetFromChangeObjectsHtml : ""
  }${rajoitteetFromMaaraysHtml ? rajoitteetFromMaaraysHtml : ""}`;
};
