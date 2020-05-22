import * as R from "ramda";
import {
  createRules,
  createTerms,
  getPathByAnchor,
  ifOneTerm
} from "../../../../utils";
import { requiredFields } from "./requiredFields";

export const removalRules = createRules(requiredFields.removal);

export const additionRules = R.concat(createRules(requiredFields.addition), [
  {
    isRequired: () => true,
    /**
     * Modify form to include asterisks to indicated that user should fill
     * the related fields.
     **/
    markRequiredFields: (lomake, isRequired) => {
      const anchor = "2.voimassaolo.title";
      const _path = getPathByAnchor(R.split(".", anchor), lomake);
      return R.assocPath(
        R.concat(_path, ["properties", "isRequired"]),
        isRequired,
        lomake
      );
    },
    // Here we can set fields as mandatory
    isValid: (lomake, changeObjects, isRequired) => {
      return isRequired
        ? () =>
            ifOneTerm(
              R.flatten(
                createTerms(
                  R.path([0, "categories", 1, "categories"], lomake),
                  { name: "RadioButtonWithLabel" },
                  {
                    properties: {
                      isChecked: true
                    }
                  },
                  ["2", "voimassaolo"]
                )
              ),
              lomake,
              changeObjects
            )
        : () => true;
    },
    showErrors: (lomake, isValid) => {
      const anchor = "2.voimassaolo.title";
      const _path = getPathByAnchor(R.split(".", anchor), lomake);
      return R.assocPath(
        R.concat(_path, ["properties", "isValid"]),
        isValid,
        lomake
      );
    }
  }
]);
