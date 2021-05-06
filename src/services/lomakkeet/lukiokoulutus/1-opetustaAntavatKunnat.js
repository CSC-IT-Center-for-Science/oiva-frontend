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
  hasPath
} from "ramda";
import { isAdded, isRemoved, isInLupa } from "css/label";
import kuntaProvinceMapping from "utils/kuntaProvinceMapping";
import { __ } from "i18n-for-browser";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getLocalizedProperty } from "../utils";
import { createDynamicTextFields } from "../dynamic";

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
    sectionId,
    valtakunnallinenMaarays
  },
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects,
  { onChanges, toggleEditView, onAddButtonClick }
) => {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
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

  const ulkomaillaSijaitsevatKunnat = filter(
    maarays =>
      propEq("koodiarvo", "200", maarays) && hasPath(["meta", "arvo"], maarays),
    kuntamaaraykset
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  const maaraysUuid = valtakunnallinenMaarays
    ? valtakunnallinenMaarays.uuid
    : undefined;
  const options = map(maakunta => {
    const isMaakuntaInLupa = !!find(
      propEq("koodiarvo", maakunta.koodiarvo),
      maakuntamaaraykset
    );

    let someMunicipalitiesInLupa = false;

    let someMunicipalitiesNotInLupa = false;

    const today = new Date();

    const presentKunnat = filter(
      ({ voimassaLoppuPvm }) =>
        !voimassaLoppuPvm || new Date(voimassaLoppuPvm) >= today,
      maakunta.kunnat
    );

    const municipalitiesOfProvince = map(kunta => {
      const kunnanNimi = getLocalizedProperty(kunta.metadata, locale, "nimi");

      const isKuntaInLupa = !!find(
        propEq("koodiarvo", kunta.koodiarvo),
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
            title: getLocalizedProperty(maakunta.metadata, locale, "nimi")
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

  const isUlkomaaCheckedByDefault = !!find(
    maarays =>
      propEq("koodiarvo", "200", maarays) &&
      !hasPath(["meta", "arvo"], maarays),
    kuntamaaraykset
  );

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
              locale,
              isPreviewModeOn,
              isReadOnly: _isReadOnly,
              anchor: "areaofaction",
              changeObjectsByProvince,
              isEditViewActive,
              localizations,
              municipalities: kunnatIlmanUlkomaata,
              onChanges,
              currentMunicipalities: maaraykset,
              toggleEditView,
              provinces: options,
              provincesWithoutMunicipalities: maakunnat,
              showCategoryTitles: false,
              quickFilterChanges: quickFilterChanges,
              nothingInLupa: noSelectionsInLupa,
              koulutustyyppi: "lukiokoulutus"
            }
          }
        ]
      },
      !!ulkomaa
        ? flatten([
            {
              anchor: ulkomaa.koodiarvo,
              components: [
                {
                  anchor: "valintaelementti",
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
                      custom: Object.assign(
                        {},
                        isUlkomaaCheckedByDefault ? isInLupa : {}
                      )
                    },
                    isChecked: isUlkomaaCheckedByDefault,
                    isIndeterminate: false,
                    isReadOnly,
                    title: __(
                      "education.opetustaJarjestetaanSuomenUlkopuolella"
                    )
                  },
                  styleClasses: ["mt-8"]
                }
              ],
              categories: createDynamicTextFields(
                sectionId,
                ulkomaillaSijaitsevatKunnat,
                changeObjects,
                ulkomaa.koodiarvo,
                onAddButtonClick,
                isPreviewModeOn,
                isReadOnly
              )
            }
          ])
        : null,
      lisatiedotObj
        ? [
            {
              anchor: "lisatiedotTitle",
              components: [
                {
                  anchor: lisatiedotObj.koodiarvo,
                  name: "StatusTextRow",
                  properties: {
                    title: __("common.lisatiedotInfo")
                  }
                }
              ],
              layout: { margins: { top: "large" } },
              styleClasses: ["mt-10", "pt-10", "border-t"]
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
                    title: __("common.lisatiedot"),
                    value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
                  }
                }
              ]
            }
          ]
        : null
    ].filter(Boolean)
  );

  return lomakerakenne;
};
