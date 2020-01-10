import { getMetadata } from "./tutkinnotUtils";
import { getAnchorsStartingWith } from "../../../utils/common";
import * as R from "ramda";

export const getChangesOfOpetuskielet = (
  stateObject = {},
  changeObjects = [],
  backendMuutokset = []
) => {
  const backendMuutoksetWithChangeObjects = R.map(muutos => {
    const changeObjectsWithCurrentKoodiarvo = R.filter(changeObj => {
      return R.equals(
        R.view(R.lensIndex(1), changeObj.anchor.split(".")),
        muutos.koodiarvo
      );
    }, changeObjects);
    return R.assocPath(
      ["meta", "changeObjects"],
      changeObjectsWithCurrentKoodiarvo,
      muutos
    );
  }, backendMuutokset);

  const changeObjectsLeft = R.difference(
    changeObjects,
    R.flatten(
      R.map(R.path(["meta", "changeObjects"]))(
        backendMuutoksetWithChangeObjects
      )
    )
  );

  const page1Changes = getAnchorsStartingWith(
    "kielet_opetuskielet",
    changeObjectsLeft
  );

  const perustelutChanges = getAnchorsStartingWith(
    "perustelut_kielet_opetuskielet",
    changeObjectsLeft
  );

  const newObjectsToSave = R.map(changeObj => {
    const anchorParts = changeObj.anchor.split(".");
    const code = R.view(R.lensIndex(1), anchorParts);
    if (stateObject) {
      const meta = getMetadata(
        R.view(R.lensIndex(1))(anchorParts),
        stateObject.categories
      );
      const perustelut = R.filter(
        R.compose(
          R.equals(code),
          R.view(R.lensIndex(1)),
          R.split("."),
          R.prop("anchor")
        ),
        perustelutChanges
      );
      return {
        koodiarvo: code,
        koodisto: "oppilaitoksenopetuskieli",
        nimi: meta.kuvaus,
        kuvaus: meta.kuvaus,
        isInLupa: meta.isInLupa,
        kohde: meta.kohde.kohdeArvot[0].kohde,
        maaraystyyppi: meta.maaraystyyppi,
        type: changeObj.properties.isChecked ? "addition" : "removal",
        meta: {
          changeObjects: R.flatten([[changeObj], perustelut]),
          key: "opetuskieli"
        },
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
      };
    }
    return null;
  }, page1Changes).filter(Boolean);
  return R.flatten([backendMuutoksetWithChangeObjects, newObjectsToSave]);
};
