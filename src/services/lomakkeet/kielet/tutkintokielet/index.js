import { find, filter, map, toUpper, equals, last } from "ramda";
import { getKieletFromStorage } from "helpers/kielet";
import { getKoulutustyypitFromStorage } from "helpers/koulutustyypit";
import { getAnchorPart } from "utils/common";

async function getModificationForm(
  aktiivisetTutkinnot = [],
  isReadOnly,
  locale
) {
  const kielet = await getKieletFromStorage();
  const koulutustyypit = await getKoulutustyypitFromStorage();
  const localeUpper = toUpper(locale);
  const currentDate = new Date();
  return map(koulutustyyppi => {
    const tutkinnot = filter(tutkinto => {
      const koulutustyyppikoodiarvo = getAnchorPart(tutkinto.anchor, 1);
      if(last(tutkinto.anchor.split('.')) !== 'osaamisala')
        return equals(koulutustyyppikoodiarvo, koulutustyyppi.koodiarvo);
    }, aktiivisetTutkinnot);
    if (tutkinnot.length) {
      return {
        anchor: koulutustyyppi.koodiarvo,
        title: koulutustyyppi.metadata[localeUpper].nimi,
        categories: map(tutkinto => {
          return {
            anchor: getAnchorPart(tutkinto.anchor, 2),
            components: [
              {
                anchor: "nimi",
                name: "StatusTextRow",
                styleClasses: ['flex-2'],
                properties: {
                  code: tutkinto.koodiarvo,
                  title: tutkinto.properties.title,
                  statusTextStyleClasses: [],
                  styleClasses: []
                }
              },
              {
                anchor: "kielet",
                name: "Autocomplete",
                properties: {
                  isReadOnly,
                  options: map(kieli => {
                    return {
                      label: kieli.metadata[localeUpper].nimi,
                      value: kieli.koodiarvo
                    };
                  }, kielet),
                  value: map(tutkintokielimaarays => {
                    if (
                      tutkintokielimaarays &&
                      (!tutkintokielimaarays.koodi.voimassaAlkuPvm ||
                        new Date(tutkintokielimaarays.koodi.voimassaAlkuPvm) <=
                          currentDate)
                    ) {
                      /**
                       * Jos tutkintokielelle löytyy voimassa oleva määräys,
                       * näytetään tutkintokieli autocomplete-kentässä.
                       **/
                      return {
                        label: find(
                          kieli =>
                            kieli.koodiarvo ===
                            toUpper(tutkintokielimaarays.koodiarvo),
                          kielet
                        ).metadata[localeUpper].nimi,
                        value: tutkintokielimaarays.koodiarvo
                      };
                    }
                    return null;
                  }, tutkinto.tutkintokielet || []).filter(Boolean)
                }
              }
            ]
          };
        }, tutkinnot).filter(Boolean)
      };
    }
    return null;
  }, koulutustyypit).filter(Boolean);
}

export default async function getTutkintokieletLomake(
  action,
  data,
  { isReadOnly },
  locale
) {
  switch (action) {
    case "modification":
      return await getModificationForm(data.aktiiviset, isReadOnly, locale);
    default:
      return [];
  }
}
