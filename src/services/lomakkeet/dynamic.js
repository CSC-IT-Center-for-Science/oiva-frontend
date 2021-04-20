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
  not,
  toUpper,
  concat,
  take,
  values,
  head,
  split,
  mapObjIndexed,
  drop,
  isEmpty
} from "ramda";
import { getAnchorPart } from "utils/common";
import { getChangeObjByAnchor } from "components/02-organisms/CategorizedListRoot/utils";
import { __ } from "i18n-for-browser";
import { createAlimaarayksetBEObjects } from "../../helpers/rajoitteetHelper";

export const createDynamicTextFields = (
  sectionId,
  maaraykset = [],
  changeObjects = [],
  koodiarvo,
  onAddButtonClick,
  isPreviewModeOn = false,
  isReadOnly = false,
  maxAmountOfTextBoxes = 10,
  koodit,
  locale
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
    parseInt(apply(Math.max, nykyisetAnkkuriarvot), 10) + 1 || "0";

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

  const numberOfTextBoxes =
    length(unremovedInLupaTextBoxes) +
    length(unremovedDynamicTextBoxChangeObjects);

  const checkBoxChangeObj = !!find(
    cObj =>
      cObj.anchor === `${sectionId}.${koodiarvo}.valintaelementti` &&
      path(["properties", "isChecked"], cObj),
    changeObjects
  );

  const relatedCheckBoxIsChecked = checkBoxChangeObj || length(maaraykset) > 0;

  /** Lisätään tässä tekstikenttä, jos valintaelementti checkattu, eikä tekstikenttiä ole */
  if (relatedCheckBoxIsChecked && numberOfTextBoxes === 0) {
    const koodi = find(koodi => koodi.koodiarvo === koodiarvo, koodit || []);
    const kuvaus = path(
      ["metadata", locale ? toUpper(locale) : "FI", "kuvaus"],
      koodi
    );
    onAddButtonClick(
      { fullAnchor: `${sectionId}.${koodiarvo}.lisaaPainike.A"` },
      seuraavaAnkkuri,
      kuvaus
    );
  }

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
            pathEq(
              ["properties", "metadata", "koodiarvo"],
              maarays.koodiarvo,
              changeObj
            ) &&
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

        const kuvaus = path(
          ["metadata", locale ? toUpper(locale) : "FI", "kuvaus"],
          find(koodi => koodi.koodiarvo === koodiarvo, koodit || [])
        );

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
                    isRemovable:
                      maxAmountOfTextBoxes > 1 && numberOfTextBoxes > 1,
                    placeholder: __("common.kuvausPlaceholder"),
                    title: __("common.kuvaus"),
                    value:
                      path(["meta", "arvo"], maarays) ||
                      path(["meta", "kuvaus"], maarays) ||
                      kuvaus
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
            (!lastInLupaTextBoxAnchor ||
              lastInLupaTextBoxAnchor <
                path(
                  ["properties", "metadata", "ankkuri"],
                  previousTextBoxChangeObj
                ))
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
                      isRemovable:
                        maxAmountOfTextBoxes > 1 && numberOfTextBoxes > 1,
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
                numberOfTextBoxes < maxAmountOfTextBoxes &&
                numberOfTextBoxes > 0,
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

export const createDynamicTextBoxBeChangeObjects = (
  kuvausChangeObjects,
  liittyvatMaaraykset,
  kuvausKoodistosta,
  isCheckboxChecked,
  koodi,
  maaraystyyppi,
  maaraystyypit,
  rajoitteetByRajoiteIdAndKoodiarvo,
  checkboxChangeObj,
  kohde,
  kohteet
) => {
  return map(changeObj => {
    const ankkuri = path(["properties", "metadata", "ankkuri"], changeObj);

    const liittyvaMaarays = find(
      maarays =>
        maarays.koodiarvo === getAnchorPart(changeObj.anchor, 1) &&
        pathEq(["meta", "ankkuri"], ankkuri, maarays),
      liittyvatMaaraykset
    );

    /** Jos kuvaus on identtinen koodistosta tulevan kanssa ei tallenneta sitä lainkaan muutokselle.
     *  Tällöin muutokset koodistoon näkyvät html-luvalla */
    const kuvaus =
      path(["properties", "value"], changeObj) === kuvausKoodistosta
        ? null
        : path(["properties", "value"], changeObj);
    const isDeleted = path(["properties", "isDeleted"], changeObj);
    const isMuokattu = liittyvaMaarays && !isDeleted;
    const changeObjectDeleted = isDeleted && !liittyvaMaarays;
    const tila = isCheckboxChecked && !isDeleted ? "LISAYS" : "POISTO";

    const kuvausBEChangeObject = changeObjectDeleted
      ? null
      : Object.assign(
          {},
          {
            generatedId: changeObj.anchor,
            kohde,
            koodiarvo: koodi.koodiarvo,
            koodisto: koodi.koodisto.koodistoUri,
            ...(kuvaus && { kuvaus }),
            maaraystyyppi,
            meta: {
              ankkuri,
              ...(kuvaus && { kuvaus }),
              changeObjects: flatten(
                concat(take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)), [
                  checkboxChangeObj,
                  changeObj
                ])
              ).filter(Boolean)
            },
            tila,
            maaraysUuid: tila === "POISTO" ? liittyvaMaarays.uuid : null
          }
        );

    /** Jos tekstikenttämääräystä on muokattu, pitää luoda poisto-objekti määräykselle */
    const muokkausPoistoObjekti = isMuokattu
      ? {
          kohde,
          koodiarvo: koodi.koodiarvo,
          koodisto: koodi.koodisto.koodistoUri,
          tila: "POISTO",
          maaraysUuid: liittyvaMaarays.uuid,
          maaraystyyppi
        }
      : null;

    let alimaaraykset = [];

    const kohteenTarkentimenArvo = path(
      [1, "properties", "value", "value"],
      head(values(rajoitteetByRajoiteIdAndKoodiarvo))
    );

    const rajoitevalinnanAnkkuriosa = kohteenTarkentimenArvo
      ? nth(1, split("-", kohteenTarkentimenArvo))
      : null;

    if (
      kohteenTarkentimenArvo &&
      (rajoitevalinnanAnkkuriosa === ankkuri || !rajoitevalinnanAnkkuriosa)
    ) {
      // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      alimaaraykset = values(
        mapObjIndexed(asetukset => {
          return createAlimaarayksetBEObjects(
            kohteet,
            maaraystyypit,
            kuvausBEChangeObject,
            drop(2, asetukset)
          );
        }, rajoitteetByRajoiteIdAndKoodiarvo)
      );
    }

    return [kuvausBEChangeObject, muokkausPoistoObjekti, alimaaraykset];
  }, kuvausChangeObjects);
};

export const createBECheckboxChangeObjectsForDynamicTextBoxes = (
  checkboxChangeObj,
  koodi,
  rajoitteetByRajoiteIdAndKoodiarvo,
  kohteet,
  kohde,
  maaraystyypit,
  maaraystyyppi,
  liittyvatMaaraykset,
  isCheckboxChecked,
  locale,
  nimi
) => {
  let checkboxBEchangeObject = null;
  checkboxBEchangeObject = checkboxChangeObj
    ? {
        generatedId: `${nimi}-${Math.random()}`,
        kohde,
        koodiarvo: koodi.koodiarvo,
        koodisto: koodi.koodisto.koodistoUri,
        kuvaus: koodi.metadata[locale].kuvaus,
        maaraystyyppi,
        meta: {
          changeObjects: flatten(
            concat(take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)), [
              checkboxChangeObj
            ])
          ).filter(Boolean)
        },
        tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
      }
    : null;

  // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
  // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
  // loput toisiinsa "alenevassa polvessa".
  const alimaaraykset =
    checkboxBEchangeObject && !isEmpty(rajoitteetByRajoiteIdAndKoodiarvo)
      ? values(
          mapObjIndexed(asetukset => {
            return createAlimaarayksetBEObjects(
              kohteet,
              maaraystyypit,
              checkboxBEchangeObject,
              drop(2, asetukset)
            );
          }, rajoitteetByRajoiteIdAndKoodiarvo)
        )
      : null;

  /** Jos checkboxi ei ole checkattu. Luodaan poisto-objektit koulutustehtävään
   * liittyville määräyksille (eli tekstikentille) */
  const uncheckedCheckBoxPoistot = !isCheckboxChecked
    ? map(maarays => {
        return {
          kohde,
          koodiarvo: koodi.koodiarvo,
          koodisto: koodi.koodisto.koodistoUri,
          tila: "POISTO",
          maaraysUuid: maarays.uuid,
          maaraystyyppi
        };
      }, liittyvatMaaraykset)
    : null;

  return [checkboxBEchangeObject, uncheckedCheckBoxPoistot, alimaaraykset];
};
