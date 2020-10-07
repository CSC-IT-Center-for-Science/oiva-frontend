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

export default function opetustaAntavatKunnat(
  changeObjects,
  otherChangeObjects = [],
  tarkentimetChangeObjects = []
) {
  const changesByProvince = path(
    ["properties", "changesByProvince"],
    head(otherChangeObjects) || {}
  );

  console.info(changeObjects, otherChangeObjects, tarkentimetChangeObjects);

  if (changesByProvince) {
    const listOfMunicipalities = sortBy(
      path(["properties", "metadata", "title"]),
      filter(
        compose(not, isNil, path(["properties", "metadata", "title"])),
        flatten(values(changesByProvince))
      )
    );
    
    const opetustaAntavatKunnatChangeObj = head(tarkentimetChangeObjects);

    return {
      anchor: "opetustaAntavatKunnat",
      components: [
        {
          anchor: "autocomplete",
          name: "Autocomplete",
          properties: {
            options: map(changeObj => {
              const { koodiarvo, title } = changeObj.properties.metadata;
              return !!opetustaAntavatKunnatChangeObj &&
                !!find(
                  propEq("value", koodiarvo),
                  opetustaAntavatKunnatChangeObj.properties.value
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
