import { isAdded, isInLupa, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "components/02-organisms/CategorizedListRoot/utils";
import {
  endsWith,
  filter,
  flatten,
  isNil,
  map,
  pathEq,
  prop,
  reject,
  sortBy,
  startsWith,
  toLower
} from "ramda";
import { __ } from "i18n-for-browser";
import { getAnchorPart } from "utils/common";

export async function getMuutYhteistyosopimus(
  data,
  isReadOnly,
  locale,
  changeObjects
) {
  return flatten([
    map(item => {
      const maaraykset = data.maarayksetByKoodiarvo[item.koodiarvo];
      const changeObj = getChangeObjByAnchor(
        `${data.sectionId}.${item.koodiarvo}.valintaelementti`,
        changeObjects
      );

      return map(maarays => {
        console.info(maarays);
        const isCheckedByChange = pathEq(
          ["properties", "isChecked"],
          true,
          changeObj
        );

        const forChangeObject = reject(isNil, {
          koodiarvo: item.koodiarvo,
          koodisto: item.koodisto,
          maaraysUuid: (maarays || {}).uuid
        });

        return {
          anchor: item.koodiarvo,
          categories: flatten([
            [
              /**
               * Jokaisen valinnan alla tulee olla ainakin yksi tekstikenttä,
               * joten varmistetaan se luomalla se yksi tekstikenttä tässä.
               */
              {
                anchor: "0",
                components: [
                  {
                    anchor: "kuvaus",
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
              },
              /**
               * Luodaan dynaamiset tekstikentät, joita käyttäjä voi luoda lisää
               * erillisen painikkeen avulla.
               */
              sortBy(
                prop("anchor"),
                map(
                  changeObj => {
                    const maaraysNro = getAnchorPart(changeObj.anchor, 2);
                    return {
                      anchor: maaraysNro,
                      components: [
                        {
                          anchor: "kuvaus",
                          name: "TextBox",
                          properties: {
                            forChangeObject,
                            isReadOnly,
                            isRemovable: true,
                            placeholder: __("common.kuvausPlaceholder"),
                            title: __("common.maarayksenXKuvaus", {
                              nro: maaraysNro
                            }),
                            value: changeObj.properties.value
                          }
                        }
                      ]
                    };
                  },
                  filter(
                    changeObj =>
                      startsWith(
                        `${data.sectionId}.${item.koodiarvo}`,
                        changeObj.anchor
                      ) &&
                      endsWith(".kuvaus", changeObj.anchor) &&
                      !startsWith(
                        `${data.sectionId}.${item.koodiarvo}.0`,
                        changeObj.anchor
                      ),
                    changeObjects
                  )
                )
              ),
              /**
               * Luodaan painike, jolla käyttäjä voi luoda lisää tekstikenttiä.
               */
              {
                anchor: "lisaaPainike",
                components: [
                  {
                    anchor: "A",
                    name: "SimpleButton",
                    onClick: data.onAddButtonClick,
                    properties: {
                      isReadOnly,
                      isVisible: !!maarays || isCheckedByChange,
                      icon: "FaPlus",
                      iconContainerStyles: {
                        width: "15px"
                      },
                      iconStyles: {
                        fontSize: 10
                      },
                      text: __("common.lisaaUusiKuvaus"),
                      variant: "text"
                    }
                  }
                ]
              }
            ]
          ]),
          components: [
            {
              anchor: "valintaelementti",
              name: "CheckboxWithLabel",
              properties: {
                forChangeObject,
                isChecked: !!maarays,
                isIndeterminate: false,
                isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  removal: isRemoved,
                  custom: !!maarays ? isInLupa : {}
                },
                title: __("common.lupaSisaltaaYhteistyosopimuksia")
              }
            }
          ]
        };
      }, maaraykset);
    }, data.items)
  ]);
}
