import * as R from "ramda";
import { getMetadata } from "./tutkinnotUtils";

const getMuutos = (changeObj, stateItem) => {
  let koulutus = {};
  const anchorParts = changeObj.anchor.split(".");
  const code = R.last(anchorParts);
  const meta = getMetadata(R.tail(anchorParts), stateItem.categories);
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
  tutkinnot,
  valmentavatKoulutukset
) {
  const tutkinnotMuutokset = R.flatten(
    R.map(stateItem => {
      return R.map(changeObj => {
        return getMuutos(changeObj, stateItem);
      }, stateItem.changes);
    }, tutkinnot.state)
  );

  const valmentavatKoulutuksetMuutokset = R.map(changeObj => {
    console.info(changeObj, valmentavatKoulutukset.state.categories);
    const anchorParts = changeObj.anchor.split(".");
    const code = R.last(anchorParts);
    const meta = getMetadata(
      R.tail(anchorParts),
      valmentavatKoulutukset.state.categories
    );
    const finnishInfo = R.find(R.propEq("kieli", "FI"), meta.metadata);
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
  }, valmentavatKoulutukset.state.changes);

  return R.flatten([tutkinnotMuutokset, valmentavatKoulutuksetMuutokset]);
}
