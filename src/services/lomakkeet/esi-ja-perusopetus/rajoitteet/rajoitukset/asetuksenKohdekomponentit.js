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

const getKomponentti = key => {
  if (key === "erityisetKoulutustehtavat") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
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
  } else if (key === "kokonaismaara") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
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
  } else if (key === "lukumaara") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
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
  } else if (key === "muutEhdot") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
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
  } else if (key === "opetuksenJarjestamismuodot") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        options: [
          find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
          find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
          find(propEq("value", "opetuskielet"), kohdevaihtoehdot),
          maaraaikaOption
        ],
        value: ""
      }
    };
  } else if (key === "opetuskielet") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        options: [
          find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
          find(propEq("value", "toimintaalue"), kohdevaihtoehdot),
          maaraaikaOption
        ],
        value: ""
      }
    };
  } else if (key === "opetustehtavat") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        options: [maaraaikaOption],
        value: maaraaikaOption
      }
    };
  } else if (key === "opiskelijamaarat") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
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
  } else if (key === "toimintaalue") {
    return {
      anchor: "kohde",
      name: "Autocomplete",
      layout: { indentation: "none" },
      styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
      properties: {
        isMulti: false,
        options: [
          find(propEq("value", "opetustehtavat"), kohdevaihtoehdot),
          maaraaikaOption
        ],
        value: ""
      }
    };
  }
};

export const getAsetuksenKohdekomponentti = asetuksenKohdeavain => {
  return getKomponentti(asetuksenKohdeavain);
};
