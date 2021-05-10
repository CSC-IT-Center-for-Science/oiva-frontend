import {
  addIndex,
  append,
  assocPath,
  concat,
  filter,
  find,
  flatten,
  forEach,
  head,
  includes,
  isEmpty,
  join,
  keys,
  last,
  length,
  map,
  mapObjIndexed,
  nth,
  path,
  pathEq,
  pipe,
  prop,
  sortBy,
  split,
  toLower,
  toUpper,
  unnest,
  values
} from "ramda";
import moment from "moment";
import { __ } from "i18n-for-browser";
import React from "react";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";

const pisteytys = {
  rajoite: 0,
  kohde: 1,
  valikko: 2,
  tarkennin: 3,
  kohdennukset: 1000,
  asetukset: 5
};

const calculateAnchorValue = (anchorParts, index = 0, score = 0) => {
  const anchorPart = nth(index, anchorParts);
  if (anchorPart) {
    const uudetPisteet = pisteytys[anchorPart] || parseInt(anchorPart, 10);
    return calculateAnchorValue(
      anchorParts,
      index + 1,
      pisteytys[anchorPart] ? score + uudetPisteet * Math.pow(2, index) : score
    );
  }
  return score;
};

export function sortRestrictions(rajoitteetByRajoiteId) {
  return mapObjIndexed(rajoite => {
    return sortBy(
      prop("score"),
      map(changeObj => {
        const { anchor } = changeObj;
        return {
          ...changeObj,
          score: calculateAnchorValue(split(".", anchor))
        };
      }, rajoite)
    );
  }, rajoitteetByRajoiteId);
}

function getAmountOfInstances(substring, string) {
  const re = new RegExp(substring, "g");
  return (string.match(re) || []).length;
}

function addEnding(ending, string, amountOfEndings = 0, index = 0) {
  const updatedString = string + ending;
  if (index < amountOfEndings) {
    return addEnding(ending, updatedString, amountOfEndings, index + 1);
  }
  return string;
}

const kohteenTarkentimet = ["enintaan", "vahintaan"];

function getTarkentimenArvo(tarkennin, useKuvaus = false) {
  let kuvaus = path(["properties", "value", "kuvaus"], tarkennin);
  let useKuvausInRajoite = path(
    ["properties", "value", "useKuvausInRajoite"],
    tarkennin
  );
  let tarkentimenArvo =
    (useKuvaus || useKuvausInRajoite) && kuvaus
      ? kuvaus
      : path(["properties", "value", "label"], tarkennin) ||
        path(["properties", "value"], tarkennin);
  return Array.isArray(tarkentimenArvo)
    ? pipe(
        map(arvo => arvo.label),
        join(", ")
      )(tarkentimenArvo)
    : tarkentimenArvo;
}

function kayLapiKohdennus(
  kohdennus,
  locale,
  lista = [],
  format,
  ensimmainenRajoite = true
) {
  const asetukset = join(
    " ",
    flatten(
      map(asetus => {
        const tarkenninkomponentit = Object.keys(
          prop("tarkennin", asetus) || {}
        );
        return `${join(
          " ",
          map(tarkenninavain => {
            /** Skipataan päättymispäiväobjekti, ja käsitellään se yhdessä alkamispäiväobjektin kanssa **/
            if (tarkenninavain === "paattymispaiva") {
              return null;
            }
            if (tarkenninavain === "alkamispaiva") {
              const alkamispaivaValue = path(
                ["tarkennin", tarkenninavain, "properties", "value"],
                asetus
              )
                ? moment(
                    path(
                      ["tarkennin", tarkenninavain, "properties", "value"],
                      asetus
                    )
                  ).format("DD.MM.YYYY")
                : "";

              const paattymispaivaValue = path(
                ["tarkennin", "paattymispaiva", "properties", "value"],
                asetus
              )
                ? moment(
                    path(
                      ["tarkennin", "paattymispaiva", "properties", "value"],
                      asetus
                    )
                  ).format("DD.MM.YYYY")
                : "";

              return `<ul><li>${__(
                "rajoitteet.ajalla"
              )} ${alkamispaivaValue} - ${paattymispaivaValue}`;
            }
            const tarkenninValue = asetus.kohde.properties.value.value;
            // TODO: Label pitäisi hakea koodistosta tarkenninValue arvon avulla jos koodistossa on muutettu tekstiä.
            const tarkenninLabel =
              tarkenninavain === "lukumaara"
                ? asetus.kohde.properties.value.label
                : "";
            const taydennyssana = includes(tarkenninValue, kohteenTarkentimet)
              ? {
                  pre: `on ${toLower(asetus.kohde.properties.value.label)}`,
                  post: "henkilöä"
                }
              : null;

            const tarkentimenArvo = getTarkentimenArvo(
              asetus.tarkennin[tarkenninavain]
            );

            const muokattuTarkentimenArvo = moment(
              tarkentimenArvo,
              "YYYY-MM-DDTHH:mm:ss.SSSZ",
              true
            ).isValid()
              ? moment(tarkentimenArvo).format("DD.MM.YYYY")
              : tarkentimenArvo;

            if (taydennyssana) {
              const item = join(
                " ",
                [
                  taydennyssana.pre,
                  muokattuTarkentimenArvo,
                  taydennyssana.post
                ].filter(Boolean)
              );
              if (format === "list") {
                return `<ul><li>${item}`;
              } else {
                return item;
              }
            } else if (muokattuTarkentimenArvo) {
              /** Näytetään opiskelijamäärärajoitteen ensimmäinen rivi hieman eri tavalla */
              if (tarkenninavain === "lukumaara" && ensimmainenRajoite) {
                return format === "list"
                  ? `: ${tarkenninLabel} ${muokattuTarkentimenArvo}`
                  : muokattuTarkentimenArvo;
              }
              return format === "list"
                ? `<ul><li>${tarkenninLabel} ${muokattuTarkentimenArvo}`
                : muokattuTarkentimenArvo;
            }
          }, tarkenninkomponentit)
        )}`;
      }, values(kohdennus.rajoite.asetukset) || [])
    )
  );

  const joista = kohdennus.kohde
    ? kohdennus.kohde.properties.value.label
    : null;
  const kohdennuslukema = kohdennus.tarkennin
    ? values(kohdennus.tarkennin)[0].properties.value
    : null;

  let paivitettyLista = lista;
  if (joista) {
    paivitettyLista = append(
      `<ul><li>${format === "list" ? toLower(joista) : `, ${toLower(joista)}`}`,
      paivitettyLista
    );
    paivitettyLista = append(` ${kohdennuslukema}`, paivitettyLista);
  }
  const tarkennin = path(["rajoite", "kohde", "tarkennin"], kohdennus);
  const tarkenninavain = head(keys(tarkennin || {}));
  const tarkentimenArvo = getTarkentimenArvo(
    prop(tarkenninavain, tarkennin),
    isEmpty(lista)
  );
  const taydennyssana = null;

  let item = tarkentimenArvo;

  if (taydennyssana) {
    item = join(
      " ",
      [taydennyssana.pre, item, taydennyssana.post].filter(Boolean)
    );
  }

  paivitettyLista = ensimmainenRajoite
    ? append(format === "list" ? `<ul><li>${item}` : item, paivitettyLista)
    : paivitettyLista;

  paivitettyLista = append(asetukset, paivitettyLista);

  if (kohdennus.kohdennukset) {
    return kayLapiKohdennukset(
      kohdennus.kohdennukset,
      locale,
      paivitettyLista,
      format
    );
  }

  return paivitettyLista;
}

export function kayLapiKohdennukset(
  kohdennukset,
  locale,
  lista = [],
  format,
  ensimmainenRajoite
) {
  const indexedMap = addIndex(map);
  return indexedMap((kohdennus, index) => {
    return kayLapiKohdennus(
      kohdennus,
      locale,
      index > 0 ? [] : lista,
      format,
      ensimmainenRajoite
    );
  }, kohdennukset);
}

export function getRajoiteSelkokielella(
  rajoiteId,
  rajoiteChangeObjects,
  format
) {
  let rakenne = {};

  for (
    let i = 0;
    i < rajoiteChangeObjects[rajoiteId].changeObjects.length;
    i += 1
  ) {
    rakenne = assocPath(
      split(".", rajoiteChangeObjects[rajoiteId].changeObjects[i].anchor),
      rajoiteChangeObjects[rajoiteId].changeObjects[i],
      rakenne
    );
  }

  const selkokielinenTeksti = join(
    " ",
    flatten(
      kayLapiKohdennukset(
        path(["rajoitteet", rajoiteId, "kohdennukset"], rakenne, [], format)
      )
    )
  );

  return selkokielinenTeksti;
}

export function getRajoiteListamuodossa(
  changeObjects = [],
  locale,
  rajoiteId,
  format = "list"
) {
  let listamuotoWithEndings = "";

  let rakenne = {};

  for (let i = 0; i < changeObjects.length; i += 1) {
    rakenne = assocPath(
      split(".", changeObjects[i].anchor),
      changeObjects[i],
      rakenne
    );
  }

  const baseAnchor = rajoiteId ? `rajoitteet_${rajoiteId}` : "rajoitteet";

  const kohdennukset = path([baseAnchor, "kohdennukset"], rakenne);

  if (kohdennukset) {
    const lapikaydytKohdennukset = kayLapiKohdennukset(
      kohdennukset,
      locale,
      [],
      format
    );

    const kohdennusLista = pipe(
      values,
      map(kohdennus =>
        Array.isArray(kohdennus) ? append(kohdennus, []) : values(kohdennus)
      ),
      unnest
    )(lapikaydytKohdennukset);
    const indexMap = addIndex(map);
    listamuotoWithEndings = join(
      "",
      indexMap((kohdennus, index) => {
        // Lopuksi täytyy vielä sulkea avatut listat ja niiden alkiot.
        const s = join("", kohdennus);
        const amountOfInstances = getAmountOfInstances("<ul", s);
        return addEnding(
          "</li></ul>",
          s,
          index === 0 ? amountOfInstances - 1 : amountOfInstances
        );
      }, kohdennusLista)
    );
    listamuotoWithEndings = addEnding("</li></ul>", listamuotoWithEndings, 2);
  }
  return listamuotoWithEndings;
}

export function getKohdistuvatRajoitteet(rajoitteet, locale, format = "list") {
  let listamuotoWithEndings = "";
  let listamuoto = "";
  let rakenne = {};
  addIndex(forEach)((key, index) => {
    for (let i = 0; i < rajoitteet[key].changeObjects.length; i += 1) {
      rakenne = assocPath(
        split(".", rajoitteet[key].changeObjects[i].anchor),
        rajoitteet[key].changeObjects[i],
        rakenne
      );
    }

    const baseAnchor = key ? `rajoitteet_${key}` : "rajoitteet";

    const kohdennukset = path([baseAnchor, "kohdennukset"], rakenne);

    if (kohdennukset) {
      const lapikaydytKohdennukset = kayLapiKohdennukset(
        kohdennukset,
        locale,
        [],
        format,
        index === 0
      );

      const kohdennusLista = pipe(
        values,
        map(kohdennus =>
          Array.isArray(kohdennus) ? append(kohdennus, []) : values(kohdennus)
        ),
        unnest
      )(lapikaydytKohdennukset);

      listamuotoWithEndings = join(
        "",
        map(kohdennus => {
          const s = join("", kohdennus);
          const amountOfInstances = getAmountOfInstances("<ul>", s);

          return addEnding("</li></ul>", s, amountOfInstances - 1);
        }, kohdennusLista)
      );

      listamuoto = concat(listamuoto, listamuotoWithEndings);
    }
  }, keys(rajoitteet));
  return listamuoto;
}

export const getRajoite = (value, rajoitteet) => {
  const rajoiteId = head(
    filter(key => {
      return pathEq(
        ["changeObjects", 1, "properties", "value", "value"],
        value,
        rajoitteet[key]
      )
        ? rajoitteet[key]
        : null;
    }, keys(rajoitteet))
  );

  return { rajoiteId, rajoite: rajoitteet[rajoiteId] };
};

export const getRajoitteet = (value, rajoitteet, valueAttr = "value") => {
  return filter(
    rajoite =>
      pathEq(
        ["changeObjects", 1, "properties", "value", valueAttr],
        value,
        rajoite
      ),
    rajoitteet
  );
};

/**
 *  Palauttaa html merkkauksen rajoitemääräyksistä html-lupaa / lomaketta varten
 *
 */
export const getRajoitteetFromMaarays = (
  alimaaraykset = [],
  locale,
  ajallaText,
  naytettavaArvo,
  returnAsString = false,
  parentMaarays = null // Näyttää myös parent-määräyksen, jos se annetaan parametrina
) => {
  const maaraysHtmlString = parentMaarays
    ? getRajoiteFromParentMaarays(parentMaarays, locale, naytettavaArvo)
    : "";

  const htmlString = handleAlimaaraykset(
    maaraysHtmlString,
    alimaaraykset,
    locale,
    ajallaText
  );

  return returnAsString ? (
    htmlString
  ) : (
    <ul
      className="htmlContent ml-8"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    ></ul>
  );
};

/** Rajoitemääräyksen parent-osan näyttäminen. (käytetään ainakin lomakkeen rajoitelaatikossa) */
const getRajoiteFromParentMaarays = (parentMaarays, locale, naytettavaArvo) => {
  let maaraysHtmlString = "";
  const value =
    find(
      metadata => metadata.kieli === locale,
      path(["koodi", "metadata"], parentMaarays) || []
    ) || prop("meta", parentMaarays);

  /** Opiskelijamäärämääräykset */
  if (naytettavaArvo === "tyyppi") {
    const tyyppiString =
      value[naytettavaArvo] === "yksittainen"
        ? __("opiskelijamaara.yksittainenKohdennus")
        : __("opiskelijamaara.kokonaismaara");
    maaraysHtmlString = `<ul><li>${tyyppiString}: ${parentMaarays.arvo}`;

    /** Dynaamiset tekstikentät */
  } else if (naytettavaArvo === "kuvaus") {
    maaraysHtmlString = `<ul><li>${prop("kuvaus", value)}`;
    /** Ulkomaat */
  } else if (naytettavaArvo === "ulkomaa") {
    maaraysHtmlString = `<ul><li>${path(["meta", "arvo"], parentMaarays)}`;
    /** Muut */
  } else {
    const metadata = find(
      maarays => prop("kieli", maarays) === toUpper(locale),
      path(["koodi", "metadata"], parentMaarays) || []
    );
    maaraysHtmlString = `<ul><li>${prop(naytettavaArvo, metadata)}`;
  }
  return maaraysHtmlString;
};

export const handleAlimaarays = (
  alimaarays,
  htmlString,
  locale,
  ajallaText,
  multiselectAlimaaraykset = null
) => {
  const arvo = getValueFromAlimaarays(alimaarays, toUpper(locale));
  let modifiedString = `${htmlString}<ul class="list-disc">`;
  const hasAlimaarays = !!length(alimaarays.aliMaaraykset);
  const isMaaraaikaRajoite =
    alimaarays.koodisto === "kujalisamaareetlisaksiajalla";

  if (isMaaraaikaRajoite) {
    modifiedString = `${modifiedString}<li class="list-disc">${ajallaText} ${prop(
      "alkupvm",
      arvo
    )} - ${prop("loppupvm", arvo)}</li>`;
  } else {
    if (multiselectAlimaaraykset) {
      modifiedString = `${modifiedString}<li class="list-disc">`;
      addIndex(forEach)((alimaarays, index) => {
        const last = index === length(multiselectAlimaaraykset) - 1;
        const arvo = getValueFromAlimaarays(alimaarays, toUpper(locale));
        const naytettavaArvo = `${arvo}${last ? "" : ", "}`;
        modifiedString = `${modifiedString}${naytettavaArvo}`;
      }, multiselectAlimaaraykset);
      modifiedString = `${modifiedString}</li>`;
    } else {
      modifiedString = `${modifiedString}<li class="list-disc">${arvo}`;
    }
  }

  if (hasAlimaarays) {
    modifiedString = handleAlimaaraykset(
      modifiedString,
      alimaarays.aliMaaraykset,
      locale,
      ajallaText
    );
  }

  modifiedString = `${modifiedString}</ul>`;
  return modifiedString;
};

const handleAlimaaraykset = (
  modifiedString,
  alimaaraykset,
  locale,
  ajallaText
) => {
  let lapikaydytMultiselectit = [];
  forEach(alimaarays => {
    const multiselectUuid = path(["meta", "multiselectUuid"], alimaarays);
    /** Käydään vain yksi alimääräys läpi, joka sisältää tietyn multiselectUuid:n */
    if (
      !multiselectUuid ||
      !includes(multiselectUuid, lapikaydytMultiselectit)
    ) {
      const multiselectAlimaaraykset = multiselectUuid
        ? getMultiselectAlimaaraykset(multiselectUuid, alimaaraykset)
        : null;
      modifiedString = handleAlimaarays(
        alimaarays,
        modifiedString,
        locale,
        ajallaText,
        multiselectAlimaaraykset
      );
      if (multiselectUuid) {
        lapikaydytMultiselectit = append(lapikaydytMultiselectit, [
          multiselectUuid
        ]);
      }
    }
  }, alimaaraykset);
  return modifiedString;
};

const getMultiselectAlimaaraykset = (multiselectUuid, alimaaraykset) => {
  return multiselectUuid
    ? filter(
        alimaarays =>
          pathEq(["meta", "multiselectUuid"], multiselectUuid, alimaarays),
        alimaaraykset
      )
    : null;
};

// Alimääräysten luonti rajoitteille, jotka on kytketty olemassa
// oleviin määräyksiin.
export const createMaarayksiaVastenLuodutRajoitteetBEObjects = (
  maaraykset,
  rajoitteetByRajoiteId,
  kohteet,
  maaraystyypit,
  kohde
) => {
  return flatten(
    map(maarays => {
      const maaraysKoodiarvoUpper = toUpper(maarays.koodiarvo);
      const maaraystaKoskevatRajoitteet = mapObjIndexed(rajoite => {
        const koodiarvo = path(["1", "properties", "value", "value"], rajoite);
        if (koodiarvo && toUpper(koodiarvo) === maaraysKoodiarvoUpper) {
          return createAlimaarayksetBEObjects(
            kohteet,
            maaraystyypit,
            {
              isMaarays: true,
              generatedId: maarays.uuid,
              kohde
            },
            rajoite
          );
        }
      }, rajoitteetByRajoiteId);
      return values(maaraystaKoskevatRajoitteet);
    }, maaraykset)
  ).filter(Boolean);
};

// Alimääräysten luonti rajoitteille, jotka on kytketty olemassa
// oleviin dynaamisia tekstikenttiä koskeviin määräyksiin.
export const createMaarayksiaVastenLuodutRajoitteetDynaamisilleTekstikentilleBEObjects = (
  maaraykset,
  rajoitteetByRajoiteId,
  kohteet,
  maaraystyypit,
  kohde
) => {
  return flatten(
    map(maarays => {
      const maaraystaKoskevatRajoitteet = mapObjIndexed(rajoite => {
        /** Tekstikentän id on muotoa koodiarvo-ankkuri */
        const rajoiteTekstikenttaId = path(
          ["1", "properties", "value", "value"],
          rajoite
        );
        const rajoitteenTekstikentanAnkkuri = last(
          split("-", rajoiteTekstikenttaId)
        );
        const rajoitteenTekstikentanKoodiarvo = head(
          split("-", rajoiteTekstikenttaId)
        );
        if (
          rajoitteenTekstikentanKoodiarvo === maarays.koodiarvo &&
          /** Määräyksen ankkuri on null jos tekstikenttiä ei voi lisätä */
          (path(["meta", "ankkuri"], maarays) == null ||
            rajoitteenTekstikentanAnkkuri ===
              path(["meta", "ankkuri"], maarays))
        ) {
          return createAlimaarayksetBEObjects(
            kohteet,
            maaraystyypit,
            {
              isMaarays: true,
              generatedId: maarays.uuid,
              kohde
            },
            rajoite
          );
        }
      }, rajoitteetByRajoiteId);
      return values(maaraystaKoskevatRajoitteet);
    }, maaraykset)
  ).filter(Boolean);
};

/** Palauttaa rajoitekriteerin arvon */
const getValueFromAlimaarays = (alimaarays, locale) => {
  /** Ulkomaa */
  if (alimaarays.koodisto === "kunta" && alimaarays.koodiarvo === "200") {
    return path(["meta", "kuvaus"], alimaarays);

    /** Määräaika on erikoistapaus. Palauttaa objektin, joka sisältää alkupvm:n sekä loppupvm:n */
  } else if (alimaarays.koodisto === "kujalisamaareetlisaksiajalla") {
    return {
      alkupvm: moment(
        path(["meta", "alkupvm"], alimaarays),
        "YYYY-MM-DD"
      ).format("DD.MM.YYYY"),
      loppupvm: moment(
        path(["meta", "loppupvm"], alimaarays),
        "YYYY-MM-DD"
      ).format("DD.MM.YYYY")
    };

    /** Opetustehtävä, Kieli, Oppilaitos, Kunnat, Opetuksen järjestämismuoto, Oikeus sisäoppilaitosmuotoiseen koulutukseen */
  } else if (
    includes(alimaarays.koodisto, [
      "opetustehtava",
      "kielikoodistoopetushallinto",
      "oppilaitos",
      "kunta",
      "opetuksenjarjestamismuoto",
      "lukiooikeussisaooppilaitosmuotoiseenkoulutukseen"
    ])
  ) {
    return (
      getMetadataByLocaleAndPropertyFromMaarays(alimaarays, "nimi", locale) ||
      path(["meta", "kuvaus"], alimaarays)
    );

    /** Dynaamiset tekstikentät: Jos koodistosta tulevan kayttoohje-kentan arvo on Kuvaus tai koodistosta ei saada nimeä
     * koodiarvolle, näytetään rajoitekriteerin arvona tekstikenttään syötetty kuvaus. Muutoin nimi koodistosta */
  } else if (
    includes(alimaarays.koodisto, [
      "lukioerityinenkoulutustehtavauusi",
      "lukiomuutkoulutuksenjarjestamiseenliittyvatehdot",
      "poerityinenkoulutustehtava",
      "pomuutkoulutuksenjarjestamiseenliittyvatehdot"
    ])
  ) {
    return getMetadataByLocaleAndPropertyFromMaarays(
      alimaarays,
      "kayttoohje",
      "FI"
    ) === "Kuvaus" ||
      !getMetadataByLocaleAndPropertyFromMaarays(alimaarays, "nimi", locale)
      ? path(["meta", "kuvaus"], alimaarays)
      : getMetadataByLocaleAndPropertyFromMaarays(alimaarays, "nimi", locale);

    /** Joista enintään, Joista vähintään etc. */
  } else if (alimaarays.koodisto === "kujalisamaareetjoistalisaksi") {
    return `${getMetadataByLocaleAndPropertyFromMaarays(
      alimaarays,
      "nimi",
      locale
    )} ${alimaarays.arvo}`;
  }
};

const getMetadataByLocaleAndPropertyFromMaarays = (
  maarays,
  propertyName,
  locale
) => {
  return prop(
    propertyName,
    find(
      metadata => toUpper(prop("kieli", metadata)) === toUpper(locale),
      path(["koodi", "metadata"], maarays) || []
    )
  );
};
