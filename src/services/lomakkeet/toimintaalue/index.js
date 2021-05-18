import { getKunnatFromStorage } from "helpers/kunnat";
import { getMaakunnat, getMaakuntakunnat } from "helpers/maakunnat";
import {
  compose,
  concat,
  filter,
  find,
  flatten,
  includes,
  join,
  map,
  mapObjIndexed,
  not,
  path,
  pathEq,
  prop,
  propEq,
  sort,
  toUpper,
  values
} from "ramda";
import { isAdded, isRemoved, isInLupa } from "css/label";
import kuntaProvinceMapping from "utils/kuntaProvinceMapping";
import { __ } from "i18n-for-browser";

const labelStyles = {
  addition: isAdded,
  removal: isRemoved
};

const mapping = {
  "01": "FI-18",
  "02": "FI-19",
  "04": "FI-17",
  "05": "FI-06",
  "06": "FI-11",
  "07": "FI-16",
  "08": "FI-09",
  "09": "FI-02",
  10: "FI-04",
  11: "FI-15",
  12: "FI-13",
  14: "FI-03",
  16: "FI-07",
  13: "FI-08",
  15: "FI-12",
  17: "FI-14",
  18: "FI-05",
  19: "FI-10",
  21: "FI-01"
};

const getModificationForm = async (
  {
    fiCode,
    isEditViewActive,
    changeObjectsByProvince = {},
    quickFilterChanges = [],
    localizations,
    kunnatInLupa,
    maakunnatInLupa,
    valtakunnallinenMaarays
  },
  booleans,
  locale,
  changeObjects,
  { onChanges, toggleEditView }
) => {
  const kunnat = filter(
    // 200 = Ulkomaa
    compose(not, propEq("koodiarvo", "200")),
    await getKunnatFromStorage()
  );
  const maakunnat = await getMaakunnat();
  const maakuntakunnat = await getMaakuntakunnat();

  const localeUpper = toUpper(locale);
  const maaraysUuid = valtakunnallinenMaarays.uuid;
  const options = map(maakunta => {
    const isMaakuntaInLupa = !!find(province => {
      return province.metadata.koodiarvo === maakunta.koodiarvo;
    }, maakunnatInLupa);

    let someMunicipalitiesInLupa = false;

    let someMunicipalitiesNotInLupa = false;

    const today = new Date();

    const presentKunnat = filter(
      ({ voimassaLoppuPvm }) =>
        !voimassaLoppuPvm || new Date(voimassaLoppuPvm) >= today,
      maakunta.kunnat
    );

    const municipalitiesOfProvince = map(kunta => {
      const kunnanNimi = kunta.metadata[localeUpper].nimi;

      const isKuntaInLupa = !!find(
        pathEq(["metadata", "koodiarvo"], kunta.koodiarvo),
        kunnatInLupa
      );

      if (isKuntaInLupa) {
        someMunicipalitiesInLupa = true;
      } else {
        someMunicipalitiesNotInLupa = true;
      }

      return {
        anchor: kunta.koodiarvo,
        name: "CheckboxWithLabel",
        styleClasses: ["w-1/2"],
        properties: {
          code: kunta.koodiarvo,
          forChangeObject: {
            koodiarvo: kunta.koodiarvo,
            title: kunnanNimi,
            maakuntaKey: mapping[maakunta.koodiarvo],
            maaraysUuid
          },
          isChecked: isKuntaInLupa || isMaakuntaInLupa || fiCode === "FI1",
          labelStyles: Object.assign({}, labelStyles, {
            custom: isInLupa
          }),
          name: kunta.koodiarvo,
          title: kunnanNimi
        }
      };
    }, presentKunnat);

    const isKuntaOfMaakuntaInLupa = !!find(kunta => {
      let maakuntaCode;
      const result = find(
        k =>
          propEq("kuntaKoodiarvo", kunta.metadata.koodiarvo, k) &&
          includes(k.kuntaKoodiarvo, map(prop("koodiarvo"), presentKunnat)),
        kuntaProvinceMapping
      );
      if (result) {
        mapObjIndexed((value, key) => {
          if (value === result.maakuntaKey) {
            maakuntaCode = key;
          }
        }, mapping);
      }
      return maakuntaCode === maakunta.koodiarvo;
    }, kunnatInLupa);
    return {
      anchor: mapping[maakunta.koodiarvo],
      formId: mapping[maakunta.koodiarvo],
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            code: maakunta.koodiarvo,
            forChangeObject: {
              koodiarvo: maakunta.koodiarvo,
              maakuntaKey: mapping[maakunta.koodiarvo],
              title: maakunta.label,
              maaraysUuid
            },
            isChecked:
              fiCode === "FI1" || isMaakuntaInLupa || isKuntaOfMaakuntaInLupa,
            isIndeterminate:
              !isMaakuntaInLupa &&
              someMunicipalitiesInLupa &&
              someMunicipalitiesNotInLupa,
            labelStyles: Object.assign({}, labelStyles, {
              custom: isInLupa
            }),
            name: maakunta.koodiarvo,
            title: maakunta.metadata[localeUpper].nimi
          }
        }
      ],
      categories: [
        {
          anchor: "kunnat",
          formId: mapping[maakunta.koodiarvo],
          components: municipalitiesOfProvince
        }
      ]
    };
  }, maakuntakunnat).filter(Boolean);

  return [
    {
      anchor: "valintakentta",
      components: [
        {
          anchor: "maakunnatjakunnat",
          name: "CategoryFilter",
          styleClasses: ["mt-4"],
          properties: {
            anchor: "areaofaction",
            changeObjectsByProvince,
            isEditViewActive,
            localizations,
            municipalities: kunnat,
            onChanges,
            toggleEditView,
            provinces: options,
            provincesWithoutMunicipalities: maakunnat,
            quickFilterChanges,
            showCategoryTitles: false
          }
        }
      ]
    }
  ];
};

async function getReasoningForm({ isReadOnly }, lupakohde, _changeObjects) {
  const mapping = {
    "FI-18": "01",
    "FI-19": "02",
    "FI-17": "04",
    "FI-06": "05",
    "FI-11": "06",
    "FI-16": "07",
    "FI-09": "08",
    "FI-02": "09",
    "FI-04": "10",
    "FI-15": "11",
    "FI-13": "12",
    "FI-03": "14",
    "FI-07": "16",
    "FI-08": "13",
    "FI-12": "15",
    "FI-14": "17",
    "FI-05": "18",
    "FI-10": "19"
  };

  const maakuntakunnat = await getMaakuntakunnat();

  function getChangeObjects(isCheckedVal) {
    return mapObjIndexed((changeObjects, provinceKey) => {
      const province = find(
        propEq("koodiarvo", mapping[provinceKey]),
        maakuntakunnat
      );

      const relevantChangeObjects = filter(
        pathEq(["properties", "isChecked"], isCheckedVal),
        changeObjects
      );
      if (province) {
        if (relevantChangeObjects.length - 1 === province.kunnat.length) {
          return filter(
            compose(not, includes(".kunnat."), prop("anchor")),
            relevantChangeObjects
          );
        } else {
          return filter(
            compose(includes(".kunnat."), prop("anchor")),
            relevantChangeObjects
          );
        }
      }
    }, byProvince);
  }

  const current = {
    maakunnat: map(prop("arvo"), lupakohde.maakunnat),
    kunnat: map(prop("arvo"), lupakohde.kunnat)
  };

  const categoryFilterChangeObj = find(
    propEq("anchor", "categoryFilter"),
    _changeObjects
  );

  const byProvince = categoryFilterChangeObj
    ? categoryFilterChangeObj.properties.changesByProvince
    : {};

  const removalsByProvince = getChangeObjects(false);
  const additionsByProvince = getChangeObjects(true);

  const diff = (a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  };

  return [
    {
      anchor: "changes",
      layout: { indentation: "none", margins: { top: "none" } },
      categories: [
        {
          anchor: "current",
          layout: { indentation: "none", margins: { top: "none" } },
          title: __("current"),
          components: [
            {
              name: "StatusTextRow",
              properties: {
                title: join(
                  ", ",
                  sort(diff, concat(current.maakunnat, current.kunnat))
                )
              }
            }
          ]
        },
        {
          anchor: "removed",
          layout: {
            indentation: "none"
          },
          title: __("toBeRemoved"),
          components: [
            {
              name: "StatusTextRow",
              properties: {
                title: join(
                  ", ",
                  sort(
                    diff,
                    map(
                      path(["properties", "metadata", "title"]),
                      flatten(values(removalsByProvince))
                    ).filter(Boolean)
                  )
                )
              }
            }
          ]
        },
        {
          anchor: "added",
          layout: {
            indentation: "none"
          },
          title: __("toBeAdded"),
          components: [
            {
              name: "StatusTextRow",
              properties: {
                title: join(
                  ", ",
                  sort(
                    diff,
                    map(
                      path(["properties", "metadata", "title"]),
                      flatten(values(additionsByProvince))
                    ).filter(Boolean)
                  )
                )
              }
            }
          ]
        }
      ]
    },
    {
      anchor: "reasoning",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            isRequired: true,
            title: "Perustelut",
            value: ""
          }
        }
      ]
    }
  ];
}

export default async function getToimintaaluelomake(
  mode,
  data,
  booleans,
  locale,
  changeObjects = [],
  functions
) {
  switch (mode) {
    case "modification":
      return await getModificationForm(
        data,
        booleans,
        locale,
        changeObjects,
        functions
      );
    case "reasoning":
      return await getReasoningForm(booleans, data.lupakohde, changeObjects);
    default:
      return [];
  }
}
