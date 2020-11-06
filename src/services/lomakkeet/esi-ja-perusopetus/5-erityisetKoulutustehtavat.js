import { isAdded, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "../../../components/02-organisms/CategorizedListRoot/utils";
import {
  endsWith,
  filter,
  find,
  flatten,
  map,
  path,
  pathEq,
  startsWith,
  toUpper
} from "ramda";
import { __ } from "i18n-for-browser";
import { getAnchorPart } from "../../../utils/common";
import { getPOErityisetKoulutustehtavatFromStorage } from "helpers/poErityisetKoulutustehtavat";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";

export async function erityisetKoulutustehtavat(
  data,
  isReadOnly,
  locale,
  changeObjects
) {
  const poErityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();
  const localeUpper = toUpper(locale);

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot
  );

  return flatten([
    map(erityinenKoulutustehtava => {
      const changeObj = getChangeObjByAnchor(
        `erityisetKoulutustehtavat.${erityinenKoulutustehtava.koodiarvo}.valintaelementti`,
        changeObjects
      );

      const isCheckedByChange = !!path(["properties", "isChecked"], changeObj);

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
                    isReadOnly,
                    placeholder: __("common.kuvausPlaceholder"),
                    title: __("common.kuvaus"),
                    value: erityinenKoulutustehtava.metadata[localeUpper].kuvaus
                  }
                }
              ]
            },
            /**
             * Luodaan dynaamiset tekstikentät, joita käyttäjä voi luoda lisää
             * erillisen painikkeen avulla.
             */
            map(
              changeObj => {
                return {
                  anchor: getAnchorPart(changeObj.anchor, 2),
                  components: [
                    {
                      anchor: "kuvaus",
                      name: "TextBox",
                      properties: {
                        placeholder: __("common.kuvausPlaceholder"),
                        title: __("common.kuvaus"),
                        isRemovable: true,
                        value: changeObj.properties.value
                      }
                    }
                  ]
                };
              },
              filter(
                changeObj =>
                  startsWith(
                    `erityisetKoulutustehtavat.${erityinenKoulutustehtava.koodiarvo}`,
                    changeObj.anchor
                  ) &&
                  endsWith(".kuvaus", changeObj.anchor) &&
                  !startsWith(
                    `erityisetKoulutustehtavat.${erityinenKoulutustehtava.koodiarvo}.0`,
                    changeObj.anchor
                  ),
                changeObjects
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
                    isVisible: isCheckedByChange,
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
        ]),
        components: [
          {
            anchor: "valintaelementti",
            name: "CheckboxWithLabel",
            properties: {
              isChecked: false, // TODO: Aseta arvo sen mukaan, mitä määräyksiä luvasta löytyy
              isIndeterminate: false,
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
          styleClasses: ["pt-8 border-t"],
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
            placeholder: (lisatiedotObj.metadata[toUpper(locale)] || {}).nimi
          }
        }
      ]
    }
  ]);
}
