import { map, toUpper, mapObjIndexed, values } from "ramda";

function getModificationForm(
  koulutustyypit,
  tutkinnotByKoulutustyyppi,
  kielet,
  locale
) {
  const localeUpper = toUpper(locale);
  const currentDate = new Date();
  return values(
    mapObjIndexed(koulutustyyppi => {
      const tutkinnot = tutkinnotByKoulutustyyppi[koulutustyyppi.koodiarvo];
      if (tutkinnot) {
        return {
          anchor: koulutustyyppi.koodiarvo,
          title: koulutustyyppi.metadata[localeUpper].nimi,
          categories: map(tutkinto => {
            return {
              anchor: tutkinto.koodiarvo,
              components: [
                {
                  anchor: "nimi",
                  name: "StatusTextRow",
                  properties: {
                    code: tutkinto.koodiarvo,
                    title: tutkinto.metadata[localeUpper].nimi,
                    statusTextStyleClasses: [],
                    styleClasses: []
                  }
                },
                {
                  anchor: "kielet",
                  name: "Autocomplete",
                  properties: {
                    options: map(kieli => {
                      return {
                        label: kieli.metadata[localeUpper].nimi,
                        value: kieli.koodiarvo
                      };
                    }, kielet),
                    value: map(tutkintokielimaarays => {
                      if (
                        tutkintokielimaarays &&
                        new Date(tutkintokielimaarays.koodi.voimassaAlkuPvm) <=
                          currentDate
                      ) {
                        /**
                         * Jos tutkintokielelle löytyy voimassa oleva määräys,
                         * näytetään tutkintokieli autocomplete-kentässä.
                         **/
                        return {
                          label:
                            tutkintokielimaarays.koodi.metadata[localeUpper]
                              .nimi,
                          value: tutkintokielimaarays.koodi.koodiarvo
                        };
                      }
                      return null;
                    }, tutkinto.tutkintokielet).filter(Boolean)
                  }
                }
              ]
            };
          }, tutkinnot).filter(Boolean)
        };
      }
      return null;
    }, koulutustyypit)
  ).filter(Boolean);
}

export default function getTutkintokieletLomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "modification":
      const result = getModificationForm(
        data.koulutustyypit,
        data.tutkinnotByKoulutustyyppi,
        data.kielet,
        locale
      );
      return result;
    default:
      return [];
  }
}
