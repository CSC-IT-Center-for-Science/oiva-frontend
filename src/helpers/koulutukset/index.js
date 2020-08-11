import { findObjectWithKey, getAnchorPart } from "../../utils/common";
import {
  find,
  map,
  propEq,
  join,
  init,
  split,
  compose,
  filter,
  includes,
  prop,
  path,
  flatten,
  dissoc,
  omit,
  mapObjIndexed,
  head,
  groupBy
} from "ramda";
import { fillForBackend } from "../../services/lomakkeet/backendMappings";

export const initializeKoulutus = koulutus => {
  return {
    ...omit(["koodiArvo"], koulutus),
    koodiarvo: koulutus.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), koulutus.metadata))
  };
};

export const getChangesToSave = (
  changeObjects = {},
  kohde,
  maaraystyypit,
  localeUpper
) =>
  map(changeObj => {
    const anchorInit = compose(join("."), init, split("."))(changeObj.anchor);
    const code = getAnchorPart(changeObj.anchor, 1);
    const metadata = path(["properties", "metadata"], changeObj);
    const perustelut = filter(
      compose(includes(anchorInit), prop("anchor")),
      changeObjects.perustelut
    );
    const perustelutForBackend = fillForBackend(perustelut, changeObj.anchor);

    const perusteluteksti = perustelutForBackend
      ? null
      : map(perustelu => {
          if (path(["properties", "value"], perustelu)) {
            return { value: path(["properties", "value"], perustelu) };
          }
          return {
            value: path(["properties", "metadata", "fieldName"], perustelu)
          };
        }, perustelut);

    let meta = Object.assign(
      {},
      {
        changeObjects: flatten([[changeObj], perustelut]),
        muutosperustelukoodiarvo: []
      },
      perustelutForBackend,
      perusteluteksti ? { perusteluteksti } : null
    );

    return {
      isInLupa: metadata.isInLupa,
      liitteet: map(file => {
        return dissoc("tiedosto", file);
      }, findObjectWithKey(changeObjects, "attachments")),
      kohde,
      koodiarvo: code,
      koodisto: metadata.koodisto.koodistoUri,
      maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
      maaraysUuid: metadata.maaraysUuid,
      meta,
      nimi: metadata.metadata[localeUpper].nimi,
      tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
    };
  }, changeObjects.muutokset).filter(Boolean);
