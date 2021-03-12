import { isAdded, isInLupa, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "../../../components/02-organisms/CategorizedListRoot/utils";
import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  hasPath,
  map,
  path,
  pathEq,
  prop,
  propEq,
  sortBy,
  startsWith
} from "ramda";
import { __ } from "i18n-for-browser";
import { getAnchorPart } from "../../../utils/common";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getLocalizedProperty } from "../utils";
import localforage from "localforage";

export async function getErityisetKoulutustehtavatLukio(
  { maaraykset, sectionId },
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects,
  { onAddButtonClick }
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const erityisetKoulutustehtavat = await localforage.getItem(
    "lukioErityinenKoulutustehtavaUusi"
  );
  const lisatiedot = await getLisatiedotFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  return flatten(
    [
      map(erityinenKoulutustehtava => {
        const tehtavaanLiittyvatMaaraykset = filter(
          m =>
            propEq("koodiarvo", erityinenKoulutustehtava.koodiarvo, m) &&
            propEq("koodisto", "lukioerityinenkoulutustehtavauusi", m),
          maaraykset
        );
        const kuvausmaaraykset = filter(
          hasPath(["meta", "kuvaus"]),
          tehtavaanLiittyvatMaaraykset
        );

        const changeObj = getChangeObjByAnchor(
          `${sectionId}.${erityinenKoulutustehtava.koodiarvo}.valintaelementti`,
          changeObjects
        );

        const dynamicTextBoxChangeObjects = filter(
          changeObj =>
            startsWith(
              `${sectionId}.${erityinenKoulutustehtava.koodiarvo}.`,
              changeObj.anchor
            ) &&
            endsWith(".kuvaus", changeObj.anchor) &&
            !startsWith(
              `${sectionId}.${erityinenKoulutustehtava.koodiarvo}.0`,
              changeObj.anchor
            ),
          changeObjects
        );

        const isCheckedByChange = !!path(
          ["properties", "isChecked"],
          changeObj
        );

        const kuvausankkuri0 = "0";
        const kuvausmaarays0 = find(
          pathEq(["meta", "ankkuri"], kuvausankkuri0),
          kuvausmaaraykset
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
                anchor: kuvausankkuri0,
                components: [
                  {
                    anchor: "kuvaus",
                    name: "TextBox",
                    properties: {
                      forChangeObject: {
                        ankkuri: kuvausankkuri0,
                        koodiarvo: erityinenKoulutustehtava.koodiarvo
                      },
                      isPreviewModeOn,
                      isReadOnly: _isReadOnly,
                      placeholder: __("common.kuvausPlaceholder"),
                      title: __("common.kuvaus"),
                      value: kuvausmaarays0
                        ? kuvausmaarays0.meta.kuvaus
                        : getLocalizedProperty(
                            erityinenKoulutustehtava.metadata,
                            locale,
                            "kuvaus"
                          )
                    }
                  }
                ],
                layout: { indentation: "none" }
              },
              /**
               * Luodaan loput tekstikentät määräyksiin perustuen.
               */
              sortBy(
                compose(anchorPart => parseInt(anchorPart, 10), prop("anchor")),
                map(maarays => {
                  return maarays.meta.ankkuri !== kuvausankkuri0
                    ? {
                        anchor: path(["meta", "ankkuri"], maarays),
                        components: [
                          {
                            anchor: "kuvaus",
                            name: "TextBox",
                            properties: {
                              forChangeObject: {
                                ankkuri: path(["meta", "ankkuri"], maarays),
                                koodiarvo: maarays.koodiarvo
                              },
                              isPreviewModeOn,
                              isReadOnly: _isReadOnly,
                              isRemovable: true,
                              placeholder: __("common.kuvausPlaceholder"),
                              title: __("common.kuvaus"),
                              value: maarays.meta.kuvaus
                            }
                          }
                        ]
                      }
                    : null;
                }, kuvausmaaraykset).filter(Boolean)
              ),
              /**
               * Luodaan dynaamiset tekstikentät, joita käyttäjä voi luoda lisää
               * erillisen painikkeen avulla.
               */
              sortBy(
                compose(anchorPart => parseInt(anchorPart, 10), prop("anchor")),
                map(changeObj => {
                  const previousTextBoxAnchor = `${sectionId}.${
                    erityinenKoulutustehtava.koodiarvo
                  }.${parseInt(getAnchorPart(changeObj.anchor, 2), 10) -
                    1}.kuvaus`;

                  const previousTextBoxChangeObj = find(
                    propEq("anchor", previousTextBoxAnchor),
                    dynamicTextBoxChangeObjects
                  );

                  /**
                   * Jos määräys on olemassa, ei
                   * luoda muutosobjektin perusteella enää dynaamista
                   * tekstikenttää, koska tekstikenttä on luotu jo aiemmin
                   * vähän ylempänä tässä tiedostossa.
                   **/
                  const maarays = find(
                    pathEq(
                      ["meta", "ankkuri"],
                      path(["properties", "metadata", "ankkuri"], changeObj)
                    ),
                    kuvausmaaraykset
                  );

                  const anchor = getAnchorPart(changeObj.anchor, 2);

                  return !!maarays
                    ? null
                    : {
                        anchor,
                        components: [
                          {
                            anchor: "kuvaus",
                            name: "TextBox",
                            properties: {
                              forChangeObject: {
                                ankkuri: anchor,
                                focusWhenDeleted: !!previousTextBoxChangeObj
                                  ? previousTextBoxAnchor
                                  : `${sectionId}.${erityinenKoulutustehtava.koodiarvo}.0.kuvaus`,
                                koodiarvo: erityinenKoulutustehtava.koodiarvo
                              },
                              isPreviewModeOn,
                              isReadOnly: _isReadOnly,
                              isRemovable: true,
                              placeholder: __("common.kuvausPlaceholder"),
                              title: __("common.kuvaus")
                            }
                          }
                        ]
                      };
                }, dynamicTextBoxChangeObjects).filter(Boolean)
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
                isChecked: !!tehtavaanLiittyvatMaaraykset.length,
                isIndeterminate: false,
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  custom: Object.assign(
                    {},
                    !!tehtavaanLiittyvatMaaraykset.length ? isInLupa : {}
                  ),
                  removal: isRemoved
                },
                title: getLocalizedProperty(
                  erityinenKoulutustehtava.metadata,
                  locale,
                  "nimi"
                )
              }
            }
          ]
        };
      }, erityisetKoulutustehtavat),
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
      lisatiedotObj
        ? {
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
                  title: __("common.lisatiedot"),
                  value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
                }
              }
            ]
          }
        : null
    ].filter(Boolean)
  );
}
