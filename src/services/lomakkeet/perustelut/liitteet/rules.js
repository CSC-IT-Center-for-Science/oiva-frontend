import { getCategoriesByProps } from "../../utils";
import * as R from "ramda";
import {
  ifOneTerm,
  getPathByAnchor
} from "../../../../components/02-organisms/CategorizedListRoot/utils";

export function getRules(_lomake) {
  // Let's fetch all categories with TextBox element of the reasoning form.
  const textBoxCategories = R.uniq(
    R.flatten(getCategoriesByProps(_lomake, { anchor: "perustelut" }))
  );

  const rules = R.map(category => {
    return {
      isRequired: () => true,
      markRequiredFields: (lomake, isRequired) => {
        const _path = getPathByAnchor(
          R.split(".", category.fullAnchor),
          lomake
        );
        return R.assocPath(
          R.concat(_path, [
            "categories",
            0,
            "components",
            0,
            "properties",
            "isRequired"
          ]),
          isRequired,
          lomake
        );
      },
      isValid: (lomake, changeObjects, isRequired) => {
        return isRequired
          ? () =>
              // There is only one term but ifOneTerm function still can be used.
              ifOneTerm(
                [
                  {
                    // Full anchor of a textbox element
                    anchor: `${category.fullAnchor}.${category.components[0].anchor}`,
                    properties: {
                      // To get isValid = true TextBox's value must not be empty
                      value: R.compose(R.not, R.isEmpty)
                    }
                  }
                ],
                lomake,
                changeObjects
              )
          : () => true;
      },
      showErrors: (lomake, isValid) => {
        const _path = getPathByAnchor(
          R.split(".", category.fullAnchor),
          lomake
        );
        return R.assocPath(
          R.concat(_path, [
            "categories",
            0,
            "components",
            0,
            "properties",
            "isValid"
          ]),
          isValid,
          lomake
        );
      }
    };
  }, textBoxCategories);
  return rules;
}

export const rules = [];
