import { parseLocalizedField } from "../modules/helpers";
import { find, map, propEq, toUpper } from "ramda";

export function sortOpetuskielet(kielet) {
  return kielet.sort((a, b) => {
    return a.koodiArvo - b.koodiArvo;
  });
}

export function getDataForOpetuskieletList(opetuskielet, kohde, locale) {
  return {
    items: map(opetuskieli => {
      const { koodiArvo, metadata } = opetuskieli;
      const kohdearvo = find(propEq("koodiarvo", koodiArvo), kohde.kohdeArvot);
      const isInLupa = !!kohdearvo;
      return {
        code: opetuskieli.koodiArvo,
        isInLupa: isInLupa,
        shouldBeSelected: isInLupa,
        title: parseLocalizedField(metadata, toUpper(locale)),
        maaraysUuid: kohdearvo ? kohdearvo.uuid : null
      };
    }, opetuskielet)
  };
}
