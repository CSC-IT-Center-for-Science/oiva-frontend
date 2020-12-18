import { prop } from "ramda";

const maaraaikaOption = {
  value: "maaraaika",
  label: "Määräaika"
};

const asetuksenKohdekomponentit = {
  kokonaismaara: {
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
  },
  opetustehtavat: {
    anchor: "kohde",
    name: "Autocomplete",
    layout: { indentation: "none" },
    styleClasses: ["w-4/5 xl:w-2/3 mb-6"],
    properties: {
      isMulti: false,
      options: [maaraaikaOption],
      value: maaraaikaOption
    }
  }
};

export const getAsetuksenKohdekomponentti = (
  kohteenTarkenninavain,
  kohdeavain
) => {
  const asetusvalinnat = prop(
    kohdeavain || kohteenTarkenninavain,
    asetuksenKohdekomponentit
  );
  return asetusvalinnat || [];
};
