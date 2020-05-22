import * as R from "ramda";
import { getCategoriesByProps, getPathByAnchor, ifTerm } from "../../utils";

export function getRules(_lomake) {
  /**
   * There're multiple different forms on the reasoning page of section 5
   * (Muut oikeudet, velvollisuudet, ehdot ja tehtävät).
   * The forms must be validated differently
   **/
  let opiskelijavuodetCategories = null;
  let opiskelijavuodetRules = [];

  switch (_lomake[0].anchor) {
    case "laajennettu":
    case "vaativatuki":
    case "vankila":
      opiskelijavuodetCategories = R.uniq(
        R.flatten(getCategoriesByProps(_lomake, { anchor: "vuodet" }))
      );
      break;
    default:
      break;
  }
 
  if (opiskelijavuodetCategories) {
    // Rules for opiskelijavuodet fields
    opiskelijavuodetRules = R.map(category => {
      return {
        isRequired: () => true,
        markRequiredFields: (lomake, isRequired) => {
          const components = R.map(component => {
            return R.assocPath(
              ["properties", "isRequired"],
              isRequired,
              component
            );
          }, category.components);
          const updatedCategory = R.assoc("components", components, category);
          return R.assocPath(category.fullPath, updatedCategory, lomake);
        },
        /**
         * In a "normal" case the return value will be a boolean. However,
         * in this case we have multiple components and we can't tell their
         * statuses by using only one boolean. That's why we return an object
         * with format { [component.anchor]: isValid, ... }
         */
        isValid: (lomake, changeObjects, isRequired) => {
          return isRequired
            ? () => {
                const validationStatuses = {};
                R.forEach(component => {
                  const changeObject = R.find(
                    R.compose(R.endsWith(component.anchor), R.prop("anchor")),
                    changeObjects
                  );
                  if (!changeObject) {
                    validationStatuses[component.anchor] = !R.isEmpty(
                      component.properties.value
                    );
                  } else {
                    validationStatuses[component.anchor] = !R.isEmpty(
                      changeObject.properties.value
                    );
                  }
                }, category.components);
                return validationStatuses;
              }
            : () => true;
        },
        /**
         * Unlike normal cases the isValid parameter is an array.
         */
        showErrors: (lomake, validationStatuses) => {
          const categoryWithIsRequiredFlags = R.path(category.fullPath, lomake);
          const components = R.map(component => {
            return R.assocPath(
              ["properties", "isValid"],
              validationStatuses[component.anchor],
              component
            );
          }, categoryWithIsRequiredFlags.components);
          const updatedCategory = R.assoc("components", components, category);
          return R.assocPath(category.fullPath, updatedCategory, lomake);
        }
      };
    }, opiskelijavuodetCategories);
  }

  const perustelukentatCategories = R.uniq(
    R.flatten(
      getCategoriesByProps(_lomake, { anchor: R.endsWith("perustelut") })
    )
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
  return R.concat(perustelukentatRules, opiskelijavuodetRules);
}
