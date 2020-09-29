import { isAdded, isInLupa, isRemoved } from "css/label";
import { map, toUpper } from "ramda";

export function opetusJotaLupaKoskee(data, isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  return map(opetustehtava => {
    return {
      anchor: "opetustehtava",
      components: [
        {
          anchor: opetustehtava.koodiarvo,
          name: "CheckboxWithLabel",
          properties: {
            code: opetustehtava.koodiarvo,
            title: opetustehtava.metadata[localeUpper].nimi,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: Object.assign({}, !!opetustehtava.maarays ? isInLupa : {})
            },
            isChecked: !!opetustehtava.maarays,
            isIndeterminate: false
          }
        }
      ]
    };
  }, data.opetustehtavat);
}
