import { getKunnatFromStorage } from "helpers/kunnat";
import { getMaakunnat, getMaakuntakunnat } from "helpers/maakunnat";
import {
  compose,
  flatten,
  filter,
  find,
  includes,
  isEmpty,
  map,
  mapObjIndexed,
  not,
  pathEq,
  prop,
  propEq,
  toUpper
} from "ramda";
import { isAdded, isRemoved, isInLupa } from "css/label";
import kuntaProvinceMapping from "utils/kuntaProvinceMapping";
import { __ } from "i18n-for-browser";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";

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

export const opetustaAntavatKunnat = async (
  {
    fiCode,
    isEditViewActive,
    changeObjectsByProvince = {},
    localizations,
    kuntamaaraykset,
    maakuntamaaraykset,
    maaraykset,
    quickFilterChanges = [],
    valtakunnallinenMaarays
  },
  { isReadOnly },
  locale,
  changeObjects,
  { onChanges, toggleEditView }
) => {
  const kunnat = await getKunnatFromStorage();
  const maakunnat = await getMaakunnat();
  const maakuntakunnat = await getMaakuntakunnat();
  const lisatiedot = await getLisatiedotFromStorage();

  const ulkomaa = find(propEq("koodiarvo", "200"), kunnat);

  const kunnatIlmanUlkomaata = filter(
    // 200 = Ulkomaa
    compose(not, propEq("koodiarvo", "200")),
    kunnat
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  const localeUpper = toUpper(locale);
  const maaraysUuid = valtakunnallinenMaarays
    ? valtakunnallinenMaarays.uuid
    : undefined;
  const options = map(maakunta => {
    console.info(maakunta, maakuntamaaraykset);
    const isMaakuntaInLupa = !!find(
      propEq("koodiarvo", maakunta.koodiarvo),
      maakuntamaaraykset
    );

      console.info(isMaakuntaInLupa, maakunta);

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
        kuntamaaraykset
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
      const result = find(k => {
        return (
          propEq("kuntaKoodiarvo", kunta.koodiarvo, k) &&
          includes(k.kuntaKoodiarvo, map(prop("koodiarvo"), presentKunnat))
        );
      }, kuntaProvinceMapping);
      if (result) {
        mapObjIndexed((value, key) => {
          if (value === result.maakuntaKey) {
            maakuntaCode = key;
          }
        }, mapping);
      }
      return maakuntaCode === maakunta.koodiarvo;
    }, kuntamaaraykset);
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

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const noSelectionsInLupa =
    isEmpty(maakuntamaaraykset) && isEmpty(kuntamaaraykset) && fiCode !== "FI1";

  console.info(options);

  const lomakerakenne = flatten(
    [
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
              municipalities: kunnatIlmanUlkomaata,
              onChanges,
              toggleEditView,
              provinces: options,
              provincesWithoutMunicipalities: maakunnat,
              showCategoryTitles: false,
              quickFilterChanges: quickFilterChanges,
              nothingInLupa: noSelectionsInLupa,
              koulutustyyppi: "esiJaPerusopetus"
            }
          }
        ]
      },
      !!ulkomaa
        ? {
            anchor: "ulkomaa",
            components: [
              {
                anchor: ulkomaa.koodiarvo,
                name: "CheckboxWithLabel",
                properties: {
                  forChangeObject: {
                    koodiarvo: ulkomaa.koodiarvo,
                    koodisto: ulkomaa.koodisto,
                    versio: ulkomaa.versio,
                    voimassaAlkuPvm: ulkomaa.voimassaAlkuPvm
                  },
                  labelStyles: {
                    addition: isAdded,
                    removal: isRemoved,
                    // TODO: määritä oikea ehto ja arvo
                    custom: Object.assign({}, !!false ? isInLupa : {})
                  },
                  isChecked: false,
                  isIndeterminate: false,
                  isReadOnly,
                  title: __("education.opetustaSuomenUlkopuolella")
                },
                styleClasses: ["mt-8"]
              }
            ],
            categories: [
              {
                anchor: ulkomaa.koodiarvo,
                components: [
                  {
                    anchor: "lisatiedot",
                    name: "TextBox",
                    properties: {
                      forChangeObject: {
                        koodiarvo: ulkomaa.koodiarvo,
                        koodisto: ulkomaa.koodisto,
                        versio: ulkomaa.versio,
                        voimassaAlkuPvm: ulkomaa.voimassaAlkuPvm
                      },
                      isReadOnly,
                      placeholder: __("common.maaJaPaikkakunta"),
                      title: __("common.maaJaPaikkakunta")
                    }
                  }
                ]
              }
            ]
          }
        : null,
      lisatiedotObj
        ? [
            {
              anchor: "lisatiedotTitle",
              layout: { margins: { top: "large" } },
              components: [
                {
                  anchor: lisatiedotObj.koodiarvo,
                  name: "StatusTextRow",
                  styleClasses: ["pt-8", "border-t"],
                  properties: {
                    title: __("common.lisatiedotInfo")
                  }
                }
              ]
            },
            {
              anchor: "lisatiedot",
              components: [
                {
                  anchor: lisatiedotObj.koodiarvo,
                  name: "TextBox",
                  properties: {
                    forChangeObject: {
                      koodiarvo: lisatiedotObj.koodiarvo,
                      koodisto: lisatiedotObj.koodisto,
                      versio: lisatiedotObj.versio,
                      voimassaAlkuPvm: lisatiedotObj.voimassaAlkuPvm
                    },
                    isReadOnly,
                    placeholder: (lisatiedotObj.metadata[toUpper(locale)] || {})
                      .nimi,
                    value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
                  }
                }
              ]
            }
          ]
        : null
    ].filter(Boolean)
  );

  console.info(lomakerakenne);

  return lomakerakenne;
};
