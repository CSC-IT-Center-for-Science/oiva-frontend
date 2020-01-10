import _ from "lodash";
import { parseLocalizedField } from "modules/helpers";

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
  const now = new Date();

  let list = [];

  _.forEach(toimialueet, toimialue => {
    const { koodiArvo, metadata, kunta, tila, voimassaLoppuPvm } = toimialue;

    if (tila === "HYVAKSYTTY" && koodiArvo !== "99") {
      if (!voimassaLoppuPvm || now < Date.parse(voimassaLoppuPvm)) {
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
