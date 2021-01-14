import {
  append,
  assocPath,
  filter,
  flatten,
  head,
  includes,
  join,
  keys,
  map,
  mapObjIndexed,
  nth,
  path,
  pathEq,
  prop,
  sortBy,
  split,
  toLower,
  values
} from "ramda";
import moment from "moment";

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

function getTaydennyssana(key) {
  const taydennyssanat = {
    alkamispaiva: {
      pre: "ajalla",
      post: " - "
    },
    lukumaara: {
      pre: "on",
      post: "henkilöä"
    },
    opetuskielet: {
      pre: "opetetaan kielellä"
    },
    opetustaAntavatKunnat: {
      pre: "kunnassa"
    },
    opetustehtavat: {
      pre: "opetustehtävänä"
    }
  };

  return taydennyssanat[key];
}

const kohteenTarkentimet = ["enintaan", "vahintaan"];

function kayLapiKohdennus(kohdennus, lista = [], format) {
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
            const tarkenninValue = asetus.kohde.properties.value.value;
            const taydennyssana = includes(tarkenninValue, kohteenTarkentimet)
              ? {
                  pre: `on ${toLower(asetus.kohde.properties.value.label)}`,
                  post: "henkilöä"
                }
              : getTaydennyssana(tarkenninavain);
            const tarkentimenArvo =
              path(
                ["properties", "value", "label"],
                asetus.tarkennin[tarkenninavain]
              ) ||
              path(["properties", "value"], asetus.tarkennin[tarkenninavain]);
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
                  `<strong>${muokattuTarkentimenArvo}</strong>`,
                  taydennyssana.post
                ].filter(Boolean)
              );
              if (format === "list") {
                return `<ul className="p-0"><li>${item}`;
              } else {
                return item;
              }
            } else if (muokattuTarkentimenArvo) {
              return format === "list"
                ? `<strong>${muokattuTarkentimenArvo}</strong>`
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
    paivitettyLista = append(
      `<ul><li><strong>${kohdennuslukema}</strong>`,
      paivitettyLista
    );
  }
  const tarkennin = path(["rajoite", "kohde", "tarkennin"], kohdennus);
  const tarkenninavain = head(keys(tarkennin || {}));
  const tarkentimenArvo = path(
    ["properties", "value", "label"],
    prop(tarkenninavain, tarkennin)
  );
  const taydennyssana = getTaydennyssana(tarkenninavain);

  let item = tarkentimenArvo;

  if (taydennyssana) {
    item = join(
      " ",
      [
        taydennyssana.pre,
        `<strong>${tarkentimenArvo}</strong>`,
        taydennyssana.post
      ].filter(Boolean)
    );
  }

  paivitettyLista = append(
    format === "list" ? `<ul><li>${item}` : item,
    paivitettyLista
  );

  // console.info("Asetukset:", asetukset);

  paivitettyLista = append(asetukset, paivitettyLista);

  if (kohdennus.kohdennukset) {
    return kayLapiKohdennukset(kohdennus.kohdennukset, paivitettyLista, format);
  }

  return paivitettyLista;
}

export function kayLapiKohdennukset(kohdennukset, lista = [], format) {
  console.info(kohdennukset, lista, format);
  return join(
    " ",
    values(
      map(kohdennus => {
        return kayLapiKohdennus(kohdennus, lista, format);
      }, kohdennukset)
    )
  );
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

export function getRajoiteListamuodossa(rajoiteId, stateObjects = [], format) {
  console.info(
    "PALAUTETAAN RAJOITE LISTAMUODOSSA",
    rajoiteId,
    stateObjects,
    format
  );
  let rakenne = {};
  for (let i = 0; i < stateObjects.length; i += 1) {
    rakenne = assocPath(
      split(".", stateObjects[i].anchor),
      stateObjects[i],
      rakenne
    );
  }

  const lapikaydytKohdennukset = kayLapiKohdennukset(
    path([`rajoitteet_${rajoiteId}`, "kohdennukset"], rakenne),
    [],
    format
  );

  // Lopuksi täytyy vielä sulkea avatut listat ja niiden alkiot.
  const amountOfInstances = getAmountOfInstances(
    "<ul>",
    lapikaydytKohdennukset
  );

  const listamuotoWithEndings = addEnding(
    "</li></ul>",
    lapikaydytKohdennukset,
    amountOfInstances
  );

  return listamuotoWithEndings;
}

export const getRajoite = (value, rajoitteet) => {
  const rajoiteId = head(
    filter(key => {
      return pathEq(
        ["elements", "kohdennukset", 1, "properties", "value", "value"],
        value,
        rajoitteet[key]
      )
        ? rajoitteet[key]
        : null;
    }, keys(rajoitteet))
  );

  return { rajoiteId, rajoite: rajoitteet[rajoiteId] };
};
