import { __ } from "i18n-for-browser";
import {
  addIndex,
  compose,
  endsWith,
  filter,
  find,
  flatten,
  map,
  mapObjIndexed,
  path,
  prop,
  propEq,
  startsWith,
  values
} from "ramda";
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
    propEq("anchor", "rajoitteet.kohteenValinta.valintaelementti"),
    changeObjects
  );

  if (changeObj) {
    tarkenninKey = changeObj.properties.value.value;
    kohteenTarkentimetChangeObjects = filter(
      compose(startsWith(`rajoitteet.${tarkenninKey}`), prop("anchor")),
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
      startsWith(`rajoitteet.${data.rajoiteId}.kriteeri`, changeObj.anchor) &&
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
    let kriteerinTarkennin = {};
    const kriteeriChangeObj = find(
      propEq(
        "anchor",
        `rajoitteet.${data.rajoiteId}.kriteeri${index}.valintaelementti`
      ),
      changeObjects
    );

    if (kriteeriChangeObj) {
      const kriteerintarkenninKey = kriteeriChangeObj.properties.value.value;
      const tarkentimetChangeObjects = filter(
        compose(
          startsWith(
            `rajoitteet.${data.rajoiteId}.kriteeri${index}.${kriteerintarkenninKey}`
          ),
          prop("anchor")
        ),
        changeObjects
      );
      kriteerinTarkennin = {
        anchor: `kriteeri${index}`,
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
      title: `Rajoitekriteeri ${index + 1}`,
      categories: [
        {
          anchor: `kriteeri${index}`,
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
          ]
        },
        kriteerinTarkennin
      ]
    };
  }, kriteeritChangeObjects);

  /**
   * Palautettava lomakemerkkaus
   */
  return flatten([
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
    kohteenTarkennin,
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
  ]);
}
