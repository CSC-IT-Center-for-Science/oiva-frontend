import { __ } from "i18n-for-browser";
import {
  addIndex,
  compose,
  endsWith,
  filter,
  find,
  flatten,
  isEmpty,
  map,
  mapObjIndexed,
  path,
  prop,
  propEq,
  startsWith,
  values
} from "ramda";
import { getAnchorPart } from "utils/common";
import opetustaAntavatKunnat from "./tarkentimet/2-opetustaAntavatKunnat";
import maaraaika from "./tarkentimet/maaraaika";

const localizations = {
  opetustaAntavatKunnat: "2. Kunnat, joissa opetusta järjestetään",
  maaraaika: "Määräaika"
};

const changeObjectMapping = {
  opetustaAntavatKunnat: "toimintaalue",
  maaraaika: "maaraaika"
};

const sections = {
  maaraaika,
  opetustaAntavatKunnat
};

export function rajoitelomake(data, isReadOnly, locale, changeObjects) {
  let kohteenTarkennin = {};
  let tarkenninKey = "";
  let kohteenTarkentimetChangeObjects = null;
  console.info(changeObjects);

  const changeObj = find(
    propEq(
      "anchor",
      `${data.sectionId}.${data.rajoiteId}.kohteenValinta.valintaelementti`
    ),
    changeObjects
  );

  if (changeObj) {
    tarkenninKey = changeObj.properties.value.value;
    kohteenTarkentimetChangeObjects = filter(
      compose(
        startsWith(`${data.sectionId}.${data.rajoiteId}.${tarkenninKey}`),
        prop("anchor")
      ),
      changeObjects
    );
    kohteenTarkennin = sections[tarkenninKey](
      changeObjects,
      path([changeObjectMapping[tarkenninKey]], data.changeObjects),
      kohteenTarkentimetChangeObjects
    );
  }

  const kriteeritChangeObjects = filter(
    changeObj =>
      startsWith(
        `${data.sectionId}.${data.rajoiteId}.kriteeri`,
        changeObj.anchor
      ) && endsWith("valintaelementti", changeObj.anchor),
    changeObjects
  );

  console.info(
    data.sectionId,
    kohteenTarkennin,
    kohteenTarkentimetChangeObjects,
    changeObjects,
    kriteeritChangeObjects
  );

  /**
   * Rajoitekriteerit
   */
  const rajoitekriteerit = addIndex(map)((_changeObj, index) => {
    const criterionAnchorPart = getAnchorPart(_changeObj.anchor, 3);
    console.info(_changeObj, criterionAnchorPart);
    let kriteerinTarkennin = {};
    const kriteeriChangeObj = find(
      propEq(
        "anchor",
        `${data.sectionId}.${data.rajoiteId}.kriteerit.${criterionAnchorPart}.valintaelementti`
      ),
      changeObjects
    );

    if (kriteeriChangeObj) {
      const kriteerintarkenninKey = kriteeriChangeObj.properties.value.value;
      const tarkentimetChangeObjects = filter(
        compose(
          startsWith(
            `${data.sectionId}.${data.rajoiteId}.kriteerit.${criterionAnchorPart}.${kriteerintarkenninKey}`
          ),
          prop("anchor")
        ),
        changeObjects
      );
      console.info(
        tarkentimetChangeObjects,
        `${data.sectionId}.${data.rajoiteId}.kriteerit.${criterionAnchorPart}.${kriteerintarkenninKey}`
      );
      kriteerinTarkennin = Object.assign(
        {},
        sections[kriteerintarkenninKey](
          changeObjects,
          path(
            [changeObjectMapping[kriteerintarkenninKey]],
            data.changeObjects
          ),
          tarkentimetChangeObjects,
          locale
        )
      );

      console.info("kriteerintarkennin", kriteerinTarkennin);
    }
    return {
      anchor: criterionAnchorPart,
      categories: [
        {
          anchor: "valintaelementti",
          components: [
            {
              anchor: "autocomplete",
              name: "Autocomplete",
              properties: {
                isMulti: false,
                options: values(
                  mapObjIndexed((categoryFn, key) => {
                    return key !== tarkenninKey
                      ? { label: localizations[key], value: key }
                      : null;
                  }, sections)
                ).filter(Boolean),
                title: "Rajoitekriteeri"
              }
            }
          ],
          isRemovable: true,
          onRemove: category => {
            data.onRemoveCriterion(criterionAnchorPart);
          },
          title: `Rajoitekriteeri ${index + 1}`
        },
        kriteerinTarkennin
      ]
    };
  }, kriteeritChangeObjects);

  console.info("rajoitekriteerit", rajoitekriteerit);

  const kriteeritStructure = Object.assign(
    {},
    {
      anchor: "kriteerit",
      categories: rajoitekriteerit
    },
    !!rajoitekriteerit.length
      ? {
          isRemovable: true,
          title: "Rajoitekriteerit"
        }
      : {}
  );

  /**
   * Palautettava lomakemerkkaus
   */
  const a = flatten([
    {
      anchor: data.rajoiteId,
      categories: [
        {
          anchor: "kohteenValinta",
          components: [
            {
              anchor: "valintaelementti",
              name: "Autocomplete",
              properties: {
                isMulti: false,
                options: values(
                  mapObjIndexed((categoryFn, key) => {
                    return { label: localizations[key], value: key };
                  }, sections)
                )
              }
            }
          ]
        },
        isEmpty(kohteenTarkennin) ? null : kohteenTarkennin,
        kriteeritStructure,
        {
          anchor: "kriteerinLisaaminen",
          components: [
            {
              anchor: "painike",
              name: "SimpleButton",
              onClick: payload =>
                data.onAddCriterion({
                  ...payload,
                  metadata: { ...payload.metadata, rajoiteId: data.rajoiteId }
                }),
              properties: {
                isVisible:
                  !!kohteenTarkentimetChangeObjects &&
                  kohteenTarkentimetChangeObjects.length > 0,
                text: "Lisää rajoitekriteeri"
              }
            }
          ]
        }
      ].filter(Boolean)
    }
  ]).filter(Boolean);

  console.info(a);

  return a;
}
