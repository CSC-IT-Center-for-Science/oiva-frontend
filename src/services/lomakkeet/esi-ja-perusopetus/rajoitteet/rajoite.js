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

// const rajoitekriteeri = id => {
//   return {
//     anchor: `kriteeri-${id}`,
//     components: [
//       {
//         anchor: "valintaelementti",
//         name: "Autocomplete",
//         properties: {
//           isMulti: false,
//           options: values(
//             mapObjIndexed((categoryFn, key) => {
//               return { label: localizations[key], value: key };
//             }, sections)
//           )
//         }
//       }
//     ]
//   };
// };

export function rajoitelomake(data, isReadOnly, locale, changeObjects) {
  let kohteenTarkennin = {};
  let tarkenninKey = "";
  let kohteenTarkentimetChangeObjects = null;
  console.info(changeObjects);

  const changeObj = find(
    propEq("anchor", `${data.sectionId}.kohteenValinta.valintaelementti`),
    changeObjects
  );

  if (changeObj) {
    tarkenninKey = changeObj.properties.value.value;
    kohteenTarkentimetChangeObjects = filter(
      compose(startsWith(`${data.sectionId}.${tarkenninKey}`), prop("anchor")),
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
      startsWith(`${data.sectionId}.${data.rajoiteId}.kriteeri`, changeObj.anchor) &&
      endsWith("valintaelementti", changeObj.anchor),
    changeObjects
  );

  console.info(
    kohteenTarkennin,
    kohteenTarkentimetChangeObjects,
    changeObjects,
    kriteeritChangeObjects
  );

  /**
   * Rajoitekriteerit
   */
  const rajoitekriteerit = addIndex(map)((_changeObj, index) => {
    const criterionAnchorPart = getAnchorPart(_changeObj.anchor, 2);
    let kriteerinTarkennin = {};
    const kriteeriChangeObj = find(
      propEq(
        "anchor",
        `${data.sectionId}.${data.rajoiteId}.${criterionAnchorPart}.valintaelementti`
      ),
      changeObjects
    );

    if (kriteeriChangeObj) {
      const kriteerintarkenninKey = kriteeriChangeObj.properties.value.value;
      const tarkentimetChangeObjects = filter(
        compose(
          startsWith(
            `${data.sectionId}.${data.rajoiteId}.${criterionAnchorPart}.${kriteerintarkenninKey}`
          ),
          prop("anchor")
        ),
        changeObjects
      );
      kriteerinTarkennin = {
        anchor: criterionAnchorPart,
        categories: [
          Object.assign(
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
          )
        ]
      };
    }
    return {
      anchor: data.rajoiteId,
      categories: [
        {
          anchor: criterionAnchorPart,
          components: [
            {
              anchor: "valintaelementti",
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
            data.onRemoveCriterion(category.anchor);
          },
          title: `Rajoitekriteeri ${index + 1}`
        },
        kriteerinTarkennin
      ]
    };
  }, kriteeritChangeObjects);

  /**
   * Palautettava lomakemerkkaus
   */
  const a = flatten([
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
    rajoitekriteerit,
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
  ]).filter(Boolean);

  console.info(a);

  return a;
}
