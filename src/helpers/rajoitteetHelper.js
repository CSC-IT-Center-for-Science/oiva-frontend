import { append, find, includes, last, nth, path, prop, propEq } from "ramda";

const koodistoMapping = {
  maaraaika: "kujalisamaareet",
  opetustehtavat: "opetustehtava",
  toimintaalue: "opetustaAntavatKunnat",
  opetuskielet: "opetuskieli"
};

const tunnisteMapping = {
  maaraaika: "maaraaika",
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
  const isMaaraAikaRajoite = !!find(asetus => includes(".alkamispaiva", asetus.anchor), asetukset);
  const asetusChangeObj = nth(index, asetukset);
  const valueChangeObj = nth(index + 1, asetukset);
  const valueValueOfAsetusChangeObj = path(["properties", "value", "value"], asetusChangeObj);
  const sectionOfAsetusChangeObj = path(
    ["properties", "metadata", "section"],
    asetusChangeObj
  );

  let koodiarvo =
    path(["properties", "value", "value"], valueChangeObj) ||
    path(["properties", "metadata", "koodiarvo"], asetusChangeObj);

  if(isMaaraAikaRajoite) {
    koodiarvo = "3";
  }

  let koodisto = "";

  if (valueValueOfAsetusChangeObj) {
    // Kyseessä voi olla pudotusvalikko, jolloin koodiston arvo löytyy
    // pudotusvalikosta valitun arvon perusteella { label: ..., value: X }
    koodisto = prop(valueValueOfAsetusChangeObj, koodistoMapping);
  } else if (sectionOfAsetusChangeObj) {
    // Esim. määräajan tapauksessa elementti ei ole pudotusvalikko, joten
    // koodistoarvo tulee etsiä toisella tavalla. Tällaisissa tapauksissa
    // voidaan hyödyntää muutosobjektin metadataa, jonne tieto on kenties
    // laitettu talteen.
    koodisto = prop(sectionOfAsetusChangeObj, koodistoMapping);
  }

  const tunniste = paalomakkeenBEMuutos.kohde.tunniste

  const alimaarayksenParent =
    index === 0
      ? paalomakkeenBEMuutos.generatedId
      : prop("generatedId", last(muutosobjektit));

  const alimaarays = {
    generatedId: `alimaarays-${index}`,
    parent: alimaarayksenParent,
    kohde: find(propEq("tunniste", tunniste), kohteet),
    koodiarvo,
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
