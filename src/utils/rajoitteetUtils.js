import {
  append,
  assocPath,
  flatten,
  includes,
  join,
  map,
  path,
  prop,
  split,
  toLower,
  values
} from "ramda";
import moment from "moment";

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

function kayLapiKohdennus(kohdennus, lista = []) {
  const asetukset = join(
    " ",
    flatten(
      map(asetus => {
        const tarkenninkomponentit = Object.keys(
          prop("tarkennin", asetus) || {}
        );
        return map(tarkenninavain => {
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
            return join(
              " ",
              [
                taydennyssana.pre,
                `<strong>${muokattuTarkentimenArvo}</strong>`,
                taydennyssana.post
              ].filter(Boolean)
            );
          } else {
            return `<strong>${muokattuTarkentimenArvo}</strong>`;
          }
        }, tarkenninkomponentit);
      }, values(kohdennus.rajoite.asetukset) || [])
    )
  );

  const joista = kohdennus.kohde
    ? kohdennus.kohde.properties.value.label
    : null;
  const kohdennuslukema = kohdennus.tarkennin
    ? values(kohdennus.tarkennin)[0].properties.value
    : null;

  let paivitettyLista = joista
    ? append(toLower(`, ${joista} <strong>${kohdennuslukema}</strong>`), lista)
    : lista;
  const tarkenninavain = Object.keys(kohdennus.rajoite.kohde.tarkennin)[0];
  const tarkentimenArvo = path(
    ["properties", "value", "label"],
    kohdennus.rajoite.kohde.tarkennin[tarkenninavain]
  );
  const taydennyssana = getTaydennyssana(tarkenninavain);
  if (taydennyssana) {
    paivitettyLista = append(
      join(
        " ",
        [
          taydennyssana.pre,
          `<strong>${tarkentimenArvo}</strong>`,
          taydennyssana.post
        ].filter(Boolean)
      ),
      paivitettyLista
    );
  } else {
    paivitettyLista = append(tarkentimenArvo, paivitettyLista);
  }
  paivitettyLista = append(asetukset, paivitettyLista);

  if (kohdennus.kohdennukset) {
    return kayLapiKohdennukset(kohdennus.kohdennukset, paivitettyLista);
  }

  return paivitettyLista;
}

export function kayLapiKohdennukset(kohdennukset, lista = []) {
  return values(
    map(kohdennus => {
      return kayLapiKohdennus(kohdennus, lista);
    }, kohdennukset)
  );
}

export function getRajoiteSelkokielella(rajoiteId, rajoiteChangeObjects) {
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
        path(["rajoitteet", rajoiteId, "kohdennukset"], rakenne)
      )
    )
  );

  console.info(selkokielinenTeksti);

  return selkokielinenTeksti;
}
