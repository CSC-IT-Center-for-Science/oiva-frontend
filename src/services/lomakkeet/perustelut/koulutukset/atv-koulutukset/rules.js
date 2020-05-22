import * as R from "ramda";
import { getCategoriesByProps, getPathByAnchor, ifTerm } from "../../../utils";

export function getRules(_lomake) {
  const perustelukentatCategories = R.uniq(
    R.flatten(getCategoriesByProps(_lomake, { anchor: "perustelut" }))
  );

  // Rules for muutosperustelut (one of the checkboxes must be checked)
  const perustelukentatRules = R.map(category => {
    return {
      isRequired: () => true,
      markRequiredFields: (lomake, isRequired) => {
        const _path = getPathByAnchor(
          R.split(".", category.fullAnchor).concat("A"),
          lomake
        );
        return R.assocPath(
          R.concat(_path, ["properties", "isRequired"]),
          isRequired,
          lomake
        );
      },
      isValid: (lomake, changeObjects, isRequired) => {
        const term = {
          anchor: R.join(".", [
            category.fullAnchor,
            category.components[0].anchor
          ]),
          properties: {
            value: R.compose(R.not, R.isEmpty)
          }
        };
        return isRequired
          ? () => ifTerm(term, lomake, changeObjects)
          : // If field is optional isValid is true without exceptions
            () => true;
      },
      showErrors: (lomake, isValid) => {
        const _path = getPathByAnchor(
          R.split(".", category.fullAnchor).concat("A"),
          lomake
        );
        return R.assocPath(
          R.concat(_path, ["properties", "isValid"]),
          isValid,
          lomake
        );
      }
    };
  }, perustelukentatCategories);
  return perustelukentatRules;
}
