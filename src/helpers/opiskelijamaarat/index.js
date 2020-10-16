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
  const kohde = find(propEq("tunniste", "opiskelijavuodet"), kohteet); // TODO: Onko oikea kohde?
  const maaraystyyppi = find(propEq("tunniste", "RAJOITE"), maaraystyypit);

  /**
   * Dropdown-kentän backend-muotoisen muutosobjektin luominen.
   */
  const dropdownChangeObj = find(
    compose(endsWith(".dropdown"), prop("anchor")),
    changeObjects
  );

  const { selectedOption: dropdownKoodiarvo } = !!dropdownChangeObj
    ? dropdownChangeObj.properties
    : {};

  const lisamaareObj = find(
    propEq("koodiarvo", dropdownKoodiarvo),
    lisamaareet
  );

  const dropdownBEchangeObject =
    !!dropdownKoodiarvo && !!lisamaareObj
      ? {
          tila: "LISAYS",
          meta: {
            changeObjects: [dropdownChangeObj]
          },
          kohde,
          koodiarvo: dropdownKoodiarvo,
          koodisto: lisamaareObj.koodisto.koodistoUri,
          maaraystyyppi
        }
      : null;

  /**
   * Input-kentän backend-muotoisen muutosobjektin luominen.
   */
  const inputChangeObj = find(
    compose(endsWith(".input"), prop("anchor")),
    changeObjects
  );

  const inputBEchangeObject =
    !!inputChangeObj && !!lisamaareObj
      ? {
          tila: "LISAYS",
          meta: {
            arvo: path(["properties", "value"], inputChangeObj),
            changeObjects: [inputChangeObj]
          },
          kohde,
          koodiarvo: dropdownKoodiarvo,
          koodisto: lisamaareObj.koodisto.koodistoUri,
          maaraystyyppi
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
          tila: "LISAYS",
          meta: {
            arvo: path(["properties", "value"], lisatiedotChangeObj),
            changeObjects: [lisatiedotChangeObj]
          },
          kohde,
          koodiarvo: lisatiedotObj.koodiarvo,
          koodisto: lisatiedotObj.koodisto.koodistoUri,
          maaraystyyppi
        }
      : null;

  const allBEchangeObjects = [
    dropdownBEchangeObject,
    inputBEchangeObject,
    lisatiedotBEchangeObject
  ];

  return allBEchangeObjects;
};
