import {
  compose,
  filter,
  find,
  flatten,
  includes,
  map,
  path,
  pathEq,
  prop,
  propEq
} from "ramda";
import { getAnchorPart } from "../../utils/common";

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  locale,
  kohteet,
  maaraykset
) => {
  const kohde = find(
    propEq("tunniste", "valtakunnallinenkehittamistehtava"),
    kohteet
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects.valtakunnallisetKehittamistehtavat
  );

  const valintaChangeObjs = filter(
    compose(includes(".valintaelementti"), prop("anchor")),
    changeObjects.valtakunnallisetKehittamistehtavat
  );

  const valtakunnallinenkehittamistehtavaMaaraykset = filter(
    maarays =>
      propEq("koodisto", "valtakunnallinenkehittamistehtava") &&
      pathEq(
        ["kohde", "tunniste"],
        "valtakunnallinenkehittamistehtava",
        maarays
      ),
    maaraykset || []
  );

  const uncheckedErityisetKoulutustehtavatCheckboxes = filter(
    erityinenKoulutustehtava =>
      getAnchorPart(erityinenKoulutustehtava.anchor, 2) ===
        "valintaelementti" &&
      path(["properties", "isChecked"], erityinenKoulutustehtava) === false,
    changeObjects.erityisetKoulutustehtavat
  );

  /** Käydään läpi uncheckatut erityiset koulutustehtävät. Jos 5 osiosta löytyy näitä vastaavia määräyksiä
   * luodaan niille poisto-objektit TODO: Poisto-objektien luonti poistettujen tekstikenttien perusteella */
  const poistoObjektitOsion4MuutostenPerusteella = map(
    uncheckedErityinenKoulutustehtava => {
      const vastaavat5OsionMaaraykset = filter(
        maarays =>
          maarays.koodiarvo ===
          getAnchorPart(uncheckedErityinenKoulutustehtava.anchor, 1),
        valtakunnallinenkehittamistehtavaMaaraykset
      );

      return map(maaraysOsio5 => {
        return {
          generatedId: `kehittamistehtava-${Math.random()}`,
          kohde,
          koodiarvo: maaraysOsio5.koodiarvo,
          koodisto: kohde.tunniste,
          maaraystyyppi,
          maaraysUuid: maaraysOsio5.uuid,
          meta: {
            ankkuri: path(["meta", "ankkuri"], maaraysOsio5)
          },
          tila: "POISTO"
        };
      }, vastaavat5OsionMaaraykset);
    },
    uncheckedErityisetKoulutustehtavatCheckboxes
  );

  const valintaBeChangeObjects = map(changeObj => {
    const koodiarvo = getAnchorPart(changeObj.anchor, 1);
    const ankkuri = getAnchorPart(changeObj.anchor, 2);
    const tila = path(["properties", "isChecked"], changeObj)
      ? "LISAYS"
      : "POISTO";

    const maaraysUuid =
      tila === "POISTO"
        ? prop(
            "uuid",
            find(
              maarays =>
                propEq("koodiarvo", koodiarvo, maarays) &&
                pathEq(["meta", "ankkuri"], ankkuri, maarays),
              valtakunnallinenkehittamistehtavaMaaraykset
            )
          )
        : null;

    return {
      generatedId: changeObj.anchor,
      kohde,
      koodiarvo: koodiarvo,
      koodisto: kohde.tunniste,
      maaraystyyppi,
      maaraysUuid,
      meta: {
        ankkuri,
        isChecked: path(["properties", "checked"], changeObj),
        changeObjects: flatten([changeObj]).filter(Boolean)
      },
      tila
    };
  }, valintaChangeObjs || []);

  const lisatiedotBEchangeObject = lisatiedotChangeObj
    ? {
        kohde,
        koodiarvo: path(
          ["properties", "metadata", "koodiarvo"],
          lisatiedotChangeObj
        ),
        koodisto: path(
          ["properties", "metadata", "koodisto", "koodistoUri"],
          lisatiedotChangeObj
        ),
        maaraystyyppi,
        meta: {
          arvo: path(["properties", "value"], lisatiedotChangeObj),
          changeObjects: [lisatiedotChangeObj]
        },
        tila: "LISAYS"
      }
    : null;

  return flatten([
    valintaBeChangeObjects,
    poistoObjektitOsion4MuutostenPerusteella,
    lisatiedotBEchangeObject
  ]).filter(Boolean);
};
