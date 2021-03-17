import {
  map,
  find,
  pathEq,
  not,
  includes,
  prop,
  path,
  filter,
  uniq,
  concat,
  propEq,
  toUpper
} from "ramda";
import { __ } from "i18n-for-browser";
import {
  getEnsisijaisetOpetuskieletOPHFromStorage,
  getToissijaisetOpetuskieletOPHFromStorage
} from "helpers/opetuskielet";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getLocalizedProperty } from "../utils";

export async function getOpetuskieletOPHLomake(
  { maaraykset },
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const ensisijaisetOpetuskieletOPH = await getEnsisijaisetOpetuskieletOPHFromStorage();
  const toissijaisetOpetuskieletOPH = await getToissijaisetOpetuskieletOPHFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  const valitutEnsisijaisetKoodiarvot = map(
    prop("value"),
    path([0, "properties", "value"], changeObjects) || []
  );

  const valitutToissijaisetKoodiarvot = map(
    prop("value"),
    path([1, "properties", "value"], changeObjects) || []
  );

  const valitutKoodiarvot = uniq(
    concat(valitutEnsisijaisetKoodiarvot, valitutToissijaisetKoodiarvot)
  );

  const valittavanaOlevatEnsisisijaisetOpetuskielet = filter(
    kieli => not(includes(kieli.koodiarvo, valitutKoodiarvot)),
    ensisijaisetOpetuskieletOPH || []
  );

  const valittavanaOlevatToissisijaisetOpetuskielet = filter(
    kieli => not(includes(kieli.koodiarvo, valitutKoodiarvot)),
    toissijaisetOpetuskieletOPH || []
  );

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const ensisijaisetAnchor = "ensisijaiset";
  const toissijaisetAnchor = "toissijaiset";

  const ensisijaisetOpetuskieletOptions = map(kieli => {
    return {
      label: getLocalizedProperty(kieli.metadata, locale, "nimi"),
      value: kieli.koodiarvo
    };
  }, valittavanaOlevatEnsisisijaisetOpetuskielet);

  const toissijaisetOpetuskieletOptions = map(kieli => {
    return {
      label: getLocalizedProperty(kieli.metadata, locale, "nimi"),
      value: kieli.koodiarvo
    };
  }, valittavanaOlevatToissisijaisetOpetuskielet);

  const lomakerakenne = [
    {
      anchor: "opetuskieli",
      title: "Opetuskieli",
      components: [
        {
          anchor: ensisijaisetAnchor,
          name: "Autocomplete",
          short: true,
          properties: {
            forChangeObject: {
              valikko: ensisijaisetAnchor
            },
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            options: ensisijaisetOpetuskieletOptions,
            title: __("common.valitseYksiTaiUseampi"),
            value: map(maarays => {
              const maarayksenKoodiarvoUpper = toUpper(maarays.koodiarvo);
              const option = find(
                propEq("value", maarayksenKoodiarvoUpper),
                ensisijaisetOpetuskieletOptions
              );
              return option;
            }, filter(pathEq(["meta", "valikko"], ensisijaisetAnchor), maaraykset))
          }
        }
      ]
    },
    {
      anchor: "opetuskieli",
      title: __("education.voidaanAntaaMyosSeuraavillaKielilla"),
      layout: { indentation: "none" },
      components: [
        {
          anchor: toissijaisetAnchor,
          name: "Autocomplete",
          short: true,
          properties: {
            forChangeObject: {
              valikko: toissijaisetAnchor
            },
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            options: toissijaisetOpetuskieletOptions,
            title: __("common.valitseYksiTaiUseampi"),
            value: map(maarays => {
              const maarayksenKoodiarvoUpper = toUpper(maarays.koodiarvo);
              const option = find(
                propEq("value", maarayksenKoodiarvoUpper),
                toissijaisetOpetuskieletOptions
              );
              return option;
            }, filter(pathEq(["meta", "valikko"], toissijaisetAnchor), maaraykset))
          }
        }
      ]
    },
    {
      anchor: "opetuskieli",
      layout: { margins: { top: "large" } },
      styleClasses: ["mt-10", "pt-10", "border-t"],
      components: [
        {
          anchor: "lisatiedot-info",
          name: "StatusTextRow",
          properties: {
            title: __("common.lisatiedotInfo")
          }
        }
      ]
    },
    lisatiedotObj
      ? {
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
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                title: __("common.lisatiedot"),
                value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
              }
            }
          ]
        }
      : null
  ].filter(Boolean);

  return lomakerakenne;
}
