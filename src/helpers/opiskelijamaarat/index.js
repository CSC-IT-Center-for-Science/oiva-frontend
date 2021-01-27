import { getKujalisamaareetFromStorage } from "helpers/kujalisamaareet";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";
import {
  compose,
  drop,
  find,
  hasPath,
  includes,
  mapObjIndexed,
  not,
  path,
  pathEq,
  pipe,
  prop,
  propEq,
  reject,
  unnest,
  values
} from "ramda";
import { sortRestrictions } from "utils/rajoitteetUtils";

export const defineBackendChangeObjects = async (
  changeObjects = {},
  maaraystyypit,
  locale,
  kohteet
) => {
  const { rajoitteetByRajoiteId } = changeObjects;
  const lisamaareet = await getKujalisamaareetFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();
  const kohde = find(propEq("tunniste", "oppilasopiskelijamaara"), kohteet);
  const maaraystyyppi = find(propEq("tunniste", "RAJOITE"), maaraystyypit);

  const restrictionsSorted = sortRestrictions(rajoitteetByRajoiteId);

  console.info(restrictionsSorted, lisamaareet);

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
        drop(2, reject(pathEq(["properties", "value"], ""),
          asetukset)
        )
      );
    }, rajoitteetByRajoiteId)
  );

  console.info(alimaaraykset);

  // Lisää kaikki rajoitus muutosobjektit parent muutokselle
  const paaMuutos = pipe(unnest,
    find(v => not(path(["parent"], v)))
  )(alimaaraykset);
  if (paaMuutos) {
    paaMuutos.meta = { changeObjects: values(rajoitteetByRajoiteId) };
  }

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
