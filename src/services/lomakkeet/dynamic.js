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
  startsWith
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
  isReadOnly = false
) => {
  const dynamicTextBoxChangeObjects = filter(
    changeObj =>
      startsWith(`${sectionId}.ulkomaa.`, changeObj.anchor) &&
      endsWith(".kuvaus", changeObj.anchor) &&
      !startsWith(`${sectionId}.ulkomaa.0`, changeObj.anchor) &&
      !pathEq(["properties", "isDeleted"], true, changeObj),
    changeObjects
  );

  const seuraavaAnkkuri =
    parseInt(apply(Math.max, map(path(["meta", "ankkuri"]), maaraykset)), 10) +
    1;

  const unremovedInLupaTextBoxes = filter(maarays => {
    const changeObj = getChangeObjByAnchor(
      `${sectionId}.ulkomaa.${path(["meta", "ankkuri"], maarays)}.kuvaus`,
      changeObjects
    );
    return !changeObj || !pathEq(["properties", "isDeleted"], true, changeObj);
  }, maaraykset);

  return flatten(
    [
      /**
       * Luodaan määräyksiin perustuvat tekstikentät.
       */
      sortBy(
        compose(anchorPart => parseInt(anchorPart, 10), prop("anchor")),
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
            ? `${sectionId}.ulkomaa.${path(
                ["meta", "ankkuri"],
                previousInLupaTextBox
              )}.kuvaus`
            : `${sectionId}.ulkomaa.lisaaPainike.A`;

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
                      value: maarays.meta.arvo
                    }
                  }
                ]
              };
        }, unremovedInLupaTextBoxes).filter(Boolean)
      ),
      /**
       * Luodaan dynaamiset tekstikentät, joita käyttäjä voi luoda lisää
       * erillisen painikkeen avulla.
       */
      sortBy(
        compose(anchorPart => parseInt(anchorPart, 10), prop("anchor")),
        addIndex(map)((changeObj, index) => {
          const previousTextBoxChangeObj =
            index > 0 ? nth(index - 1, dynamicTextBoxChangeObjects) : null;
          const lastInLupaTextBox = last(unremovedInLupaTextBoxes);

          // Selvitetään, mihin fokus siirretään, jos tekstikenttä
          // poistetaan (käyttäjän toimesta).
          let anchorToBeFocused = `${sectionId}.ulkomaa.lisaaPainike.A`;

          if (previousTextBoxChangeObj) {
            anchorToBeFocused = prop("anchor", previousTextBoxChangeObj);
          } else if (lastInLupaTextBox) {
            // Jos kyseessä on ensimmäinen muutosobjektien kautta luotavista
            // tekstikentistä, siirretään fokus viimeiseen, aiemmin
            // määräysten pohjalta luotuun, tekstikenttään.
            anchorToBeFocused = `${sectionId}.ulkomaa.${path(
              ["meta", "ankkuri"],
              lastInLupaTextBox
            )}.kuvaus`;
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

          console.info(anchor, anchorToBeFocused);

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
            onClick: fromComponent => {
              return onAddButtonClick(fromComponent, seuraavaAnkkuri);
            },
            properties: {
              isPreviewModeOn,
              isReadOnly: isPreviewModeOn || isReadOnly,
              isVisible: true,
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
