import { find, head, map, path, prop, propEq, toUpper } from "ramda";
import { getKujalisamaareetFromStorage } from "helpers/kujalisamaareet";

/**
 Tässä tiedostossa määritellään, mitä asetuksia/kriteerejä kullekin
 rajoitteen kohteelle on valittavissa.
 */
export const getAsetuksenKohdekomponentti = async (
  asetuksenKohdeavain,
  kohdevaihtoehdot = [],
  isReadOnly = false,
  locale,
  index,
  inputId
) => {
  const localeUpper = toUpper(locale);

  const kujalisamaareet = await getKujalisamaareetFromStorage("joistaLisaksi");

  const ajalla = head(await getKujalisamaareetFromStorage("ajalla"));

  const maaraaikaOption = {
    value: `${path(["koodisto", "koodistoUri"], ajalla)}_${ajalla.koodiarvo}`,
    label: ajalla.metadata[localeUpper].nimi
  };

  let properties = {
    erityisetKoulutustehtavat: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: [
        find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
        find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
        find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
        find(propEq("value", "opetuksenJarjestamismuodot"), kohdevaihtoehdot),
        maaraaikaOption,
        find(propEq("value", "oppilaitokset"), kohdevaihtoehdot)
      ],
      value: ""
    },
    lukumaara: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: map(maare => {
        const koodistoUri = path(["koodisto", "koodistoUri"], maare);
        return {
          value: `${koodistoUri}_${maare.koodiarvo}`,
          label: maare.metadata[localeUpper].nimi
        };
      }, kujalisamaareet)
    },
    muutEhdot: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: [
        find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
        find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
        find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
        find(propEq("value", "opetuksenJarjestamismuodot"), kohdevaihtoehdot),
        find(propEq("value", "erityisetKoulutustehtavat"), kohdevaihtoehdot),
        maaraaikaOption,
        find(propEq("value", "oppilaitokset"), kohdevaihtoehdot)
      ],
      value: ""
    },
    opetuksenJarjestamismuodot: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: [
        find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
        find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
        find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
        maaraaikaOption,
        find(propEq("value", "oppilaitokset"), kohdevaihtoehdot)
      ],
      value: ""
    },
    opetuskielet: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: [
        find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
        find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
        maaraaikaOption,
        find(propEq("value", "oppilaitokset"), kohdevaihtoehdot)
      ],
      value: ""
    },
    opetustehtavat: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: [
        maaraaikaOption,
        find(propEq("value", "oppilaitokset"), kohdevaihtoehdot)
      ],
      value: ""
    },
    toimintaalue: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: [
        find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
        maaraaikaOption,
        find(propEq("value", "oppilaitokset"), kohdevaihtoehdot)
      ],
      value: ""
    }
  };

  if (
    asetuksenKohdeavain === "kokonaismaara" ||
    asetuksenKohdeavain === "opiskelijamaarat"
  ) {
    const kujalisamaareet = await getKujalisamaareetFromStorage();
    return {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options:
        index === 0
          ? map(maare => {
              const koodistoUri = path(["koodisto", "koodistoUri"], maare);
              return {
                value: `${koodistoUri}_${maare.koodiarvo}`,
                label: maare.metadata[localeUpper].nimi
              };
            }, kujalisamaareet)
          : [
              find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
              find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
              find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
              find(
                propEq("value", "opetuksenJarjestamismuodot"),
                kohdevaihtoehdot
              ),
              find(
                propEq("value", "erityisetKoulutustehtavat"),
                kohdevaihtoehdot
              ),
              maaraaikaOption,
              find(propEq("value", "oppilaitokset"), kohdevaihtoehdot)
            ]
    };
  }

  const propertiesToReturn = prop(asetuksenKohdeavain, properties);

  return propertiesToReturn
    ? {
        anchor: "kohde",
        name: "Autocomplete",
        layout: { indentation: "none" },
        styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
        properties: propertiesToReturn
      }
    : {
        anchor: "ei-valittavia-kohteita",
        name: "StatusTextRow",
        properties: {
          title: "Ei valittavia kohteita"
        }
      };
};
