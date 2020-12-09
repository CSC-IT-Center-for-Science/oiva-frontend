import { getKujalisamaareetFromStorage } from "helpers/kujalisamaareet";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { compose, endsWith, find, includes, path, prop, propEq } from "ramda";

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  locale,
  kohteet
) => {
  const lisamaareet = await getKujalisamaareetFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();
  const kohde = find(propEq("tunniste", "oppilasopiskelijamaara"), kohteet);
  const maaraystyyppi = find(propEq("tunniste", "RAJOITE"), maaraystyypit);

  /**
   * Dropdown-kentän ja input-kentän yhdistelmästä muodostetaan
   * backend-muotoinen muutosobjekti.
   */
  const dropdownChangeObj = find(
    compose(endsWith(".dropdown"), prop("anchor")),
    changeObjects
  );

  const inputChangeObj = find(
    compose(endsWith(".input"), prop("anchor")),
    changeObjects
  );

  const { selectedOption: dropdownKoodiarvo } = !!dropdownChangeObj
    ? dropdownChangeObj.properties
    : {};

  const lisamaareObj = find(
    propEq("koodiarvo", dropdownKoodiarvo),
    lisamaareet
  );

  const dropdownInputBEchangeObject =
    !!dropdownKoodiarvo && !!inputChangeObj && !!lisamaareObj
      ? {
          arvo: path(["properties", "value"], inputChangeObj),
          kohde,
          koodiarvo: dropdownKoodiarvo,
          koodisto: lisamaareObj.koodisto.koodistoUri,
          maaraystyyppi,
          meta: {
            changeObjects: [dropdownChangeObj, inputChangeObj]
          },
          tila: "LISAYS"
        }
      : null;

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotObj = find(propEq("koodiarvo", "1"), lisatiedot);

  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects
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

  const allBEchangeObjects = [
    dropdownInputBEchangeObject,
    lisatiedotBEchangeObject
  ].filter(Boolean);

  return allBEchangeObjects;
};
