import _ from "lodash";

import store from "../../../../../../store";
import { parseLocalizedField } from "../../../../../../modules/helpers";

export function getToimialueByKoodiArvo(koodiarvo) {
  if (!koodiarvo) {
    return undefined;
  }

  const state = store.getState();

  if (koodiarvo.length === 2) {
    // Kyseessä maakunta
    if (state.maakuntakunnat && state.maakuntakunnat.fetched) {
      const { maakuntakunnatList } = state.maakuntakunnat;
      return _.find(maakuntakunnatList, maakunta => {
        return maakunta.koodiArvo === koodiarvo;
      });
    }
  } else if (koodiarvo.length === 3) {
    // Kyseessä kunta
    if (state.maakuntakunnat && state.maakuntakunnat.fetched) {
      const { maakuntakunnatList } = state.maakuntakunnat;   
      return _(maakuntakunnatList)
        .map('kunta')
        .flatten()
        .find(kunta => {return kunta.koodiArvo === koodiarvo})
    }
  } else {
    return undefined;
  }
}

export function getToimialueList(toimialueet, locale, tyyppi) {
  let array = [];

  toimialueet.forEach(toimialue => {
    const { koodiArvo, metadata } = toimialue;
    array.push({
      ...toimialue,
      label: parseLocalizedField(metadata, locale),
      value: koodiArvo,
      tyyppi
    });
  });

  return array;
}

function getKuntaList(kunnat, locale) {
  let list = [];

  _.forEach(kunnat, kunta => {
    const { koodiArvo, metadata, tila } = kunta;

    if (tila === "HYVAKSYTTY" && koodiArvo !== "999") {
      list.push({
        ...kunta,
        label: parseLocalizedField(metadata, locale),
        value: koodiArvo,
        tyyppi: "kunta",
        koodisto: "kunta",
        koodiarvo: koodiArvo
      });
    }
  });

  return list;
}

export function getMaakuntakunnatList(toimialueet, locale) {
  let list = [];

  _.forEach(toimialueet, toimialue => {
    const { koodiArvo, metadata, kunta, tila } = toimialue;

    if (tila === "HYVAKSYTTY" && koodiArvo !== "99") {
      let curMaakunta = {
        ...toimialue,
        label: parseLocalizedField(metadata, locale),
        value: koodiArvo,
        tyyppi: "maakunta",
        koodisto: "maakunta",
        koodiarvo: koodiArvo
      };
      curMaakunta.kunta = getKuntaList(kunta, locale);
      list.push(curMaakunta);
    }
  });

  list = _.sortBy(list, maakunta => {
    maakunta.kunta = _.sortBy(maakunta.kunta, kunta => {
      return kunta.label;
    });

    return maakunta.label;
  });

  return list;
}

export function onVoimassa(n) {
  const now = new Date();
  return !n.voimassaLoppuPvm || n.voimassaLoppuPvm >= now;
}
