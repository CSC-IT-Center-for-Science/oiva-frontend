import {
  compose,
  filter,
  flatten,
  head,
  isNil,
  map,
  not,
  path,
  sortBy,
  values
} from "ramda";

export default function opetustaAntavatKunnat(changeObjects = []) {
  const changesByProvince = path(
    ["properties", "changesByProvince"],
    head(changeObjects) || {}
  );

  if (changesByProvince) {
    const listOfMunicipalities = sortBy(
      path(["properties", "metadata", "title"]),
      filter(
        compose(not, isNil, path(["properties", "metadata", "title"])),
        flatten(values(changesByProvince))
      )
    );

    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "opetustaAntavatKunnat",
          name: "Autocomplete",
          properties: {
            options: map(changeObj => {
              const { koodiarvo, title } = changeObj.properties.metadata;
              return { label: title, value: koodiarvo };
            }, listOfMunicipalities).filter(Boolean),
            value: ""
          }
        }
      ]
    };
  } else {
    return {
      anchor: "ei-valintamahdollisuutta",
      components: [
        {
          anchor: "teksti",
          name: "StatusTextRow",
          properties: {
            title: "Ei valintamahdollisuutta."
          }
        }
      ]
    };
  }
}
