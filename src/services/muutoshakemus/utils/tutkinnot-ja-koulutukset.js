import * as R from "ramda";
import { getMetadata } from "./tutkinnotUtils";

const getMuutos = (changeObj, stateItem) => {
  let koulutus = {};
  const anchorParts = changeObj.anchor.split(".");
  const code = R.last(anchorParts);
  const meta = getMetadata(R.slice(1, 3)(anchorParts), stateItem.categories);
  const finnishInfo = R.find(R.propEq("kieli", "FI"), meta.metadata);
  if (stateItem.article) {
    if (stateItem.article.koulutusalat[anchorParts[1]]) {
      koulutus =
        R.find(
          R.propEq("koodi", code),
          stateItem.article.koulutusalat[anchorParts[1]].koulutukset
        ) || {};
    }
  }
  return {
    isInLupa: meta.isInLupa,
    kohde: koulutus.kohde || meta.kohde,
    koodiarvo: code,
    koodisto: meta.koodisto.koodistoUri,
    kuvaus: finnishInfo.kuvaus,
    maaraystyyppi: koulutus.maaraystyyppi || meta.maaraystyyppi,
    meta: {
      changeObj,
      nimi: koulutus.nimi,
      koulutusala: anchorParts[0],
      koulutustyyppi: anchorParts[1],
      perusteluteksti: null,
      muutosperustelukoodiarvo: []
    },
    nimi: finnishInfo.nimi,
    tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
    type: changeObj.properties.isChecked ? "addition" : "removal"
  };
};

export default function getChangesOfTutkinnotJaKoulutukset(
  changeObjects = {},
  tutkinnot = {},
  koulutukset = {}
) {
  const tutkinnotMuutokset = !R.isEmpty(tutkinnot)
    ? R.flatten(
        R.values(
          R.mapObjIndexed((changes, areaCode) => {
            const stateItem = R.find(R.propEq("areaCode", areaCode))(
              tutkinnot.items
            );
            return R.values(
              R.map(changeObj => {
                return getMuutos(changeObj, stateItem);
              }, changes)
            );
          }, changeObjects.tutkinnot)
        )
      )
    : [];

  const koulutuksetMuutokset = !R.isEmpty(koulutukset)
    ? R.flatten(
        R.values(
          R.mapObjIndexed((changes, name) => {
            return R.values(
              R.map(changeObj => {
                const anchorParts = changeObj.anchor.split(".");
                const code = R.view(R.lensIndex(1))(anchorParts);
                const meta = getMetadata(
                  R.slice(1, -1)(anchorParts),
                  koulutukset[name].categories
                );
                const finnishInfo = R.find(
                  R.propEq("kieli", "FI"),
                  meta.metadata
                );
                return {
                  isInLupa: meta.isInLupa,
                  kohde: meta.kohde,
                  koodiarvo: code,
                  koodisto: meta.koodisto.koodistoUri,
                  maaraystyyppi: meta.maaraystyyppi,
                  meta: {
                    changeObj,
                    perusteluteksti: null,
                    muutosperustelukoodiarvo: []
                  },
                  nimi: finnishInfo.nimi,
                  tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
                  type: changeObj.properties.isChecked ? "addition" : "removal"
                };
              }, changes)
            );
          }, changeObjects.koulutukset)
        )
      )
    : [];

  return R.flatten([tutkinnotMuutokset, koulutuksetMuutokset]);
}
