import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";
import {
  compose,
  drop,
  find,
  flatten,
  forEach,
  includes,
  last,
  mapObjIndexed,
  not,
  path,
  pathEq,
  prop,
  propEq,
  reject,
  split,
  values
} from "ramda";
import { getAnchorPart } from "../../utils/common";

export const defineBackendChangeObjects = async (
  changeObjects = {},
  maaraystyypit,
  locale,
  kohteet
) => {
  const { rajoitteetByRajoiteId } = changeObjects;
  const lisatiedot = await getLisatiedotFromStorage();
  const kohde = find(propEq("tunniste", "oppilasopiskelijamaara"), kohteet);
  const maaraystyyppi = find(propEq("tunniste", "RAJOITE"), maaraystyypit);

  // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
  // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
  // loput toisiinsa "alenevassa polvessa".
  const alimaaraykset = values(
    mapObjIndexed(asetukset => {
      return createAlimaarayksetBEObjects(
        kohteet,
        maaraystyypit,
        { kohde },
        // Poista kaksi ensimmäistä asetusta ja asetukset joissa ei ole
        // value arvoa (kohdennuksenkohdennus).
        drop(2, reject(pathEq(["properties", "value"], ""), asetukset))
      );
    }, rajoitteetByRajoiteId)
  );

  // Lisää rajoitus muutosobjektit parent muutoksille
  forEach(alimaarays => {
    if (not(path["parent"], alimaarays)) {
      const rajoiteId = last(
        split("_", getAnchorPart(alimaarays.meta.changeObjects[0].anchor, 0))
      );
      const rajoiteObjWithRajoitteenTyyppi = find(
        rajoiteObj =>
          path(["properties", "metadata", "section"], rajoiteObj) ===
          "opiskelijamaarat",
        rajoitteetByRajoiteId[rajoiteId]
      );
      // Miksi tyyppi tulee kaikille Cobjeille?
      console.log(alimaarays.meta);
      alimaarays.meta = {
        ...alimaarays.meta,
        changeObjects: values(rajoitteetByRajoiteId[rajoiteId]),
        tyyppi: path(
          ["properties", "value", "value"],
          rajoiteObjWithRajoitteenTyyppi
        )
      };
    }
  }, flatten(alimaaraykset));
  console.log(alimaaraykset);
  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotObj = find(propEq("koodiarvo", "1"), lisatiedot);

  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects.opiskelijamaarat
  );

  const lisatiedotBEchangeObject =
    !!lisatiedotChangeObj && !!lisatiedotObj
      ? {
          kohde,
          koodiarvo: lisatiedotObj.koodiarvo,
          koodisto: lisatiedotObj.koodisto.koodistoUri,
          maaraystyyppi,
          meta: {
            arvo: path(["properties", "value"], lisatiedotChangeObj),
            changeObjects: [lisatiedotChangeObj]
          },
          tila: "LISAYS"
        }
      : null;

  const allBEchangeObjects = [lisatiedotBEchangeObject].filter(Boolean);

  return [allBEchangeObjects, alimaaraykset];
};
