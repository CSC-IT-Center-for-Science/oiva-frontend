import * as R from "ramda";
import { createRules, getPathByAnchor, ifOneTerm } from "../../../../utils";
import { requiredFields } from "./requiredFields";

const basicRules = createRules(requiredFields);

const conditionalRules = [
  {
    isRequired: () => true,
    /**
     * Modify form to include asterisks to indicated that user should fill
     * the related fields.
     **/
    markRequiredFields: (lomake, isRequired) => {
      const _path = getPathByAnchor(["1", "voimassaolo", "title"], lomake);
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
              [
                {
                  anchor: "1.voimassaolo.voimassaolo-field-yes.A",
                  properties: { isChecked: true }
                },
                {
                  anchor: "1.voimassaolo.voimassaolo-field-no.A",
                  properties: { isChecked: true }
                }
              ],
              lomake,
              changeObjects
            )
        : () => true;
    },
    showErrors: (lomake, isValid) => {
      const _path = getPathByAnchor(["1", "voimassaolo", "title"], lomake);
      return R.assocPath(
        R.concat(_path, ["properties", "isValid"]),
        isValid,
        lomake
      );
    }
  }
];

export const rules = R.concat(basicRules, conditionalRules);
