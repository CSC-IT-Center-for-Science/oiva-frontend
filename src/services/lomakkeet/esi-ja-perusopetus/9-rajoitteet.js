import { __ } from "i18n-for-browser";
import {
  addIndex,
  compose,
  filter,
  find,
  flatten,
  head,
  isNil,
  map,
  mapObjIndexed,
  not,
  path,
  propEq,
  sortBy,
  startsWith,
  values
} from "ramda";

const localizations = {
  opetustaAntavatKunnat: "2. Kunnat, joissa opetusta järjestetään",
  maaraaika: "Määräaika"
};

const changeObjectMapping = {
  opetustaAntavatKunnat: "toimintaalue",
  maaraaika: null
};

const sections = {
  opetustaAntavatKunnat: (changeObjects, otherChangeObjects = []) => {
    console.info(head(otherChangeObjects));
    const changesByProvince = path(
      ["properties", "changesByProvince"],
      head(otherChangeObjects) || {}
    );

    console.info(changesByProvince);

    if (changesByProvince) {
      const listOfMunicipalities = sortBy(
        path(["properties", "metadata", "title"]),
        filter(
          compose(not, isNil, path(["properties", "metadata", "title"])),
          flatten(values(changesByProvince))
        )
      );

      const kuntavalintaChangeObject = find(
        propEq("anchor", "rajoitteet.kuntavalinta.autocomplete"),
        changeObjects
      );

      console.info(JSON.stringify(listOfMunicipalities));

      return {
        anchor: "kuntavalinta",
        components: [
          {
            anchor: "autocomplete",
            name: "Autocomplete",
            properties: {
              options: map(changeObj => {
                const { koodiarvo, title } = changeObj.properties.metadata;
                return !!kuntavalintaChangeObject &&
                  !!find(
                    propEq("value", koodiarvo),
                    kuntavalintaChangeObject.properties.value
                  )
                  ? null
                  : { label: title, value: koodiarvo };
              }, listOfMunicipalities).filter(Boolean),
              value: ""
            }
          }
        ]
      };
    } else {
      return {
        anchor: "ei-valintamahdollisuutta",
        components: [
          {
            anchor: "teksti",
            name: "StatusTextRow",
            properties: {
              title: "Ei valintamahdollisuutta."
            }
          }
        ]
      };
    }
  },
  maaraaika: locale => {
    return {
      anchor: "aikavali",
      components: [
        {
          anchor: "alkamispaiva",
          name: "Datepicker",
          properties: {
            label: "Alkamispäivä",
            value: "",
            onChanges: () => {},
            clearable: true,
            showTodayButton: false,
            localizations: {
              ok: __("common.ok"),
              clear: __("common.clear"),
              cancel: __("common.cancel"),
              today: __("common.today"),
              datemax: __("common.datemax"),
              datemin: __("common.datemin"),
              dateinvalid: __("common.dateinvalid")
            },
            locale
          }
        },
        {
          anchor: "paattymispaiva",
          name: "Datepicker",
          properties: {
            label: "Päättymispäivä",
            value: "",
            onChanges: () => {},
            clearable: true,
            showTodayButton: false,
            localizations: {
              ok: __("common.ok"),
              clear: __("common.clear"),
              cancel: __("common.cancel"),
              today: __("common.today"),
              datemax: __("common.datemax"),
              datemin: __("common.datemin"),
              dateinvalid: __("common.dateinvalid")
            },
            locale
          }
        }
      ]
    };
  }
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

// const rajoitekriteerit = {

// };

export function rajoitelomake(data, isReadOnly, locale, changeObjects) {
  let kohteenTarkennin = {};
  console.info(changeObjects);

  const changeObj = find(
    propEq("anchor", "rajoitteet.kohteenValinta.valintaelementti"),
    changeObjects
  );

  if (changeObj) {
    const tarkenninKey = changeObj.properties.value.value;
    kohteenTarkennin = sections[tarkenninKey](
      changeObjects,
      path([changeObjectMapping[tarkenninKey]], data.changeObjects)
    );
  }

  const kriteeritChangeObjects = filter(
    changeObj =>
      startsWith(`rajoitteet.${data.rajoiteId}.kriteeri`, changeObj.anchor),
    changeObjects
  );

  const rajoitekriteerit = addIndex(map)((_changeObj, index) => {
    let kriteerinTarkennin = {};
    const changeObj = find(
      propEq("anchor", `rajoitteet.kriteeri${index}.valintaelementti`),
      changeObjects
    );
    if (changeObj) {
      const tarkenninKey = changeObj.properties.value.value;
      kriteerinTarkennin = sections[tarkenninKey](
        changeObjects,
        path([changeObjectMapping[tarkenninKey]], data.changeObjects)
      );
    }
    return {
      anchor: `kriteeri${index}`,
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
            ),
            title: "Rajoitekriteeri"
          }
        }
      ],
      categories: [kriteerinTarkennin]
    };
  }, kriteeritChangeObjects);

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
            text: "Lisää rajoitekriteeri"
          }
        }
      ]
    }
  ]);
}

/**
 *
 * 2. Kunnat, joissa opetusta annetaan -> Lista kunnista pudotusvalikossa
 * 6. Oppilas- ja opiskelijamäärät -> Enintään/Vähintään n kpl
 * x. Määräaika -> Alkamispäivä ja päättymispäivä
 */
