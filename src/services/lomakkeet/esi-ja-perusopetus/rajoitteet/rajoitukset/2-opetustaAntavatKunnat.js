import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  isNil,
  map,
  not,
  path,
  prop,
  sortBy,
  values
} from "ramda";

export default function getOpetustaAntavatKunnat(osionData = []) {
  const changesByProvinceObj = find(
    compose(endsWith(".maakunnatjakunnat"), prop("anchor")),
    osionData
  );

  if (changesByProvinceObj) {
    const listOfMunicipalities = sortBy(
      path(["properties", "metadata", "title"]),
      filter(
        compose(not, isNil, path(["properties", "metadata", "title"])),
        flatten(values(changesByProvinceObj.properties.changeObjectsByProvince))
      )
    );

    return [
      {
        anchor: "opetustaAntavatKunnat",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "opetustaAntavatKunnat"
          },
          isMulti: false,
          options: map(changeObj => {
            const { koodiarvo, title } = changeObj.properties.metadata;
            return { label: title, value: koodiarvo };
          }, listOfMunicipalities).filter(Boolean),
          value: ""
        }
      }
    ];
  } else {
    return [
      {
        anchor: "teksti",
        name: "StatusTextRow",
        properties: {
          title: "Ei valintamahdollisuutta."
        }
      }
    ];
  }
}
