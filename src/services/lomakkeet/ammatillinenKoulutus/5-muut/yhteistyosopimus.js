import { isAdded, isInLupa, isRemoved } from "css/label";
import { isNil, length, map, path, reject, toLower } from "ramda";
import { __ } from "i18n-for-browser";

export async function getMuutYhteistyosopimus(data, isReadOnly, locale) {
  const lomakerakenne = map(item => {
    const maaraykset = data.maarayksetByKoodiarvo[item.koodiarvo] || [];

    return {
      anchor: "yhteistyosopimukset",
      components: [
        {
          anchor: "valintaelementti",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject: reject(isNil, {
              koodiarvo: item.koodiarvo,
              koodisto: item.koodisto,
              maaraysUuid: path([0, "uuid"], maaraykset)
            }),
            isChecked: !!length(maaraykset),
            isIndeterminate: false,
            isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: !!length(maaraykset) ? isInLupa : {}
            },
            title: __("common.lupaSisaltaaYhteistyosopimuksia")
          }
        }
      ],
      categories: map(maarays => {
        const forChangeObject = reject(isNil, {
          koodiarvo: item.koodiarvo,
          koodisto: item.koodisto,
          maaraysUuid: (maarays || {}).uuid
        });

        return {
          anchor: item.koodiarvo,
          components: [
            {
              anchor: maarays.uuid,
              name: "TextBox",
              properties: {
                forChangeObject,
                isReadOnly,
                placeholder: __("common.kuvausPlaceholder"),
                title: __("common.maarayksenKuvaus"),
                value: maarays.meta["yhteistyösopimus"][toLower(locale)]
              }
            }
          ]
        };
      }, maaraykset).filter(Boolean)
    };
  }, data.items);

  return lomakerakenne;
}
