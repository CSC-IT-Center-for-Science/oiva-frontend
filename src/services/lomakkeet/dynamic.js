import {
  apply,
  compose,
  endsWith,
  flatten,
  filter,
  find,
  map,
  pathEq,
  prop,
  sortBy,
  path,
  equals,
  addIndex,
  nth,
  last,
  startsWith,
  length,
  not
} from "ramda";
import { getAnchorPart } from "utils/common";
import { getChangeObjByAnchor } from "components/02-organisms/CategorizedListRoot/utils";
import { __ } from "i18n-for-browser";

export const createDynamicTextFields = (
  sectionId,
  maaraykset = [],
  changeObjects = [],
  koodiarvo,
  onAddButtonClick,
  isPreviewModeOn = false,
  isReadOnly = false,
  maxAmountOfTextBoxes = 10
) => {
  const dynamicTextBoxChangeObjects = filter(
    changeObj =>
      startsWith(`${sectionId}.${koodiarvo}.`, changeObj.anchor) &&
      endsWith(".kuvaus", changeObj.anchor),
    changeObjects
  );

  const unremovedDynamicTextBoxChangeObjects = sortBy(
    prop("anchor"),
    filter(
      compose(not, pathEq(["properties", "isDeleted"], true)),
      dynamicTextBoxChangeObjects
    )
  );

  const nykyisetAnkkuriarvot = flatten([
    map(path(["meta", "ankkuri"]), maaraykset),
    map(
      path(["properties", "metadata", "ankkuri"]),
      dynamicTextBoxChangeObjects
    )
  ]);

  const seuraavaAnkkuri =
    parseInt(apply(Math.max, nykyisetAnkkuriarvot), 10) + 1 || 0;

  const unremovedInLupaTextBoxes = sortBy(
    path(["meta", "ankkuri"]),
    filter(maarays => {
      const changeObj = getChangeObjByAnchor(
        `${sectionId}.${koodiarvo}.${path(
          ["meta", "ankkuri"],
          maarays
        )}.kuvaus`,
        changeObjects
      );
      return (
        !changeObj || !pathEq(["properties", "isDeleted"], true, changeObj)
      );
    }, maaraykset)
  );

  return flatten(
    [
      /**
       * Luodaan määräyksiin perustuvat tekstikentät.
       */
      addIndex(map)((maarays, index) => {
        const anchor = path(["meta", "ankkuri"], maarays);
        const isRemoved = !!find(changeObj => {
          const changeObjAnkkuri = path(
            ["properties", "metadata", "ankkuri"],
            changeObj
          );
          return (
            equals(changeObjAnkkuri, anchor) &&
            pathEq(["properties", "isDeleted"], true, changeObj)
          );
        }, changeObjects);

        const previousInLupaTextBox =
          index > 0 ? nth(index - 1, unremovedInLupaTextBoxes) : null;

        // Selvitetään, mihin fokus siirretään, jos tekstikenttä
        // poistetaan (käyttäjän toimesta).
        let previousTextBoxAnchor = previousInLupaTextBox
          ? `${sectionId}.${koodiarvo}.${path(
              ["meta", "ankkuri"],
              previousInLupaTextBox
            )}.kuvaus`
          : `${sectionId}.${koodiarvo}.lisaaPainike.A`;

        return isRemoved
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
                      focusWhenDeleted: previousTextBoxAnchor,
                      koodiarvo: maarays.koodiarvo
                    },
                    isPreviewModeOn,
                    isReadOnly: isPreviewModeOn || isReadOnly,
                    isRemovable: true,
                    placeholder: __("common.kuvausPlaceholder"),
                    title: __("common.kuvaus"),
                    value:
                      path(["meta", "arvo"], maarays) ||
                      path(["meta", "kuvaus"], maarays)
                  }
                }
              ]
            };
      }, unremovedInLupaTextBoxes).filter(Boolean),
      /**
       * Luodaan dynaamiset tekstikentät, joita käyttäjä voi luoda lisää
       * erillisen painikkeen avulla.
       */
      sortBy(
        compose(anchorPart => parseInt(anchorPart, 10), prop("anchor")),
        addIndex(map)((changeObj, index) => {
          const previousTextBoxChangeObj =
            index > 0
              ? nth(index - 1, unremovedDynamicTextBoxChangeObjects)
              : null;
          const lastInLupaTextBox = last(unremovedInLupaTextBoxes);
          const lastInLupaTextBoxAnchor = path(
            ["meta", "ankkuri"],
            lastInLupaTextBox
          );

          // Selvitetään, mihin fokus siirretään, jos tekstikenttä
          // poistetaan (käyttäjän toimesta).
          let anchorToBeFocused = `${sectionId}.${koodiarvo}.lisaaPainike.A`;

          if (
            previousTextBoxChangeObj &&
            lastInLupaTextBoxAnchor <
              path(
                ["properties", "metadata", "ankkuri"],
                previousTextBoxChangeObj
              )
          ) {
            anchorToBeFocused = prop("anchor", previousTextBoxChangeObj);
          } else if (lastInLupaTextBox) {
            // Jos kyseessä on ensimmäinen muutosobjektien kautta luotavista
            // tekstikentistä, siirretään fokus viimeiseen, aiemmin
            // määräysten pohjalta luotuun, tekstikenttään.
            anchorToBeFocused = `${sectionId}.${koodiarvo}.${lastInLupaTextBoxAnchor}.kuvaus`;
          }

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
              path(["properties", "metadata", "ankkuri"], changeObj)
            ),
            maaraykset
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
                        focusWhenDeleted: anchorToBeFocused,
                        koodiarvo
                      },
                      isPreviewModeOn,
                      isReadOnly: isPreviewModeOn || isReadOnly,
                      isRemovable: true,
                      placeholder: __("common.kuvausPlaceholder"),
                      title: __("common.kuvaus")
                    }
                  }
                ]
              };
        }, unremovedDynamicTextBoxChangeObjects).filter(Boolean)
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
            onClick: fromComponent => {
              return onAddButtonClick(fromComponent, seuraavaAnkkuri);
            },
            properties: {
              isPreviewModeOn,
              isReadOnly: isPreviewModeOn || isReadOnly,
              isVisible:
                length(unremovedInLupaTextBoxes) +
                  length(unremovedDynamicTextBoxChangeObjects) <
                maxAmountOfTextBoxes,
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
  );
};
