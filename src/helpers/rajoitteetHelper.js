import {
  append,
  compose,
  addIndex,
  endsWith,
  find,
  findIndex,
  flatten,
  head,
  includes,
  isNil,
  last,
  map,
  nth,
  path,
  pipe,
  prop,
  propEq,
  reject,
  split,
  test,
  toLower,
  uniqBy
} from "ramda";
import moment from "moment";

const koodistoMapping = {
  maaraaika: "kujalisamaareet",
  opetustehtavat: "opetustehtava",
  opiskelijamaarat: "oppilasopiskelijamaara",
  oppilaitokset: "oppilaitos",
  toimintaalue: "kunta",
  opetuskielet: "kielikoodistoopetushallinto",
  opetuksenJarjestamismuodot: "opetuksenjarjestamismuoto"
};

function isAsetusKohdennuksenKohdennus(asetusChangeObj) {
  return test(
    /^.+kohdennukset\.\d\.kohdennukset\.\d\.kohde/,
    prop("anchor", asetusChangeObj)
  );
}

export const createAlimaarayksetBEObjects = (
  kohteet,
  maaraystyypit,
  paalomakkeenBEMuutos, // myöhemmin lomakedata käyttöön
  asetukset,
  muutosobjektit = [],
  index = 0,
  kohdennuksenKohdeNumber = 0,
  insideMulti = false
) => {
  let offset = 2;
  const asetusChangeObj = nth(index, asetukset);
  const valueChangeObj = nth(index + 1, asetukset);
  const valueOfValueChangeObj = path(["properties", "value"], valueChangeObj);
  const valueValueOfAsetusChangeObj = path(
    ["properties", "value", "value"],
    asetusChangeObj
  );
  const sectionOfAsetusChangeObj =
    path(["properties", "metadata", "section"], asetusChangeObj) ||
    valueValueOfAsetusChangeObj;

  let koodiarvo =
    path(["properties", "value", "value"], valueChangeObj) ||
    path(["properties", "metadata", "koodiarvo"], asetusChangeObj);

  // Käsittele aikamääre rajoite
  let alkupvm = null;
  let loppupvm = null;
  if (includes("kujalisamaareetlisaksiajalla", valueValueOfAsetusChangeObj)) {
    offset = 3;
    alkupvm =
      path(
        ["properties", "value"],
        find(compose(endsWith(".alkamispaiva"), prop("anchor")), asetukset)
      ) || valueOfValueChangeObj;

    loppupvm =
      path(
        ["properties", "value"],
        find(compose(endsWith(".paattymispaiva"), prop("anchor")), asetukset)
      ) || pipe(nth(index + 2), path(["properties", "value"]))(asetukset);
  }

  let koodisto = "";

  if (valueValueOfAsetusChangeObj) {
    // Kyseessä voi olla pudotusvalikko, jolloin koodiston arvo löytyy
    // pudotusvalikosta valitun arvon perusteella { label: ..., value: X }
    koodisto =
      prop(valueValueOfAsetusChangeObj, koodistoMapping) ||
      head(split("_", valueValueOfAsetusChangeObj));

    if (koodisto === "oppilaitos") {
      koodiarvo = "1";
    } else {
      koodiarvo = koodiarvo || last(split("_", valueValueOfAsetusChangeObj));
    }
  } else if (sectionOfAsetusChangeObj) {
    // Jossain tapauksessa elementti ei ole pudotusvalikko, joten
    // koodistoarvo tulee etsiä toisella tavalla. Tällaisissa tapauksissa
    // voidaan hyödyntää muutosobjektin metadataa, jonne tieto on kenties
    // laitettu talteen.
    koodisto = prop(sectionOfAsetusChangeObj, koodistoMapping);
  }

  const tunniste = path(["kohde", "tunniste"], paalomakkeenBEMuutos);

  const isKohdennuksenKohdennus = isAsetusKohdennuksenKohdennus(
    asetusChangeObj
  );
  if (isKohdennuksenKohdennus) {
    kohdennuksenKohdeNumber += 1;
    insideMulti = false;
  }
  const nextKohdennuksenKohdennusIndex = findIndex(asetus => {
    return test(
      new RegExp(
        `^.+kohdennukset\\.\\d\\.kohdennukset\\.${kohdennuksenKohdeNumber}\\.kohde`
      ),
      asetus.anchor
    );
  })(asetukset);
  const alimaarayksenParent =
    index === 0
      ? prop("generatedId", paalomakkeenBEMuutos)
      : isKohdennuksenKohdennus
      ? prop("generatedId", head(muutosobjektit))
      : prop("generatedId", last(muutosobjektit));

  let arvo = endsWith("lukumaara", path(["anchor"], valueChangeObj))
    ? valueOfValueChangeObj
    : null;

  const multiSelectValues = Array.isArray(valueOfValueChangeObj)
    ? valueOfValueChangeObj
    : [valueOfValueChangeObj];
  const mapIndex = addIndex(map);

  const result = pipe(
    mapIndex((multiselectValue, multiIndex) => {
      const codeValue =
        koodisto === "oppilaitos"
          ? koodiarvo
          : path(["value"], multiselectValue) || koodiarvo;


      const changeObjects = [
        asetusChangeObj,
        nth(index + 1, asetukset),
        includes("kujalisamaareetlisaksiajalla", valueValueOfAsetusChangeObj) ? [
          find(
            compose(endsWith(".alkamispaiva"), prop("anchor")),
            asetukset
          ) || null,
          find(
            compose(endsWith(".paattymispaiva"), prop("anchor")),
            asetukset
          ) || null
        ] : null
      ]

      const alimaarays = reject(isNil, {
        generatedId: `alimaarays-${Math.random()}`,
        parent: alimaarayksenParent,
        kohde: find(propEq("tunniste", tunniste), kohteet),
        koodiarvo:
          koodisto === "kielikoodistoopetushallinto"
            ? toLower(codeValue)
            : codeValue,
        koodisto,
        tila: "LISAYS",
        arvo,
        maaraystyyppi: find(propEq("tunniste", "RAJOITE"), maaraystyypit),
        meta: {
          ...(alkupvm
            ? { alkupvm: moment(alkupvm).format("YYYY-MM-DD") }
            : null),
          ...(loppupvm
            ? { loppupvm: moment(loppupvm).format("YYYY-MM-DD") }
            : null),
          changeObjects: changeObjects.filter(Boolean),
          kuvaus: prop("label", multiselectValue)
        },
        orgOid:
          koodisto === "oppilaitos"
            ? prop("value", multiselectValue)
            : undefined
      });

      const updatedMuutosobjektit = append(alimaarays, muutosobjektit);
      const nextAsetusChangeObj = nth(index + offset, asetukset);

      let end =
        nextKohdennuksenKohdennusIndex >= 0
          ? nextKohdennuksenKohdennusIndex
          : asetukset.length - offset;
      end =
        insideMulti && isAsetusKohdennuksenKohdennus(nextAsetusChangeObj)
          ? end - 1
          : end;
      let start = index + offset;
      if (start <= end) {
        return createAlimaarayksetBEObjects(
          kohteet,
          maaraystyypit,
          paalomakkeenBEMuutos,
          asetukset,
          updatedMuutosobjektit,
          start,
          kohdennuksenKohdeNumber,
          insideMulti || multiIndex > 0
        );
      }
      return updatedMuutosobjektit;
    }),
    flatten,
    uniqBy(prop("generatedId"))
  )(multiSelectValues);

  return result;
};
