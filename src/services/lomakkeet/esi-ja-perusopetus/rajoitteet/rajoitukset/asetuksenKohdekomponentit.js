import { kohdevaihtoehdot } from "../rajoite";
import { find, propEq } from "ramda";

/**
 Tässä tiedostossa määritellään, mitä asetuksia/kriteerejä kullekin
 rajoitteen kohteelle on valittavissa.
 */

const maaraaikaOption = {
  value: "maaraaika",
  label: "Määräaika"
};

export const getAsetuksenKohdekomponentti = (
  asetuksenKohdeavain,
  isReadOnly = false
) => {
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
          maaraaikaOption
        ],
        value: ""
      }
    };
  } else if (asetuksenKohdeavain === "kokonaismaara") {
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
          {
            value: "enintaan",
            label: "Enintään"
          },
          {
            value: "vahintaan",
            label: "Vähintään"
          }
        ]
      }
    };
  } else if (asetuksenKohdeavain === "lukumaara") {
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
          {
            value: "joistaEnintaan",
            label: "Joista enintään"
          },
          {
            value: "joistaVahintaan",
            label: "Joista vähintään"
          },
          {
            value: "lisaksiEnintaan",
            label: "Lisäksi enintään"
          },
          {
            value: "lisaksiVahintaan",
            label: "Lisäksi vähintään"
          }
        ]
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
          maaraaikaOption
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
          maaraaikaOption
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
          find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
          find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
          maaraaikaOption
        ],
        value: ""
      }
    };
  } else if (asetuksenKohdeavain === "opetustehtavat") {
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
          maaraaikaOption
        ],
        value: ""
      }
    };
  } else if (asetuksenKohdeavain === "opiskelijamaarat") {
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
          {
            value: "enintaan",
            label: "Enintään"
          },
          {
            value: "vahintaan",
            label: "Vähintään"
          }
        ]
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
        options: [
          find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
          maaraaikaOption
        ],
        value: ""
      }
    };
  }
};
