const maaraaikaOption = {
  value: "maaraaika",
  label: "Määräaika"
};

const getKomponentti = key => {
  if (key === "kokonaismaara") {
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
  }
};

export const getAsetuksenKohdekomponentti = asetuksenKohdeavain => {
  return getKomponentti(asetuksenKohdeavain);
};
