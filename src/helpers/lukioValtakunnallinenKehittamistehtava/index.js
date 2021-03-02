import { compose, concat, endsWith, find, flatten, includes, map, nth, path, prop, propEq, split } from "ramda";

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  locale,
  kohteet
) => {
  const { valtakunnallisetKehittamistehtavat } = changeObjects;

  const kohde = find(
    propEq("tunniste", "valtakunnallinenkehittamistehtava"),
    kohteet
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const muutokset = map((ehto, index) => {
    let koodiarvo = nth(1, split(".", ehto.anchor));
    // Checkbox-kenttien muutokset
    const checkboxChangeObj = find(
      compose(endsWith(koodiarvo + `.valintaelementti`), prop("anchor")),
      changeObjects.valtakunnallisetKehittamistehtavat
    );

    let checkboxBEchangeObject = null;

    checkboxBEchangeObject = checkboxChangeObj
      ? {
        generatedId: `valtakunnallinenKehittamistehtava-${Math.random()}`,
        kohde,
        koodiarvo: koodiarvo,
        koodisto: "valtakunnallinenkehittamistehtava",
        maaraystyyppi,
        meta: {
          changeObjects: flatten(
            concat([], [
              checkboxChangeObj
            ])
            // checkboxChangeObj
          ).filter(Boolean)
        },
        tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
      }
      : null;

    return [checkboxBEchangeObject];
  }, valtakunnallisetKehittamistehtavat);

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects.valtakunnallisetKehittamistehtavat
  );

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

  const objects = flatten([muutokset, lisatiedotBEchangeObject]).filter(
    Boolean
  );

  return objects;
};
