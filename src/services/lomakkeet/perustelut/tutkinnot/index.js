import { isAdded, isInLupa, isRemoved } from "../../../../css/label";
import { getMuutostarveCheckboxes } from "../common";
import "../../i18n-config";
import { __ } from "i18n-for-browser";
import {
  map,
  toUpper,
  filter,
  find,
  propEq,
  compose,
  isEmpty,
  not,
  prop
} from "ramda";

export const getAdditionForm = (checkboxItems, locale, isReadOnly = false) => {
  const checkboxes = getMuutostarveCheckboxes(
    checkboxItems,
    locale,
    isReadOnly
  );
  return [
    {
      anchor: "perustelut",
      layout: {
        indentation: "none"
      },
      title: __("muutospyynnon.taustalla.olevat.syyt"),
      categories: checkboxes
    }
  ];
};

export const getRemovalForm = isReadOnly => {
  return [
    {
      anchor: "removal",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title:
              "Perustele lyhyesti miksi tutkintoon tähtäävää koulutusta ei haluta enää järjestää",
            value: "",
            requiredMessage: "Pakollinen tieto puuttuu"
          }
        }
      ]
    }
  ];
};

export const getOsaamisalaForm = isReadOnly => {
  return [
    {
      anchor: "osaamisala",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title: "Perustele lyhyesti miksi tälle muutokselle on tarvetta",
            value: "",
            requiredMessage: "Pakollinen tieto puuttuu"
          }
        }
      ]
    }
  ];
};

function getCategoriesForPerustelut(
  isReadOnly,
  changeObjects,
  tutkinnotChangeObjects,
  koulutusala,
  koulutustyypit,
  oivaperustelut,
  title,
  tutkinnotByKoulutustyyppi,
  locale
) {
  const localeUpper = toUpper(locale);
  const currentDate = new Date();
  const structure = map(koulutustyyppi => {
    const tutkinnot = tutkinnotByKoulutustyyppi[koulutustyyppi.koodiarvo];
    if (tutkinnot) {
      return {
        anchor: koulutustyyppi.koodiarvo,
        meta: {
          areaCode: koulutusala.koodiarvo,
          title
        },
        title: koulutustyyppi.metadata[localeUpper].nimi,
        categories: map(tutkinto => {
          const anchor = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}.tutkinto`;
          const changeObj = find(
            propEq("anchor", anchor),
            tutkinnotChangeObjects
          );
          if (!changeObj) {
            return null;
          }
          const isAddition = changeObj.properties.isChecked;
          const osaamisalatWithoutMaarays = filter(
            osaamisala => !osaamisala.maarays,
            tutkinto.osaamisalat
          );
          return new Date(tutkinto.voimassaAlkuPvm) < currentDate
            ? {
                anchor: tutkinto.koodiarvo,
                components: [
                  {
                    anchor: "tutkinto",
                    name: "StatusTextRow",
                    properties: {
                      code: tutkinto.koodiarvo,
                      title: tutkinto.metadata[localeUpper].nimi,
                      labelStyles: {
                        addition: isAdded,
                        removal: isRemoved,
                        custom: Object.assign(
                          {},
                          !!tutkinto.maarays ? isInLupa : {}
                        )
                      }
                    }
                  }
                ],
                categories: isAddition
                  ? getAdditionForm(oivaperustelut, locale, isReadOnly)
                  : getRemovalForm(isReadOnly)
                // categories: map(osaamisala => {
                //   return {
                //     anchor: osaamisala.koodiarvo,
                //     components: [
                //       {
                //         anchor: "osaamisala",
                //         name: "StatusTextRow",
                //         properties: {
                //           code: osaamisala.koodiarvo,
                //           title: osaamisala.metadata[localeUpper].nimi,
                //           labelStyles: {
                //             addition: isAdded,
                //             removal: isRemoved,
                //             custom: Object.assign(
                //               {},
                //               // bold text if tutkinto is in lupa, but osaamisalarajoitus is not
                //               !!tutkinto.maarays && !osaamisala.maarays
                //                 ? isInLupa
                //                 : {}
                //             )
                //           }
                //         }
                //       }
                //     ]
                //   };
                // }, tutkinto.osaamisalat)
              }
            : null;
        }, tutkinnot).filter(Boolean)
      };
    }
    return null;
  }, koulutustyypit).filter(Boolean);

  return filter(compose(not, isEmpty, prop("categories")), structure);
}

// function getCategoriesForPerustelut(
//   article,
//   koulutustyypit,
//   kohde,
//   maaraystyyppi,
//   changes,
//   anchorInitial,
//   muutosperustelut,
//   locale,
//   isReadOnly = false
// ) {
//   if (!muutosperustelut) {
//     return false;
//   }
//   const anchor = prop("anchor");
//   const relevantAnchors = map(anchor)(changes);
//   const relevantKoulutustyypit = filter(
//     compose(not, isEmpty, prop("koulutukset")),
//     mapObjIndexed(koulutustyyppi => {
//       koulutustyyppi.koulutukset = filter(koulutus => {
//         const anchorStart = `${anchorInitial}.${koulutustyyppi.koodiarvo}.${koulutus.koodiarvo}`;
//         return !!find(startsWith(anchorStart))(relevantAnchors);
//       }, koulutustyyppi.koulutukset);
//       return koulutustyyppi;
//     })(koulutustyypit)
//   );

//   return values(
//     map(koulutustyyppi => {
//       return {
//         anchor: koulutustyyppi.koodiArvo,
//         code: koulutustyyppi.koodiArvo,
//         title:
//           _.find(koulutustyyppi.metadata, m => {
//             return m.kieli === locale;
//           }).nimi || "[Koulutustyypin otsikko tähän]",
//         categories: chain(koulutus => {
//           const isInLupaBool = article
//             ? !!_.find(article.koulutusalat, koulutusala => {
//                 return !!_.find(koulutusala.koulutukset, {
//                   koodi: koulutus.koodiarvo
//                 });
//               })
//             : false;

//           const anchorBase = `${anchorInitial}.${koulutustyyppi.koodiArvo}.${koulutus.koodiarvo}`;

//           const changeObjs = sortWith(
//             [ascend(compose(length, anchor)), ascend(anchor)],
//             filter(compose(startsWith(anchorBase), anchor))(changes)
//           );
//           return addIndex(map)((changeObj, i) => {
//             const anchorWOLast = init(split(".")(anchor(changeObj)));
//             const osaamisalakoodi = last(anchorWOLast);

//             const osaamisala = find(
//               i => i.koodiArvo === osaamisalakoodi,
//               koulutus.osaamisalat
//             );
//             const isAddition = changeObj.properties.isChecked;

//             const nimi = obj =>
//               _.find(prop("metadata", obj), m => m.kieli === locale).nimi;

//             return {
//               anchor: `${koulutus.koodiarvo}|${i}`,
//               categories: [
//                 {
//                   anchor: osaamisala
//                     ? osaamisala.koodiArvo
//                     : getAnchorPart(changeObj.anchor, 2),
//                   meta: {
//                     kohde,
//                     maaraystyyppi,
//                     koodisto: koulutus.koodisto,
//                     metadata: koulutus.metadata,
//                     isInLupa: isInLupaBool
//                   },
// categories: osaamisala
//   ? getOsaamisalaForm(isReadOnly)
//   : isAddition
//   ? getAdditionForm(muutosperustelut, locale, isReadOnly)
//   : getRemovalForm(isReadOnly),
//                   components: [
//                     {
//                       anchor: "A",
//                       name: "StatusTextRow",
//                       properties: {
//                         code: osaamisala ? "" : koulutus.koodiarvo,
//                         title: osaamisala
//                           ? join(" ", [
//                               __("osaamisalarajoitus"),
//                               osaamisalakoodi,
//                               nimi(osaamisala),
//                               "(" +
//                                 koulutus.koodiarvo +
//                                 " " +
//                                 nimi(koulutus) +
//                                 ")"
//                             ])
//                           : nimi(koulutus),
//                         labelStyles: {
//                           addition: isAdded,
//                           removal: isRemoved
//                         },
//                         styleClasses: ["flex"],
//                         statusTextStyleClasses: isAddition
//                           ? ["text-green-600 pr-4 w-20 font-bold"]
//                           : ["text-red-500 pr-4 w-20 font-bold"],
//                         statusText: isAddition ? " LISÄYS:" : " POISTO:"
//                       }
//                     }
//                   ]
//                 }
//               ]
//             };
//           }, changeObjs);
//         }, koulutustyyppi.koulutukset)
//       };
//     }, _.cloneDeep(relevantKoulutustyypit))
//   );
// }

// function getArticle(areaCode, articles = []) {
//   return find(article => {
//     return article.koodi === areaCode;
//   }, articles);
// }

// const getReasoningForm = (
//   koulutusala,
//   kohde,
//   lupakohde,
//   maaraystyyppi,
//   muutosperustelut,
//   _changes = [],
//   locale,
//   isReadOnly = false
// ) => {
//   const areaCode = koulutusala.koodiarvo || koulutusala.koodiArvo;
//   const anchorInitial = `tutkinnot_${areaCode}`;
//   const article = getArticle(areaCode, lupakohde.maaraykset);
//   const categories = _changes.length
//     ? getCategoriesForPerustelut(
//         article,
//         koulutusala.koulutukset,
//         kohde,
//         maaraystyyppi,
//         _changes,
//         anchorInitial,
//         muutosperustelut,
//         locale,
//         isReadOnly
//       )
//     : [];
//   return categories;
// };

export default function getTutkinnotPerustelulomake(
  action,
  data,
  isReadOnly,
  locale,
  changeObjects
) {
  switch (action) {
    case "addition":
      return getAdditionForm(data.checkboxItems, locale, isReadOnly);
    case "osaamisala":
      return getOsaamisalaForm(isReadOnly);
    case "reasoning":
      return getCategoriesForPerustelut(
        isReadOnly,
        changeObjects,
        data.tutkinnotChangeObjects,
        data.koulutusala,
        data.koulutustyypit,
        data.oivaperustelut,
        data.title,
        data.tutkinnotByKoulutustyyppi,
        locale
      );
    case "removal":
      return getRemovalForm();
    default:
      return [];
  }
}
