import {
  append,
  compose,
  endsWith,
  filter,
  find,
  flatten,
  includes,
  last,
  map,
  mapObjIndexed,
  path,
  prop,
  propEq,
  split,
  startsWith,
  uniq,
  values
} from "ramda";
import { getLocalizedProperty } from "../../utils";
import {
  getKohdistuvatRajoitteet,
  getRajoitteet,
  getRajoitteetFromMaarays
} from "utils/rajoitteetUtils";
import Lisatiedot from "../../lisatiedot";
import { __ } from "i18n-for-browser";
import { getAnchorPart } from "../../../../utils/common";
import { getKunnatFromStorage } from "../../../../helpers/kunnat";

/**
 * Funktio luo lomakerakenteen, jonka myötä käyttäjälle näytetään lista
 * lupalomakkeelle valituista kunnista. Käytössä on List-
 * komponentti, jota varten luodaan { content: kunnan_nimi } -muotoisia
 * lista-alkoita. Maakuntamääräyksiä / muutoksia ei ole tässä otettu huomioon,
 * koska kokonaisia maakuntia ei pitäisi olla valittuna
 * Esi- ja perusopetuksen puolella.
 */
export async function previewOfOpetustaAntavaKunnat(
  { lomakedata, rajoitteet, kuntamaaraykset },
  booleans,
  locale
) {
  const kunnat = await getKunnatFromStorage();

  const changeObjectsByProvinceNode = find(
    compose(endsWith(".maakunnatjakunnat"), prop("anchor")),
    lomakedata
  );

  const ulkomaaCheckboxChecked = path(
    ["properties", "isChecked"],
    find(compose(endsWith("200.valintaelementti"), prop("anchor")), lomakedata)
  );

  const ulkomaaTextBoxes = filter(
    compose(endsWith(".kuvaus"), prop("anchor")),
    lomakedata
  );

  const ulkomaaTextBoxValues = ulkomaaCheckboxChecked
    ? values(
        map(ulkomaaTextBox => {
          return {
            value: path(["properties", "value"], ulkomaaTextBox),
            koodiarvo: `ulkomaa-${getAnchorPart(ulkomaaTextBox.anchor, 2)}`
          };
        }, ulkomaaTextBoxes)
      )
    : null;

  /** Haetaan poistettujen kuntien koodiarvot */
  const poistokoodiarvot = flatten(
    values(
      mapObjIndexed(
        arrayOfLocationNodes =>
          map(
            node =>
              path(["properties", "isChecked"], node) === false
                ? path(["properties", "metadata", "koodiarvo"], node)
                : null,
            arrayOfLocationNodes
          ),
        path(
          ["properties", "changeObjectsByProvince"],
          changeObjectsByProvinceNode
        ) || {}
      )
    ).filter(Boolean)
  );

  /** Ottaa koodiarvon parametrina, muodostaa siitä määräysten ja muutos-objektien perusteella
   *  listamuotoisen html:n esikatselua varten */
  const getStructure = koodiarvo => {
    /** Ulkomaiden käsittely */

    if (startsWith("ulkomaa", koodiarvo)) {
      /** Jos opetusta järjestetään ulkomailla -valintaa ei ole tehty, ei ulkomaita näytetä esikatselussa */
      if (!ulkomaaCheckboxChecked) {
        return null;
      }
      const ulkomaaAnkkuri = last(split("-", koodiarvo));

      /** Haetaan ulkomaata vastaava määräys */
      const maarays = find(
        maarays => path(["meta", "ankkuri"], maarays) === ulkomaaAnkkuri,
        kuntamaaraykset
      );

      /** Luodaan html-muotoinen listaesitys rajoitteita sisältäviltä määräyksiltä */
      const rajoitteetFromMaaraysHtml = maarays
        ? getRajoitteetFromMaarays(
            maarays.aliMaaraykset,
            locale,
            __("rajoitteet.ajalla"),
            "arvo",
            true
          )
        : null;

      /** Haetaan ulkomaita koskevat rajoitemuutosobjektit */
      const kohdistuvatRajoitemuutosobjektitUlkomaat = getRajoitteet(
        parseInt(ulkomaaAnkkuri),
        rajoitteet,
        "index"
      );

      /** Luodaan html-muotoinen listaesitys rajoite-muutosobjekteista */
      let rajoitteetFromChangeObjectsHtml = getKohdistuvatRajoitteet(
        kohdistuvatRajoitemuutosobjektitUlkomaat,
        locale
      );

      /** getKohdistuvatRajoitteet - funktion luoma html sisältää parent-määräyksen. Otetaan tämä pois. */
      rajoitteetFromChangeObjectsHtml =
        rajoitteetFromChangeObjectsHtml.substring(
          rajoitteetFromChangeObjectsHtml.indexOf("<ul>", 8)
        );

      /** Parent-määräys */
      const titlehtml = `<ul class="list-disc"><li class="list-disc">${prop(
        "value",
        find(
          ulkomaa => ulkomaa.koodiarvo === koodiarvo,
          ulkomaaTextBoxValues || []
        )
      )}`;

      /** Yhdistetty html parent-määräys, rajoite muutos-objektit sekä rajoitemääräykset */
      const html = `<div>${titlehtml}${
        rajoitteetFromChangeObjectsHtml ? rajoitteetFromChangeObjectsHtml : ""
      }${rajoitteetFromMaaraysHtml ? rajoitteetFromMaaraysHtml : ""}</div>`;

      return {
        anchor: "kunta",
        components: [
          {
            anchor: koodiarvo,
            name: "HtmlContent",
            properties: {
              content: html
            }
          }
        ]
      };
    }

    /** Kuntien käsittely */
    /** Jos kunta on poistettu, ei näytetä sitä esikatselussa */
    if (includes(koodiarvo, poistokoodiarvot)) {
      return null;
    }

    const kunta = find(kunta => {
      return kunta.koodiarvo === koodiarvo;
    }, kunnat);

    const kohdistuvatRajoitemuutosobjektit = getRajoitteet(
      koodiarvo,
      rajoitteet || kunta.meta
    );

    const maarays = find(
      maarays => maarays.koodiarvo === koodiarvo,
      kuntamaaraykset
    );

    /** Luodaan html-muotoinen listaesitys rajoitteita sisältäviltä määräyksiltä */
    const rajoitteetFromMaaraysHtml = maarays
      ? getRajoitteetFromMaarays(
          maarays.aliMaaraykset,
          locale,
          __("rajoitteet.ajalla"),
          "nimi",
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
    const titlehtml = `<div><ul class="list-disc"><li class="list-disc">${
      (kunta.metadata &&
        getLocalizedProperty(kunta.metadata, locale, "nimi")) ||
      (kunta.koodi &&
        find(propEq("kieli", locale.toUpperCase()), kunta.koodi.metadata)
          .nimi) ||
      (kunta.properties && kunta.properties.metadata.title)
    }<div>`;

    /** Yhdistetty html parent-määräys, rajoite muutos-objektit sekä rajoitemääräykset */
    const html = `${titlehtml}${
      rajoitteetFromChangeObjectsHtml ? rajoitteetFromChangeObjectsHtml : ""
    }${rajoitteetFromMaaraysHtml ? rajoitteetFromMaaraysHtml : ""}`;

    return {
      anchor: "kunta",
      components: [
        {
          anchor: koodiarvo,
          name: "HtmlContent",
          properties: {
            content: html
          }
        }
      ]
    };
  };

  /** Haetaan muutos-objekteista ja määräyksistä lista koodiarvoista, jotka täytyy käydä läpi */
  /** Ulkomaiden koodiarvot muotoon ulkomaa-ankkuri */
  const muutoskoodiarvot = flatten(
    values(
      mapObjIndexed(arrayOfLocationNodes => {
        return map(
          node =>
            includes(".kunnat.", node.anchor)
              ? path(["properties", "metadata", "koodiarvo"], node)
              : null,
          arrayOfLocationNodes
        ).filter(Boolean);
      }, path(["properties", "changeObjectsByProvince"], changeObjectsByProvinceNode) || [])
    )
  );

  const maarayskoodiarvot = map(maarays => {
    /** Ulkomaamääräyksille koodiarvoksi "ulkomaa-ankkuri" */
    if (maarays.koodiarvo === "200") {
      /** Filteröidään ulkomaiden valintaelementtimääräys pois  */
      return path(["meta", "arvo"], maarays)
        ? `ulkomaa-${path(["meta", "ankkuri"], maarays)}`
        : null;
    }
    return maarays.koodiarvo;
  }, kuntamaaraykset).filter(Boolean);

  const ulkomaakoodiarvot = map(
    value => value.koodiarvo,
    ulkomaaTextBoxValues || []
  );

  const kaikkikoodiarvot = uniq(
    flatten([muutoskoodiarvot, maarayskoodiarvot, ulkomaakoodiarvot])
  );

  let kunnatHtml = map(
    koodiarvo => getStructure(koodiarvo),
    kaikkikoodiarvot
  ).filter(Boolean);

  const lisatiedotNode = find(
    // 1 = koodiston koodiarvo
    node => endsWith(".lisatiedot.1", node.anchor),
    lomakedata
  );

  if (lisatiedotNode && lisatiedotNode.properties.value) {
    kunnatHtml = append(
      Lisatiedot(lisatiedotNode.properties.value),
      kunnatHtml
    );
  }
  return kunnatHtml;
}
