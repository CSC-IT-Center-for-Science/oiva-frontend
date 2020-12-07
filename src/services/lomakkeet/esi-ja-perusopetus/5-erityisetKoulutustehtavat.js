import { isAdded, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "../../../components/02-organisms/CategorizedListRoot/utils";
import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  map,
  path,
  pathEq,
  prop,
  propEq,
  sortBy,
  startsWith,
  toUpper
} from "ramda";
import { __ } from "i18n-for-browser";
import { getAnchorPart } from "../../../utils/common";
import { getPOErityisetKoulutustehtavatFromStorage } from "helpers/poErityisetKoulutustehtavat";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";

export async function erityisetKoulutustehtavat(
  data,
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects,
  { onAddButtonClick }
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const poErityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();
  const localeUpper = toUpper(locale);

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot
  );

  return flatten(
    [
      map(erityinenKoulutustehtava => {
        const changeObj = getChangeObjByAnchor(
          `${data.sectionId}.${erityinenKoulutustehtava.koodiarvo}.valintaelementti`,
          changeObjects
        );

        const dynamicTextBoxChangeObjects = filter(
          changeObj =>
            startsWith(
              `${data.sectionId}.${erityinenKoulutustehtava.koodiarvo}`,
              changeObj.anchor
            ) &&
            endsWith(".kuvaus", changeObj.anchor) &&
            !startsWith(
              `${data.sectionId}.${erityinenKoulutustehtava.koodiarvo}.0`,
              changeObj.anchor
            ),
          changeObjects
        );

        const isCheckedByChange = !!path(
          ["properties", "isChecked"],
          changeObj
        );

        return {
          anchor: erityinenKoulutustehtava.koodiarvo,
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
                      isPreviewModeOn,
                      isReadOnly: _isReadOnly,
                      placeholder: __("common.kuvausPlaceholder"),
                      title: __("common.kuvaus"),
                      value:
                        erityinenKoulutustehtava.metadata[localeUpper].kuvaus
                    }
                  }
                ],
                layout: { indentation: "none" }
              },
              /**
               * Luodaan dynaamiset tekstikentät, joita käyttäjä voi luoda lisää
               * erillisen painikkeen avulla.
               */
              sortBy(
                compose(anchorPart => parseInt(anchorPart, 10), prop("anchor")),
                map(changeObj => {
                  const previousTextBoxAnchor = `${data.sectionId}.${
                    erityinenKoulutustehtava.koodiarvo
                  }.${parseInt(getAnchorPart(changeObj.anchor, 2), 10) -
                    1}.kuvaus`;

                  const previousTextBoxChangeObj = find(
                    propEq("anchor", previousTextBoxAnchor),
                    dynamicTextBoxChangeObjects
                  );

                  return {
                    anchor: getAnchorPart(changeObj.anchor, 2),
                    components: [
                      {
                        anchor: "kuvaus",
                        name: "TextBox",
                        properties: {
                          forChangeObject: {
                            focusWhenDeleted: !!previousTextBoxChangeObj
                              ? previousTextBoxAnchor
                              : `${data.sectionId}.${erityinenKoulutustehtava.koodiarvo}.0.kuvaus`
                          },
                          isPreviewModeOn,
                          isReadOnly: _isReadOnly,
                          isRemovable: true,
                          placeholder: __("common.kuvausPlaceholder"),
                          title: __("common.kuvaus"),
                          value: changeObj.properties.value
                        }
                      }
                    ]
                  };
                }, dynamicTextBoxChangeObjects)
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
                    onClick: onAddButtonClick,
                    properties: {
                      isPreviewModeOn,
                      isReadOnly: _isReadOnly,
                      isVisible: isCheckedByChange,
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
            ].filter(Boolean)
          ]),
          components: [
            {
              anchor: "valintaelementti",
              name: "CheckboxWithLabel",
              properties: {
                isChecked: false, // TODO: Aseta arvo sen mukaan, mitä määräyksiä luvasta löytyy
                isIndeterminate: false,
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  removal: isRemoved
                },
                title: erityinenKoulutustehtava.metadata[localeUpper].nimi
              }
            }
          ]
        };
      }, poErityisetKoulutustehtavat),
      {
        anchor: "erityiset-koulutustehtavat",
        layout: { margins: { top: "large" } },
        components: [
          {
            anchor: "lisatiedot-info",
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
              placeholder: (lisatiedotObj.metadata[toUpper(locale)] || {}).nimi
            }
          }
        ]
      }
    ].filter(Boolean)
  );
}
