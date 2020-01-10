import { parseLocalizedField } from "../modules/helpers";
import _ from "lodash";
import * as R from "ramda";

export function findKieliByKoodi(kielet, koodiarvo) {
  return _.find(kielet, kieli => {
    return kieli.koodiArvo === koodiarvo;
  });
}

export function getKieliList(kielet, locale) {
  let kieletExtended = [];

  kielet.forEach(kieli => {
    const { koodiArvo, koodisto, metadata, kohde, maaraystyyppi } = kieli;
    kieletExtended.push({
      koodiArvo,
      koodisto,
      metadata,
      kohde,
      maaraystyyppi,
      label: parseLocalizedField(metadata, locale),
      value: koodiArvo
    });
  });

  return kieletExtended;
}

// Sort languages: promote some common languages, sort others alphabetically
export function sortLanguages(languages = [], locale) {
  return R.sort((a, b) => {
    const aLabel = parseLocalizedField(a.metadata, locale);
    const bLabel = parseLocalizedField(b.metadata, locale);
    if (a.koodiArvo === "FI") return -1;
    if (b.koodiArvo === "FI") return 1;
    if (a.koodiArvo === "SV") return -1;
    if (b.koodiArvo === "SV") return 1;
    if (a.koodiArvo === "EN") return -1;
    if (b.koodiArvo === "EN") return 1;
    if (a.koodiArvo === "RU") return -1;
    if (b.koodiArvo === "RU") return 1;
    if (aLabel < bLabel) return -1;
    if (aLabel > bLabel) return 1;
    return 0;
  }, languages);
}
