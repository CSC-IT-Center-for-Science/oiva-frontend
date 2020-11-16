import { isAdded, isInLupa, isRemoved } from "css/label";
import { head, isEmpty, isNil, map, path, reject } from "ramda";
import { __ } from "i18n-for-browser";

export async function getMuutYhteistyosopimus(data, isReadOnly) {
  const lomakerakenne = map(item => {
    // Käsitellään vain ensimmäinen määräys, koska niin on sovittu.
    const maarays =
      head(data.maarayksetByKoodiarvo[item.koodiarvo] || []) || {};

    const forChangeObject = reject(isNil, {
      koodiarvo: item.koodiarvo,
      koodisto: item.koodisto,
      maaraysUuid: maarays.uuid
    });

    return {
      anchor: "yhteistyosopimukset",
      components: [
        {
          anchor: "valintaelementti",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject,
            isChecked: !isEmpty(maarays),
            isIndeterminate: false,
            isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: !isEmpty(maarays) ? isInLupa : {}
            },
            title: __("common.lupaSisaltaaYhteistyosopimuksia")
          }
        }
      ],
      categories: [
        {
          anchor: "tekstikentta",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                forChangeObject,
                isReadOnly,
                placeholder: __("common.kuvausPlaceholder"),
                title: __("common.maarayksenKuvaus"),
                value:
                  path(["meta", "yhteistyosopimus", "kuvaus"], maarays) || ""
              }
            }
          ]
        }
      ]
    };
  }, data.items);

  return lomakerakenne;
}
