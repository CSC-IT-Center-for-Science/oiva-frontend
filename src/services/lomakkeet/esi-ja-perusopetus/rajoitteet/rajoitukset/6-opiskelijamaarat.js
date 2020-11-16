import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getChangeObjByAnchor } from "../../../../../components/02-organisms/CategorizedListRoot/utils";
import { } from "ramda";
import { find, flatten, pathEq, map,toUpper  } from "ramda";
import { __ } from "i18n-for-browser";

export default async function opiskelijaMaarat(
    changeObjects,
    locale
) {
  const localeUpper = toUpper(locale);
  const lisatiedot = await getLisatiedotFromStorage();
  const isReadOnly = false;
  const lisatiedotObj = find(
      pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
      lisatiedot
  );
  const anchorA = `opiskelijamaarat.kentat.dropdown`;
  const anchorB = `opiskelijamaarat.kentat.input`
  const changeObjA = getChangeObjByAnchor(anchorA, changeObjects);
  const changeObjB = getChangeObjByAnchor(anchorB, changeObjects);
  const oppilasMaaraValinnat = [{ label: __("common.enintaan"), value: "1" },{ label: __("common.vahintaan"), value: "2"}];

  console.log(changeObjA);

  return {
      anchor: "rajoitus",
      components: [
          {
              anchor: "opiskelijamaarat.dropdown",
              styleClasses: "mb-0 mr-2 w-1/5",
              name: "Dropdown",
              value: "Vähintään",
              properties: {
                  options: map((oppilasMaaraValinta) =>{
                      return (
                          {
                              label: oppilasMaaraValinta.label,
                              value: oppilasMaaraValinta.value,
                          }
                      )
                  }, oppilasMaaraValinnat),
              }
          },
          {
              anchor: "opiskelijamaarat.input",
              name: "Input",
              properties: {
                  placeholder: __("education.oppilastaOpiskelijaa"),
                  type: "number",
                  value: changeObjB ? changeObjB.properties.value : "",
              }
          }
      ]
  };

}
