import { parseLocalizedField } from "modules/helpers";

export function getMuutosperusteluList(muutosperustelut, locale) {
  let array = [];

  muutosperustelut.forEach(muutosperustelu => {
    const { koodiArvo, metadata } = muutosperustelu;
    array.push({
      ...muutosperustelu,
      label: parseLocalizedField(metadata, locale),
      value: koodiArvo
    });
  });

  return array;
}
