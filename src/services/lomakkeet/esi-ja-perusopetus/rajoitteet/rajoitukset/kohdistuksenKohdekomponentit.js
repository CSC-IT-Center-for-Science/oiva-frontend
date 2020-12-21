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
  }
};

export const getKohdistuksenKohdekomponentti = (
  kohteenTarkenninavain,
  kohdeavain
) => {
  const komponentti = getKomponentti(kohteenTarkenninavain || kohdeavain);
  return komponentti;
};
