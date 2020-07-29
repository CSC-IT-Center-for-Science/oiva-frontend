import { createRules, ifOneTerm, getPathByAnchor } from "../utils";
import { requiredFields } from "./requiredFields";
import { assocPath, concat, find, propEq, path } from "ramda";
import ProcedureHandler from "../../../components/02-organisms/procedureHandler";

export function getRules(lomake, formatMessage) {
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
      isValid: async function(lomake, changeObjects) {
        const asianumeroComponent = find(
          propEq("anchor", "asianumero"),
          lomake
        );
        const uuid = asianumeroComponent
          ? path(
              ["components", "0", "properties", "forChangeObject", "uuid"],
              asianumeroComponent
            )
          : null;
        const result = await ifOneTerm(
          [
            {
              anchor: "asianumero.A",
              properties: {
                value: async value => {
                  if (value) {
                    const isValueInValidFormat = /^VN\/[0-9]{1,9}\/[0-9]{4}$/.test(
                      value
                    );
                    /**
                     * Jos kentän arvo on muodoltaan oikeanlainen, tarkistetaan
                     * onko kyseinen asianumero jo käytössä.
                     */
                    if (isValueInValidFormat) {
                      const procedureHandler = new ProcedureHandler(
                        formatMessage
                      );
                      const outputs = await procedureHandler.run(
                        "muutospyynto.muutokset.tarkistaDuplikaattiAsianumero",
                        [uuid, value]
                      );
                      const isAsianumeroAlreadyInUse =
                        outputs.muutospyynto.muutokset
                          .tarkistaDuplikaattiAsianumero.output.result;
                      /**
                       * Mikäli asianumero ei ole käytössä, on kenttä arvoltaan
                       * validi sen sisällön ollessa oikeassa muodossa.
                       */
                      return !isAsianumeroAlreadyInUse;
                    }
                    return false;
                  }
                }
              }
            }
          ],
          lomake,
          changeObjects
        );
        return result;
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
