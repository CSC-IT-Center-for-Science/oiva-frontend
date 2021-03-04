import { find, head, is, map, path, prop, propEq, toUpper } from "ramda";
import { getKujalisamaareetFromStorage } from "helpers/kujalisamaareet";

/**
 Tässä tiedostossa määritellään, mitä asetuksia/kriteerejä kullekin
 rajoitteen kohteelle on valittavissa.
 */
export const getAsetuksenKohdekomponentti = async (
  asetuksenKohdeavain,
  kohdevaihtoehdot = [],
  koulutustyyppi,
  isReadOnly = false,
  locale,
  index,
  inputId
) => {
  const localeUpper = toUpper(locale);
  console.info(koulutustyyppi);
  const kujalisamaareet = await getKujalisamaareetFromStorage("joistaLisaksi");

  const ajalla = head(await getKujalisamaareetFromStorage("ajalla"));

  const maaraaikaOption = {
    value: `${path(["koodisto", "koodistoUri"], ajalla)}_${ajalla.koodiarvo}`,
    label: ajalla.metadata[localeUpper].nimi
  };

  function getOptionObjects(optionKeys) {
    return map(keyOrObject => {
      if (is(String, keyOrObject)) {
        return find(propEq("value", keyOrObject), kohdevaihtoehdot);
      } else {
        return keyOrObject;
      }
    }, optionKeys);
  }

  const erityisetKoulutustehtavatProperties = {
    inputId,
    isMulti: false,
    isReadOnly,
    isVisible: !isReadOnly,
    options: getOptionObjects([
      "opetustehtavat",
      "toimintaalue",
      "opetuskielet",
      "opetuksenJarjestamismuodot",
      maaraaikaOption,
      "oppilaitokset"
    ]),
    value: ""
  };

  let properties = {
    erityisetKoulutustehtavat_1: erityisetKoulutustehtavatProperties,
    erityisetKoulutustehtavat_2: erityisetKoulutustehtavatProperties,
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
      options: getOptionObjects([
        "opetustehtavat",
        "toimintaalue",
        "opetuskielet",
        "opetuksenJarjestamismuodot",
        "erityisetKoulutustehtavat",
        maaraaikaOption,
        "oppilaitokset"
      ]),
      value: ""
    },
    opetuksenJarjestamismuodot: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: getOptionObjects([
        "opetustehtavat",
        "toimintaalue",
        "opetuskielet",
        maaraaikaOption,
        "oppilaitokset"
      ]),
      value: ""
    },
    opetuskielet: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: getOptionObjects(
        [
          koulutustyyppi === "1" ? "opetustehtavat" : null,
          "toimintaalue",
          maaraaikaOption,
          "oppilaitokset"
        ].filter(Boolean)
      ),
      value: ""
    },
    opetustehtavat: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: getOptionObjects([maaraaikaOption, "oppilaitokset"]),
      value: ""
    },
    toimintaalue: {
      inputId,
      isMulti: false,
      isReadOnly,
      isVisible: !isReadOnly,
      options: getOptionObjects([
        "opetustehtavat",
        maaraaikaOption,
        "oppilaitokset"
      ]),
      value: ""
    }
  };

  let propertiesToReturn = prop(asetuksenKohdeavain, properties);

  if (
    asetuksenKohdeavain === "kokonaismaara" ||
    asetuksenKohdeavain === "opiskelijamaarat"
  ) {
    const kujalisamaareet = await getKujalisamaareetFromStorage();
    propertiesToReturn = {
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
          : getOptionObjects([
              "opetustehtavat",
              "toimintaalue",
              "opetuskielet",
              "opetuksenJarjestamismuodot",
              "erityisetKoulutustehtavat",
              maaraaikaOption,
              "oppilaitokset"
            ])
    };
  }

  console.info(asetuksenKohdeavain, propertiesToReturn);

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
