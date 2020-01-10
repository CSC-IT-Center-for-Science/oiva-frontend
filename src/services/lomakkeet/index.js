import * as R from "ramda";
import getTyovoimakoulutuslomake from "./perustelut/tyovoimakoulutus";
import {
  getKuljettajienJatkokoulutuslomake,
  getKuljettajienPeruskoulutuslomake
} from "./perustelut/kuljettajakoulutukset";

const lomakkeet = {
  koulutukset: {
    kuljettajakoulutukset: {
      jatkokoulutus: {
        addition: (data, isReadOnly, locale) =>
          getKuljettajienJatkokoulutuslomake(
            "addition",
            data,
            isReadOnly,
            locale
          ),
        removal: (data, isReadOnly, locale, prefix) =>
          getKuljettajienJatkokoulutuslomake(
            "removal",
            data,
            isReadOnly,
            locale,
            prefix
          )
      },
      peruskoulutus: {
        addition: (data, isReadOnly, locale) =>
          getKuljettajienPeruskoulutuslomake(
            "addition",
            data,
            isReadOnly,
            locale
          ),
        removal: (data, isReadOnly, locale, prefix) =>
          getKuljettajienPeruskoulutuslomake(
            "removal",
            data,
            isReadOnly,
            locale,
            prefix
          )
      }
    },
    tyovoimakoulutukset: {
      addition: (data, isReadOnly, locale) =>
        getTyovoimakoulutuslomake("addition", data, isReadOnly, locale),
      removal: (data, isReadOnly, locale, prefix) =>
        getTyovoimakoulutuslomake("removal", data, isReadOnly, locale, prefix)
    }
  }
};

export function getLomake(
  action = "addition",
  data = {},
  isReadOnly,
  locale,
  path = [],
  prefix
) {
  const fn = R.path(R.concat(path, [action]), lomakkeet);
  const lomake = fn ? fn(data, isReadOnly, locale, prefix) : [];
  return lomake;
}
