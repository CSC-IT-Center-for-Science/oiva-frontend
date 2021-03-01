import { kohdevaihtoehdot } from "../rajoite";
import { find, head, map, path, propEq, toUpper } from "ramda";
import { getKujalisamaareetFromStorage } from "helpers/kujalisamaareet";

/**
 Tässä tiedostossa määritellään, mitä asetuksia/kriteerejä kullekin
 rajoitteen kohteelle on valittavissa.
 */

const oppilaitokset = {
  label: "Oppilaitokset",
  value: "oppilaitokset"
};

export const getAsetuksenKohdekomponentti = async (
  asetuksenKohdeavain,
  isReadOnly = false,
  locale,
  index
) => {
  const localeUpper = toUpper(locale);

  const ajalla = head(await getKujalisamaareetFromStorage("ajalla"));

  const maaraaikaOption = {
    value: `${path(["koodisto", "koodistoUri"], ajalla)}_${ajalla.koodiarvo}`,
    label: ajalla.metadata[localeUpper].nimi
  };

  if (asetuksenKohdeavain === "erityisetKoulutustehtavat") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        isReadOnly,
        isVisible: !isReadOnly,
        options: [
          find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
          find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
          find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
          find(propEq("value", "opetuksenJarjestamismuodot"), kohdevaihtoehdot),
          maaraaikaOption,
          oppilaitokset
        ],
        value: ""
      }
    };
  } else if (
    asetuksenKohdeavain === "kokonaismaara" ||
    asetuksenKohdeavain === "opiskelijamaarat"
  ) {
    const kujalisamaareet = await getKujalisamaareetFromStorage();
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
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
                oppilaitokset
              ]
      }
    };
  } else if (asetuksenKohdeavain === "lukumaara") {
    const kujalisamaareet = await getKujalisamaareetFromStorage(
      "joistaLisaksi"
    );
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
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
      }
    };
  } else if (asetuksenKohdeavain === "muutEhdot") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
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
          oppilaitokset
        ],
        value: ""
      }
    };
  } else if (asetuksenKohdeavain === "opetuksenJarjestamismuodot") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        isReadOnly,
        isVisible: !isReadOnly,
        options: [
          find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
          find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
          find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
          maaraaikaOption,
          oppilaitokset
        ],
        value: ""
      }
    };
  } else if (asetuksenKohdeavain === "opetuskielet") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        isReadOnly,
        isVisible: !isReadOnly,
        options: [
          find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
          maaraaikaOption,
          oppilaitokset
        ],
        value: ""
      }
    };
  } else if (asetuksenKohdeavain === "toimintaalue") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        isReadOnly,
        isVisible: !isReadOnly,
        options: [maaraaikaOption, oppilaitokset],
        value: ""
      }
    };
  } else if (asetuksenKohdeavain === "oikeusSisaoppilaitosmuotoiseenKoulutukseen") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        isReadOnly,
        isVisible: !isReadOnly,
        options: [
          find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
          find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
          maaraaikaOption,
          oppilaitokset
        ],
        value: ""
      }
    };
  } else {
    return {
      anchor: "ei-valittavia-kohteita",
      name: "StatusTextRow",
      properties: {
        title: "Ei valittavia kohteita"
      }
    };
  }
};
