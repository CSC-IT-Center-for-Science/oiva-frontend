import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import { getChangeObjByAnchor } from "../../../components/02-organisms/CategorizedListRoot/utils";
import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  hasPath,
  includes,
  map,
  path,
  pathEq,
  prop,
  propEq,
  sortBy,
  toUpper
} from "ramda";
import { getAnchorPart } from "../../../utils/common";
import { getPOMuutEhdotFromStorage } from "helpers/poMuutEhdot";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";

export async function muutEhdot(
  { maaraykset },
  { isPreviewModeOn, isReadOnly },
  locale,
  changeObjects,
  { onAddButtonClick }
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

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  const lomakerakenne = flatten([
    map(ehto => {
      const ehtoonLiittyvatMaaraykset = filter(
        propEq("koodiarvo", ehto.koodiarvo),
        maaraykset
      );
      const kuvausmaaraykset = filter(
        hasPath(["meta", "kuvaus"]),
        ehtoonLiittyvatMaaraykset
      );

      const kuvausankkuri0 = "0";
      const kuvausmaarays0 = find(
        pathEq(["meta", "ankkuri"], kuvausankkuri0),
        kuvausmaaraykset
      );

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
              isChecked: !!ehtoonLiittyvatMaaraykset.length,
              isIndeterminate: false
            }
          }
        ],
        categories: flatten(
          [
            {
              anchor: kuvausankkuri0,
              components: [
                {
                  anchor: "kuvaus",
                  name: "TextBox",
                  properties: {
                    forChangeObject: {
                      ankkuri: kuvausankkuri0,
                      koodiarvo: ehto.koodiarvo
                    },
                    isPreviewModeOn,
                    isReadOnly: _isReadOnly,
                    placeholder: __("common.kuvausPlaceholder"),
                    title: __("common.kuvaus"),
                    value: kuvausmaarays0
                      ? kuvausmaarays0.meta.kuvaus
                      : ehto.metadata[localeUpper].kuvaus
                  }
                }
              ]
            },
            /**
             * Luodaan loput tekstikentät määräyksiin perustuen.
             */
            sortBy(
              compose(anchorPart => parseInt(anchorPart, 10), prop("anchor")),
              map(maarays => {
                return maarays.meta.ankkuri !== kuvausankkuri0
                  ? {
                      anchor: maarays.koodiarvo,
                      components: [
                        {
                          anchor: "kuvaus",
                          name: "TextBox",
                          properties: {
                            forChangeObject: {
                              ankkuri: maarays.koodiarvo
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
             * Dynaamiset tekstikentät, joita käyttäjä voi luoda lisää erillisen painikkeen avulla.
             * 99 = Muu ehto
             */
            ehto.koodiarvo === "99"
              ? [
                  sortBy(
                    prop("anchor"),
                    map(
                      changeObj => {
                        /**
                         * Tarkistetaan, onko muutos jo tallennettu tietokantaan
                         * eli löytyykö määräys. Jos määräys on olemassa, niin ei
                         * luoda muutosobjektin perusteella enää dynaamista
                         * tekstikenttää, koska tekstikentttä on luotu jo aiemmin
                         * vähän ylempänä tässä tiedostossa.
                         **/
                        const maarays = find(
                          pathEq(
                            ["meta", "ankkuri"],
                            path(
                              ["properties", "metadata", "ankkuri"],
                              changeObj
                            )
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
                        onClick: () => onAddButtonClick(ehto.koodiarvo),
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
                  placeholder: __("common.lisatiedot"),
                  value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
                }
              }
            ]
          }
        ].filter(Boolean)
      : null
  ]).filter(Boolean);

  return lomakerakenne;
}
