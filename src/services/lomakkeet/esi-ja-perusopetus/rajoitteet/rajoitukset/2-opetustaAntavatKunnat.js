import {
  compose,
  filter,
  find,
  flatten,
  head,
  isNil,
  map,
  not,
  path,
  propEq,
  sortBy,
  values
} from "ramda";

export default function opetustaAntavatKunnat(asetus, changeObjects = []) {
  console.info(asetus);
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
              return !!asetus.rajoitus &&
                !!find(
                  propEq("value", koodiarvo),
                  path(
                    [
                      "rajoitus",
                      "opetustaAntavatKunnat",
                      "properties",
                      "value"
                    ],
                    asetus
                  ) || []
                )
                ? null
                : { label: title, value: koodiarvo };
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
