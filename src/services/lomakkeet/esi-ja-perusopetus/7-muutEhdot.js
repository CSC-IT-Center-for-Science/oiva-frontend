import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import { getChangeObjByAnchor } from "../../../components/02-organisms/CategorizedListRoot/utils";
import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  includes,
  map,
  path,
  pathEq,
  prop,
  sortBy,
  toUpper
} from "ramda";
import { getAnchorPart } from "../../../utils/common";
import { getPOMuutEhdotFromStorage } from "helpers/poMuutEhdot";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";

export async function muutEhdot(
  data,
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const poMuutEhdot = await getPOMuutEhdotFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();
  const localeUpper = toUpper(locale);

  const muuEhtoChangeObj = getChangeObjByAnchor(
    `muutEhdot.99.valintaelementti`,
    changeObjects
  );

  const isCheckedByChange = !!path(
    ["properties", "isChecked"],
    muuEhtoChangeObj
  );

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lomakerakenne = flatten([
    map(ehto => {
      return {
        anchor: ehto.koodiarvo,
        components: [
          {
            anchor: "valintaelementti",
            name: "CheckboxWithLabel",
            properties: {
              isPreviewModeOn,
              isReadOnly: _isReadOnly,
              title: ehto.metadata[localeUpper].nimi,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object.assign({}, !!ehto.maarays ? isInLupa : {})
              },
              isChecked: !!ehto.maarays,
              isIndeterminate: false
            }
          }
        ],
        categories: flatten(
          [
            {
              anchor: "0",
              components: [
                {
                  anchor: "kuvaus",
                  name: "TextBox",
                  properties: {
                    forChangeObject: {
                      koodiarvo: ehto.koodiarvo
                    },
                    isPreviewModeOn,
                    isReadOnly: _isReadOnly,
                    placeholder: __("common.kuvausPlaceholder"),
                    title: __("common.kuvaus"),
                    value: ehto.metadata[localeUpper].kuvaus
                  }
                }
              ]
            },
            /**
             * Dynaamiset tekstikentät, joita käyttäjä voi luoda lisää erillisen painikkeen avulla.
             * 99 = Muu ehto
             */
            ehto.koodiarvo === "99"
              ? [
                  sortBy(
                    prop("anchor"),
                    map(
                      changeObj => {
                        return {
                          anchor: getAnchorPart(changeObj.anchor, 2),
                          components: [
                            {
                              anchor: "kuvaus",
                              name: "TextBox",
                              properties: {
                                forChangeObject: {
                                  koodiarvo: ehto.koodiarvo
                                },
                                isPreviewModeOn,
                                isReadOnly: _isReadOnly,
                                placeholder: __("common.kuvausPlaceholder"),
                                title: __("common.kuvaus"),
                                isRemovable: true,
                                value: changeObj.properties.value
                              }
                            }
                          ]
                        };
                      },
                      filter(changeObj => {
                        return (
                          endsWith(".kuvaus", changeObj.anchor) &&
                          includes(`.${ehto.koodiarvo}`, changeObj.anchor) &&
                          !includes(`${ehto.koodiarvo}.0`, changeObj.anchor)
                        );
                      }, changeObjects)
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
                        onClick: () => data.onAddButtonClick(ehto.koodiarvo),
                        properties: {
                          isPreviewModeOn,
                          isReadOnly: _isReadOnly,
                          isVisible: isCheckedByChange, // TODO: Huomioidaan mahdollinen määräys
                          text: __("common.lisaaUusiKuvaus"),
                          icon: "FaPlus",
                          iconContainerStyles: {
                            width: "15px"
                          },
                          iconStyles: {
                            fontSize: 10
                          },
                          variant: "text"
                        }
                      }
                    ]
                  }
                ]
              : []
          ].filter(Boolean)
        )
      };
    }, poMuutEhdot),
    lisatiedotObj
      ? [
          {
            anchor: "lisatiedotTitle",
            layout: { margins: { top: "large" } },
            components: [
              {
                anchor: lisatiedotObj.koodiarvo,
                name: "StatusTextRow",
                styleClasses: ["pt-8", "border-t"],
                properties: {
                  title: __("common.lisatiedotInfo")
                }
              }
            ]
          },
          {
            anchor: "lisatiedot",
            components: [
              {
                anchor: lisatiedotObj.koodiarvo,
                name: "TextBox",
                properties: {
                  forChangeObject: {
                    koodiarvo: lisatiedotObj.koodiarvo,
                    koodisto: lisatiedotObj.koodisto,
                    versio: lisatiedotObj.versio,
                    voimassaAlkuPvm: lisatiedotObj.voimassaAlkuPvm
                  },
                  isPreviewModeOn,
                  isReadOnly: _isReadOnly,
                  placeholder: __("common.lisatiedot")
                }
              }
            ]
          }
        ].filter(Boolean)
      : null
  ]);

  return lomakerakenne;
}
