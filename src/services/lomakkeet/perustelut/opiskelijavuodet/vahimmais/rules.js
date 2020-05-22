import {
  getCategoriesByProps,
  createTerms,
  getPathByAnchor,
  ifOne,
  ifAll,
  ifOneTerm,
  ifTerm
} from "../../../utils";
import * as R from "ramda";

export function getRules(_lomake) {
  const muutosperusteluCategories = R.uniq(
    R.flatten(getCategoriesByProps(_lomake, { anchor: "perustelut" }))
  );
  // Rules for muutosperustelut (one of the checkboxes must be checked)
  const muutosPerustelutRules = R.map(category => {
    return {
      isRequired: () => true,
      markRequiredFields: (lomake, isRequired) => {
        const _path = getPathByAnchor(
          R.split(".", category.fullAnchor),
          lomake
        );
        return R.assocPath(R.concat(_path, ["isRequired"]), isRequired, lomake);
      },
      isValid: (lomake, changeObjects, isRequired) => {
        const checkboxTerms = R.flatten(
          createTerms(
            category.categories,
            { name: "CheckboxWithLabel" },
            {
              properties: {
                isChecked: true
              }
            },
            R.split(".", category.fullAnchor)
          )
        );
        const lastCheckboxTerm = {
          anchor: R.join(".", [
            category.fullAnchor,
            R.last(category.categories).anchor,
            R.last(category.categories).components[0].anchor
          ]),
          properties: {
            isChecked: true
          }
        };
        const muuPerusteluTerm = {
          anchor: R.join(".", [
            category.fullAnchor,
            R.last(category.categories).anchor,
            R.last(category.categories).categories[0].anchor,
            R.last(category.categories).categories[0].components[0].anchor
          ]),
          properties: {
            value: R.compose(R.not, R.isEmpty)
          }
        };
        return isRequired
          ? () =>
              // isValid = true if at least one of the following terms is true
              ifOne([
                // If all the following terms are true
                ifAll([
                  // If one of the checkboxes is checked (last one excluded)
                  ifOneTerm(checkboxTerms, lomake, changeObjects),
                  // If the last checkbox (Muut syyt) is not checked
                  !ifTerm(lastCheckboxTerm, lomake, changeObjects)
                ]),
                // If all the following terms are true (requirements fulfilled)
                ifAll([
                  // If Muut syyt is selected
                  ifTerm(lastCheckboxTerm, lomake, changeObjects),
                  // and the reasoning field under it is not empty
                  ifTerm(muuPerusteluTerm, lomake, changeObjects)
                ])
              ])
          : // If field is optional isValid is true without exceptions
            () => true;
      },
      showErrors: (lomake, isValid) => {
        const _path = getPathByAnchor(
          R.split(".", category.fullAnchor),
          lomake
        );
        return R.assocPath(R.concat(_path, ["isValid"]), isValid, lomake);
      }
    };
  }, muutosperusteluCategories);

  return muutosPerustelutRules;
}
