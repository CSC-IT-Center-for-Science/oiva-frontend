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
  path,
  pathEq,
  prop,
  split,
  toLower,
  values
} from "ramda";
import moment from "moment";

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
  console.info(key);
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
            const muokattuTarkentimenArvo = moment.isDate(tarkentimenArvo)
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
  return join(
    " ",
    values(
      map(kohdennus => {
        return kayLapiKohdennus(kohdennus, lista, format);
      }, kohdennukset)
    )
  );
  // return `<ul>${values(
  //   map(kohdennus => {
  //     return `<li>${kayLapiKohdennus(kohdennus, lista, format)}`;
  //   }, kohdennukset)
  // )}`;
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

  // console.info(selkokielinenTeksti);

  return selkokielinenTeksti;
}

export function getRajoiteListamuodossa(rajoiteId, changeObjects = [], format) {
  console.info(rajoiteId, changeObjects);
  let rakenne = {};

  for (let i = 0; i < changeObjects.length; i += 1) {
    rakenne = assocPath(
      split(".", changeObjects[i].anchor),
      changeObjects[i],
      rakenne
    );
  }

  // console.info(rajoiteId, changeObjects);

  const lapikaydytKohdennukset = kayLapiKohdennukset(
    path(["rajoitteet", rajoiteId, "kohdennukset"], rakenne),
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
