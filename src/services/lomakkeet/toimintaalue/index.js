import { getKunnatFromStorage } from "helpers/kunnat";
import { getMaakunnat, getMaakuntakunnat } from "helpers/maakunnat";
import {
  filter,
  find,
  includes,
  map,
  mapObjIndexed,
  pathEq,
  prop,
  propEq,
  toUpper
} from "ramda";
import { isAdded, isRemoved, isInLupa } from "css/label";
import kuntaProvinceMapping from "utils/kuntaProvinceMapping";

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
  "10": "FI-04",
  "11": "FI-15",
  "12": "FI-13",
  "14": "FI-03",
  "16": "FI-07",
  "13": "FI-08",
  "15": "FI-12",
  "17": "FI-14",
  "18": "FI-05",
  "19": "FI-10",
  "21": "FI-01"
};

export const getToimintaaluelomake = async (
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
  const kunnat = await getKunnatFromStorage();
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
