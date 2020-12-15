import { append, find, last, nth, path, prop, propEq } from "ramda";

const koodistoMapping = {
  opetustehtavat: "opetustehtava",
  toimintaalue: "opetustaAntavatKunnat",
  opetuskielet: "opetuskieli"
};

const tunnisteMapping = {
  opetustehtavat: "opetusjotalupakoskee",
  toimintaalue: "kunnatjoissaopetustajarjestetaan",
  opetuskielet: "opetuskieli"
};

export const createAlimaarayksetBEObjects = (
  kohteet,
  maaraystyypit,
  paalomakkeenBEMuutos, // myöhemmin lomakedata käyttöön
  asetukset,
  muutosobjektit = [],
  index = 0
) => {
  const asetusChangeObj = nth(index, asetukset);
  const valueChangeObj = nth(index + 1, asetukset);
  const valueValueOfAsetusChangeObj = path(
    ["properties", "value", "value"],
    asetusChangeObj
  );

  const koodisto = prop(valueValueOfAsetusChangeObj, koodistoMapping);
  const tunniste = prop(valueValueOfAsetusChangeObj, tunnisteMapping);

  const alimaarays = {
    generatedId: `alimaarays-${index}`,
    parent:
      index === 0
        ? paalomakkeenBEMuutos.generatedId
        : last(muutosobjektit).generatedId,
    kohde: find(propEq("tunniste", tunniste), kohteet),
    koodiarvo: path(["properties", "value", "value"], valueChangeObj),
    koodisto,
    maaraystyyppi: find(propEq("tunniste", "RAJOITE"), maaraystyypit),
    meta: {
      changeObjects: [asetusChangeObj, nth(index + 1, asetukset)]
    }
  };

  const updatedMuutosobjektit = append(alimaarays, muutosobjektit);

  if (index + 2 <= asetukset.length - 2) {
    return createAlimaarayksetBEObjects(
      kohteet,
      maaraystyypit,
      paalomakkeenBEMuutos,
      asetukset,
      updatedMuutosobjektit,
      index + 2
    );
  }

  return updatedMuutosobjektit;
};
