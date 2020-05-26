import { createRules, ifOneTerm, getPathByAnchor } from "../utils";
import { requiredFields } from "./requiredFields";
import { assocPath, compose, concat, not, isEmpty } from "ramda";

export function getRules(_lomake) {
  // Rules for top three fields of muutospyyntö
  const simpleRules = createRules(requiredFields);

  const advancedRules = [
    {
      isRequired: () => true,
      markRequiredFields: lomake => {
        const _path = getPathByAnchor(["asianumero", "A"], lomake);
        return assocPath(
          concat(_path, ["properties", "isRequired"]),
          true,
          lomake
        );
      },
      isValid: (lomake, changeObjects) => {
        return () =>
          ifOneTerm(
            [
              {
                anchor: "asianumero.A",
                properties: {
                  value: value => {
                    const isValid = /^VN\/[0-9]{1,6}\/[0-9]{4}$/.test(value);
                    return isValid;
                  }
                }
              }
            ],
            lomake,
            changeObjects
          );
      },
      showErrors: (lomake, isValid) => {
        const _path = getPathByAnchor(["asianumero", "A"], lomake);
        return assocPath(
          concat(_path, ["properties", "isValid"]),
          isValid,
          lomake
        );
      }
    }
  ];

  return concat(simpleRules, advancedRules);
}
