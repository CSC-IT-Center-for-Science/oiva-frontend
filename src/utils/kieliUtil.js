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
export function sortLanguages(languages = [], localeUpper = "FI") {
  return R.sort((a, b) => {
    const { nimi: aLabel } = a.metadata[localeUpper];
    const { nimi: bLabel } = b.metadata[localeUpper];

    if (a.koodiarvo === "FI") return -1;
    if (b.koodiarvo === "FI") return 1;
    if (a.koodiarvo === "SV") return -1;
    if (b.koodiarvo === "SV") return 1;
    if (a.koodiarvo === "EN") return -1;
    if (b.koodiarvo === "EN") return 1;
    if (a.koodiarvo === "RU") return -1;
    if (b.koodiarvo === "RU") return 1;
    if (aLabel < bLabel) return -1;
    if (aLabel > bLabel) return 1;
    return 0;
  }, languages);
}
