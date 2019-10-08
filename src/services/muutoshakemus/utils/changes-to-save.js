import { getMetadata } from "./tutkinnotUtils";
import { getAnchorPart } from "../../../utils/common";
import * as R from "ramda";

const getTutkintoMuutos = (tutkintoAnchor, stateItem, changeObjs) => {

  // stateitem: kuvaa staattista tilaa
  // changeObjs: yhden tutkinnon alle kuuluvat muutokset tutkinto- tai rajaus-tasolla
  console.log("%c argumentit", "background: yellow;", tutkintoAnchor, stateItem, changeObjs);

  let koulutus = {};
  const anchorParts = R.split(".", tutkintoAnchor);
  const koulutusCode = R.last(anchorParts);
  const meta = getMetadata(R.slice(1, 3)(anchorParts), stateItem.categories);
  const finnishInfo = R.find(R.propEq("kieli", "FI"), meta.metadata);
  if (stateItem.article) {
    if (stateItem.article.koulutusalat[anchorParts[1]]) {
      koulutus =
        R.find(
          R.propEq("koodi", koulutusCode),
          stateItem.article.koulutusalat[anchorParts[1]].koulutukset
        ) || {};
    }
  }

  const alimaaraykset = R.filter(o =>
    R.gt(
      R.compose(R.length, R.split("."), R.prop("anchor"))(o),
      R.length(anchorParts)+1))
  (changeObjs);

  const muutos = {
    isInLupa: meta.isInLupa,
    kohde: koulutus.kohde || meta.kohde,
    koodiarvo: koulutusCode,
    koodisto: meta.koodisto.koodistoUri,
    kuvaus: finnishInfo.kuvaus,
    maaraystyyppi: koulutus.maaraystyyppi || meta.maaraystyyppi,
  //   meta: {
  //     changeObjects: R.flatten([[changeObj], perustelut]),
  //     nimi: koulutus.nimi,
  //     koulutusala: anchorParts[0],
  //     koulutustyyppi: anchorParts[1],
  //     perusteluteksti: null,
  //     muutosperustelukoodiarvo: []
  //   },
    nimi: finnishInfo.nimi,
  //   tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
  //   type: changeObj.properties.isChecked ? "addition" : "removal",
    aliMaaraykset: R.map(changeObj => {
      const anchorParts = R.split(".", changeObj.anchor);
      const meta = getMetadata(R.slice(1, 4)(anchorParts), stateItem.categories);

      return {
        isInLupa: meta.isInLupa,
        kohde: meta.kohde,
        koodiarvo: R.nth(-2)(anchorParts),
        koodisto: meta.koodisto.koodistoUri,
        kuvaus: finnishInfo.kuvaus,
        maaraystyyppi: meta.maaraystyyppi,
        nimi: R.find(R.propEq("kieli", "FI"), meta.metadata)
      };
    })(alimaaraykset) || []
  };

  console.log('%c 123muutos', 'background:red', muutos, alimaaraykset);

  return muutos;
};

export const getChangesToSave = (
  key,
  stateObject = {},
  changeObjects = {},
  backendMuutokset = []
) => {
  const paivitetytBackendMuutokset = R.map(changeObj => {
    const anchorInit = R.compose(
      R.join("."),
      R.init,
      R.split("."),
      R.prop("anchor")
    )(changeObj);
    const backendMuutos = R.find(muutos => {
      return !!R.find(
        R.startsWith(anchorInit),
        R.map(
          R.compose(
            R.join("."),
            R.init,
            R.split("."),
            R.prop("anchor")
          ),
          R.path(["meta", "changeObjects"], muutos)
        )
      );
    }, backendMuutokset);
    if (backendMuutos) {
      const perustelutAnchorInitial = `perustelut_${anchorInit}`;
      const perustelut = R.filter(
        R.compose(
          R.contains(perustelutAnchorInitial),
          R.prop("anchor")
        ),
        changeObjects.perustelut
      );
      return R.assocPath(
        ["meta", "changeObjects"],
        R.flatten([[changeObj], perustelut]),
        backendMuutos
      );
    }
    return backendMuutos;
  }, changeObjects.muutokset).filter(Boolean);

  const alreadyHandledChangeObjects = R.flatten(
    R.map(R.path(["meta", "changeObjects"]))(paivitetytBackendMuutokset)
  );

  const unhandledChangeObjects = R.difference(
    changeObjects.muutokset,
    alreadyHandledChangeObjects
  );

  console.log(key + " käsittelemättömät", unhandledChangeObjects, paivitetytBackendMuutokset);

  let uudetMuutokset = [];

  if (key === "tutkinnot") {
    const muuttuneetTutkinnot = R.compose(
      R.uniq,
      R.map(R.compose(R.join('.'), R.take(3), R.split("."), R.prop("anchor"))),
      R.filter(Boolean))
    (unhandledChangeObjects);

    console.log("%c #####", "background:lightblue;", muuttuneetTutkinnot, stateObject.items);

    uudetMuutokset = stateObject.items
      ? R.map(tutkintoPrefix => {
        const areaCode = R.compose(R.nth(1), R.split(/[_\\.]/))(tutkintoPrefix);

        return getTutkintoMuutos(
          tutkintoPrefix,
          R.find(R.propEq("areaCode", areaCode))(stateObject.items),
          R.filter(R.compose(R.startsWith(tutkintoPrefix), R.prop("anchor")))(unhandledChangeObjects));
      })(muuttuneetTutkinnot)
      : [];
  } else if (key === "koulutukset") {
    uudetMuutokset = R.map(changeObj => {
      const stateData =
        stateObject[
          R.compose(
            R.last,
            R.split("_")
          )(getAnchorPart(changeObj.anchor, 0))
        ];
      const anchorInit = R.compose(
        R.join("."),
        R.init,
        R.split(".")
      )(changeObj.anchor);
      const code = getAnchorPart(changeObj.anchor, 1);
      const meta = getMetadata([code], stateData.categories);
      const finnishInfo = R.find(R.propEq("kieli", "FI"), meta.metadata);
      const perustelut = R.filter(
        R.compose(
          R.contains(anchorInit),
          R.prop("anchor")
        ),
        changeObjects.perustelut
      );
      return {
        isInLupa: meta.isInLupa,
        kohde: meta.kohde,
        koodiarvo: code,
        koodisto: meta.koodisto.koodistoUri,
        maaraystyyppi: meta.maaraystyyppi,
        meta: {
          changeObjects: R.flatten([[changeObj], perustelut]),
          perusteluteksti: null,
          muutosperustelukoodiarvo: []
        },
        nimi: finnishInfo.nimi,
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
        type: changeObj.properties.isChecked ? "addition" : "removal"
      };
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "tutkintokielet") {
    uudetMuutokset = R.map(changeObj => {
      const anchorParts = changeObj.anchor.split(".");
      const areaCode = R.compose(
        R.view(R.lensIndex(2)),
        R.split("_")
      )(anchorParts[0]);
      const item = R.find(R.propEq("areaCode", areaCode))(stateObject.items);
      const anchorInit = R.compose(
        R.join("."),
        R.init,
        R.split(".")
      )(changeObj.anchor);
      const perustelut = R.filter(
        R.compose(
          R.contains(anchorInit),
          R.prop("anchor")
        ),
        changeObjects.perustelut
      );
      const code = getAnchorPart(changeObj.anchor, 1);
      const meta =
        item && item.categories
          ? getMetadata(R.slice(1, 3)(anchorParts), item.categories)
          : {};
      return {
        koodiarvo: code,
        koodisto: stateObject.koodistoUri,
        nimi: meta.nimi, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
        kuvaus: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
        isInLupa: meta.isInLupa,
        kohde: meta.kohde,
        maaraystyyppi: meta.maaraystyyppi,
        meta: {
          tunniste: "tutkintokieli",
          changeObjects: R.flatten([[changeObj], perustelut])
        },
        tila: "LISAYS",
        type: "addition"
      };
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "muut") {
    uudetMuutokset = R.map(changeObj => {
      const anchorInit = R.compose(
        R.join("."),
        R.init,
        R.split(".")
      )(changeObj.anchor);
      const anchorArr = R.split(".", changeObj.anchor);
      const areaCode = R.compose(
        R.last,
        R.split("_"),
        R.view(R.lensIndex(0))
      )(anchorArr);
      const section = R.find(R.propEq("code", areaCode))(stateObject.muutdata);
      let category = false;
      let maarays = false;
      if (section) {
        category = R.map(item => {
          return R.find(R.propEq("anchor", anchorArr[2]), item.categories);
        })(section.categories).filter(Boolean)[0];
        maarays = R.map(item => {
          return R.find(R.propEq("koodiArvo", anchorArr[2]), item.articles);
        })(section.data).filter(Boolean)[0];
      }

      let tila = changeObj.properties.isChecked ? "LISAYS" : "POISTO";
      let type = changeObj.properties.isChecked ? "addition" : "removal";

      if (
        (changeObj.properties.isChecked === undefined ||
          changeObj.properties.isChecked === null) &&
        changeObj.properties.value
      ) {
        tila = "MUUTOS";
        type = "modification";
      }

      const perustelut = R.filter(
        R.compose(
          R.contains(anchorInit),
          R.prop("anchor")
        ),
        changeObjects.perustelut
      );

      return {
        koodiarvo: maarays.koodiArvo,
        koodisto: maarays.koodisto.koodistoUri,
        isInLupa: category.meta.isInLupa,
        kohde: stateObject.kohde,
        maaraystyyppi: stateObject.maaraystyyppi,
        meta: { changeObjects: R.flatten([[changeObj], perustelut]) },
        tila: tila,
        type: type
      };
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "opiskelijavuodet") {
    uudetMuutokset = R.map(changeObj => {
      let koodisto = "koulutussektori";
      const anchorParts = R.split(".", changeObj.anchor);
      const categoryKey = R.view(R.lensIndex(1))(anchorParts);
      const koodiarvo = R.prop(
        categoryKey,
        stateObject.opiskelijavuodet.koodiarvot
      );
      const muutCategory = R.find(R.propEq("key", categoryKey))(
        stateObject.muut.muutdata
      );
      console.info(muutCategory);
      if (muutCategory) {
        const meta = R.find(R.propEq("anchor", koodiarvo))(
          R.flatten(R.map(R.prop("categories"), muutCategory.categories))
        ).meta;
        koodisto = meta.koodisto.koodistoUri;
      }

      // TODO: Define the list of perustelut for opiskelijavuodet
      const perustelut = [];

      return {
        arvo: changeObj.properties.applyForValue,
        kategoria: R.head(anchorParts),
        koodiarvo,
        koodisto,
        kohde: stateObject.opiskelijavuodet.kohde,
        maaraystyyppi: stateObject.opiskelijavuodet.maaraystyyppi,
        meta: { changeObjects: R.flatten([[changeObj], perustelut]) },
        tila: "MUUTOS",
        type: "change"
      };
    }, unhandledChangeObjects).filter(Boolean);
  }

  console.log('%c ' + key, 'color:green;', changeObjects, paivitetytBackendMuutokset, uudetMuutokset);

  return R.flatten([paivitetytBackendMuutokset, uudetMuutokset]);
};
